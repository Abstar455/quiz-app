import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const QUESTION_SECONDS = 15;
const MAX_PLAYERS = 20;
const allowedCategories = new Set(["Programming", "Geography", "Mathematics", "Entertainment"]);

function response(status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function makeRoomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join("");
}

function cleanNickname(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 24);
}

async function requireRoomMember(roomId: string, userId: string) {
  const { data, error } = await admin
    .from("race_players")
    .select("nickname,is_guest,score,correct_count")
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("You are not in this room.");
  return data;
}

async function recordFinishedRoom(roomId: string) {
  const { data, error } = await admin.rpc("record_race_stats", { p_room_id: roomId });
  if (error) throw error;
  return data;
}

async function getRoomState(roomId: string, userId: string) {
  await requireRoomMember(roomId, userId);

  let { data: room, error } = await admin.from("race_rooms")
    .select("id,room_code,host_user_id,category,question_count,status,question_index,question_deadline,created_at")
    .eq("id", roomId).maybeSingle();
  if (error) throw error;
  if (!room) throw new Error("Room not found.");

  if (room.status === "live" && room.question_deadline && Date.now() > Date.parse(room.question_deadline)) {
    const { data: moved, error: moveError } = await admin.rpc("advance_race_room", { p_room_id: roomId });
    if (moveError) throw moveError;
    if (moved?.status === "finished") await recordFinishedRoom(roomId);
    ({ data: room, error } = await admin.from("race_rooms")
      .select("id,room_code,host_user_id,category,question_count,status,question_index,question_deadline,created_at")
      .eq("id", roomId).maybeSingle());
    if (error) throw error;
  }

  const { data: players, error: playersError } = await admin.from("race_players")
    .select("user_id,nickname,is_guest,score,correct_count,joined_at")
    .eq("room_id", roomId)
    .order("score", { ascending: false })
    .order("joined_at", { ascending: true });
  if (playersError) throw playersError;

  let question = null;
  let review = null;
  let myAnswers = [];
  if (room.status === "live") {
    const { data, error: questionError } = await admin.from("race_room_questions")
      .select("question_index,prompt,options")
      .eq("room_id", roomId).eq("question_index", room.question_index).maybeSingle();
    if (questionError) throw questionError;
    question = data;
  } else if (room.status === "finished") {
    const { data, error: reviewError } = await admin.from("race_room_questions")
      .select("question_index,prompt,options,correct_index,explanation")
      .eq("room_id", roomId).order("question_index", { ascending: true });
    if (reviewError) throw reviewError;
    review = data;
    const { data: answers, error: answersError } = await admin.from("race_answers")
      .select("question_index,answer_index,is_correct,points")
      .eq("room_id", roomId).eq("user_id", userId).order("question_index", { ascending: true });
    if (answersError) throw answersError;
    myAnswers = answers ?? [];
  }

  const { data: answer, error: answerError } = await admin.from("race_answers")
    .select("answer_index,is_correct,points")
    .eq("room_id", roomId).eq("user_id", userId).eq("question_index", room.question_index).maybeSingle();
  if (answerError) throw answerError;

  let persistentLeaderboard = null;
  if (room.status === "finished") {
    const { data: stats, error: statsError } = await admin.from("player_stats")
      .select("nickname,races_played,races_won,correct_answers,total_points")
      .order("races_won", { ascending: false })
      .order("total_points", { ascending: false })
      .limit(50);
    if (statsError) throw statsError;
    persistentLeaderboard = stats;
  }

  return { room, players: players ?? [], question, myAnswer: answer, review, myAnswers, persistentLeaderboard };
}

async function handleAction(user: { id: string; is_anonymous?: boolean }, body: Record<string, unknown>) {
  const action = body.action;

  if (action === "create") {
    const nickname = cleanNickname(body.nickname);
    const category = String(body.category ?? "Programming");
    const questionCount = Number(body.questionCount ?? 5);
    if (!nickname) throw new Error("Enter a nickname (1–24 characters).");
    if (!allowedCategories.has(category)) throw new Error("Choose a valid category.");
    if (questionCount !== 5) throw new Error("Race rooms currently use five questions.");
    const { error: cleanupError } = await admin.from("race_rooms").delete().lt("expires_at", new Date().toISOString());
    if (cleanupError) throw cleanupError;

    const { count, error: bankError } = await admin.from("quiz_question_bank")
      .select("id", { count: "exact", head: true })
      .eq("category", category).eq("enabled", true);
    if (bankError) throw bankError;
    if ((count ?? 0) < questionCount) throw new Error("This category needs more server question data before a room can start.");

    for (let tries = 0; tries < 5; tries++) {
      const roomCode = makeRoomCode();
      const { data: room, error: roomError } = await admin.from("race_rooms").insert({
        room_code: roomCode,
        host_user_id: user.id,
        category,
        question_count: questionCount,
      }).select("id,room_code,host_user_id,category,question_count,status,question_index,question_deadline").single();
      if (roomError) {
        if (roomError.code === "23505") continue;
        throw roomError;
      }
      const { error: playerError } = await admin.from("race_players").insert({
        room_id: room.id,
        user_id: user.id,
        nickname,
        is_guest: Boolean(user.is_anonymous),
      });
      if (playerError) throw playerError;
      return { room, playerCount: 1 };
    }
    throw new Error("Could not create a room code. Try again.");
  }

  if (action === "join") {
    const nickname = cleanNickname(body.nickname);
    const roomCode = String(body.roomCode ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!nickname) throw new Error("Enter a nickname (1–24 characters).");
    if (roomCode.length !== 6) throw new Error("Enter the six-character room code.");

    const { data: room, error } = await admin.from("race_rooms")
      .select("id,room_code,host_user_id,category,question_count,status,question_index,question_deadline")
      .eq("room_code", roomCode).maybeSingle();
    if (error) throw error;
    if (!room || room.status !== "lobby") throw new Error("That room is unavailable or has already started.");

    const { count, error: countError } = await admin.from("race_players")
      .select("user_id", { count: "exact", head: true }).eq("room_id", room.id);
    if (countError) throw countError;
    if ((count ?? 0) >= MAX_PLAYERS) throw new Error("This room is full.");

    const { error: playerError } = await admin.from("race_players").upsert({
      room_id: room.id,
      user_id: user.id,
      nickname,
      is_guest: Boolean(user.is_anonymous),
    }, { onConflict: "room_id,user_id" });
    if (playerError) throw playerError;
    return { room, playerCount: (count ?? 0) + 1 };
  }

  if (action === "start") {
    const roomId = String(body.roomId ?? "");
    await requireRoomMember(roomId, user.id);
    const { data: room, error } = await admin.from("race_rooms").select("*").eq("id", roomId).maybeSingle();
    if (error) throw error;
    if (!room || room.host_user_id !== user.id) throw new Error("Only the host can start this race.");
    if (room.status !== "lobby") throw new Error("This race has already started.");
    const { count, error: countError } = await admin.from("race_players")
      .select("user_id", { count: "exact", head: true }).eq("room_id", roomId);
    if (countError) throw countError;
    if ((count ?? 0) < 2) throw new Error("Invite at least one other player before starting.");

    const { data: bank, error: bankError } = await admin.from("quiz_question_bank")
      .select("category,prompt,options,correct_index,explanation")
      .eq("category", room.category).eq("enabled", true);
    if (bankError) throw bankError;
    const selected = (bank ?? []).sort(() => Math.random() - 0.5).slice(0, room.question_count);
    if (selected.length < room.question_count) throw new Error("Not enough questions are available for this category.");

    const { error: deleteError } = await admin.from("race_room_questions").delete().eq("room_id", roomId);
    if (deleteError) throw deleteError;
    const { error: snapshotError } = await admin.from("race_room_questions").insert(
      selected.map((q, index) => ({ room_id: roomId, question_index: index, ...q })),
    );
    if (snapshotError) throw snapshotError;

    const deadline = new Date(Date.now() + QUESTION_SECONDS * 1000).toISOString();
    const { data: started, error: startError } = await admin.from("race_rooms")
      .update({ status: "live", question_index: 0, question_deadline: deadline })
      .eq("id", roomId).eq("status", "lobby")
      .select("id,room_code,host_user_id,category,question_count,status,question_index,question_deadline")
      .maybeSingle();
    if (startError) throw startError;
    if (!started) throw new Error("This race was started by someone else.");
    return { room: started };
  }

  if (action === "answer") {
    const roomId = String(body.roomId ?? "");
    const questionIndex = Number(body.questionIndex);
    const answerIndex = Number(body.answerIndex);
    await requireRoomMember(roomId, user.id);
    if (!Number.isInteger(questionIndex) || !Number.isInteger(answerIndex)) throw new Error("Invalid answer.");
    const { data, error } = await admin.rpc("submit_race_answer", {
      p_room_id: roomId,
      p_user_id: user.id,
      p_question_index: questionIndex,
      p_answer_index: answerIndex,
    });
    if (error) throw error;
    return data;
  }

  if (action === "advance") {
    const roomId = String(body.roomId ?? "");
    await requireRoomMember(roomId, user.id);
    const { data, error } = await admin.rpc("advance_race_room", { p_room_id: roomId });
    if (error) throw error;
    if (data?.status === "finished") await recordFinishedRoom(roomId);
    return data;
  }

  if (action === "state") {
    const roomId = String(body.roomId ?? "");
    return await getRoomState(roomId, user.id);
  }

  if (action === "leave") {
    const roomId = String(body.roomId ?? "");
    await requireRoomMember(roomId, user.id);
    const { data: room, error } = await admin.from("race_rooms").select("host_user_id,status").eq("id", roomId).single();
    if (error) throw error;
    if (room.status === "lobby" && room.host_user_id === user.id) {
      const { error: cancelError } = await admin.from("race_rooms").update({ status: "cancelled" }).eq("id", roomId);
      if (cancelError) throw cancelError;
    }
    const { error: removeError } = await admin.from("race_players").delete().eq("room_id", roomId).eq("user_id", user.id);
    if (removeError) throw removeError;
    return { left: true };
  }

  if (action === "leaderboard") {
    const { data, error } = await admin.from("player_stats")
      .select("nickname,races_played,races_won,correct_answers,total_points")
      .order("races_won", { ascending: false })
      .order("total_points", { ascending: false })
      .limit(50);
    if (error) throw error;
    return { leaderboard: data ?? [] };
  }

  if (action === "syncStats") {
    if (user.is_anonymous) throw new Error("Link an account before syncing your race stats.");
    const { data: memberships, error: membershipsError } = await admin.from("race_players")
      .select("room_id").eq("user_id", user.id);
    if (membershipsError) throw membershipsError;
    for (const membership of memberships ?? []) {
      const { data: room, error: roomError } = await admin.from("race_rooms")
        .select("status").eq("id", membership.room_id).maybeSingle();
      if (roomError) throw roomError;
      if (room?.status === "finished") await recordFinishedRoom(membership.room_id);
    }
    return { synced: true };
  }

  throw new Error("Unknown race action.");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response(405, { error: "Method not allowed." });

  try {
    const authorization = request.headers.get("authorization") ?? "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    if (!token) return response(401, { error: "Sign in to play." });
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) return response(401, { error: "Your guest session expired. Rejoin the room." });

    const body = await request.json();
    const result = await handleAction(authData.user, body);
    return response(200, { data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The race request failed.";
    return response(400, { error: message });
  }
});

