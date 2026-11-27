(function () {
  const config = window.QUIZ_BACKEND_CONFIG || {};
  const ready = Boolean(config.supabaseUrl && config.supabasePublishableKey && window.supabase && window.supabase.createClient);
  const client = ready ? window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }) : null;
  const roomKey = "quiz_race_room_id";
  const nickKey = "quiz_race_nickname";
  const lastRaceKey = "quiz_race_last_room_results";
  const $ = (id) => document.getElementById(id);
  let user = null, roomId = "", state = null, channel = null, poll = null, clock = null, busy = false;
  let online = new Set();

  function panel(name) {
    $("soloPlayPanel").hidden = name !== "solo";
    $("raceHubPanel").hidden = name !== "hub";
    $("raceRoomPanel").hidden = name !== "room";
    $("raceLeaderboardPanel").hidden = name !== "leaderboard";
    if (name === "hub" && !ready) notice("Multiplayer needs the free backend setup. Follow README.md; solo quiz still works.", true);
  }
  function notice(message, error) {
    $("raceStatusMessage").textContent = message || "";
    $("raceStatusMessage").classList.toggle("is-error", Boolean(error));
  }
  function localName() {
    try {
      const profile = JSON.parse(localStorage.getItem("quiz_app_user_v2") || "null");
      return profile && profile.name ? String(profile.name).slice(0, 24) : "";
    } catch (_) { return ""; }
  }
  function accountMessage(message, isError) {
    const target = $("raceAccountMessage");
    if (!target) return;
    target.textContent = message || "";
    target.classList.toggle("is-error", Boolean(isError));
  }
  function authErrorMessage(error) {
    const message = String(error && error.message || "");
    const code = String(error && error.code || "");
    if (/signups? not allowed for otp/i.test(message)) {
      return "No account was found for that email. Sign in only works for existing accounts; use Create or link with email to make a new account.";
    }
    if (code === "otp_disabled") {
      return "Supabase is rejecting email sign-in links (otp_disabled). Check that the Email provider and passwordless email sign-in are enabled in Supabase Authentication settings.";
    }
    if (code === "signup_disabled") {
      return "New email accounts are disabled in Supabase. Enable email sign-ups in Authentication settings, then try again.";
    }
    if (code === "anonymous_provider_disabled" || /anonymous sign-ins are disabled/i.test(message)) {
      return "Guest sign-in is turned off in Supabase, so open room races need Anonymous Sign-Ins enabled. Email accounts can still join after signing in.";
    }
    if (/identity.*already.*linked|already been registered|already registered/i.test(message)) {
      return "That email is already connected to an account. Use Sign in to receive a sign-in link instead.";
    }
    if (/manual.*link|identity linking/i.test(message)) {
      return "Enable Manual Identity Linking in Supabase Authentication settings, then try again.";
    }
    return message || "We couldn’t complete that request. Please try again.";
  }
  function updateAccountStatus(currentUser) {
    const target = $("raceAccountStatus");
    if (!target) return;
    if (!ready) target.textContent = "Connect the free backend to link an account and sync race stats.";
    else if (currentUser && !currentUser.is_anonymous) target.textContent = "Your race stats are linked to this account and can follow you across devices.";
    else if (currentUser && currentUser.is_anonymous) target.textContent = "You are playing as a guest. Link an email or provider to keep race stats across devices.";
    else target.textContent = "To play races as a guest, enable Anonymous Sign-Ins in your Supabase project.";
    const accountPanel = document.querySelector(".account-auth-panel");
    if (accountPanel) {
      const linked = Boolean(currentUser && !currentUser.is_anonymous);
      accountPanel.querySelectorAll(".account-provider-actions, #linkEmailForm").forEach((control) => { control.hidden = linked; });
    }
  }
  function authRedirectUrl() {
    const publicAppUrl = "https://abstar455.github.io/quiz-app/";
    const localHost = window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
    return localHost ? publicAppUrl : window.location.href;
  }
  async function guest() {
    if (!client) throw new Error("The multiplayer backend is not connected yet.");
    const result = await client.auth.getSession();
    if (result.error) throw result.error;
    if (result.data.session) { user = result.data.session.user; updateAccountStatus(user); return user; }
    const signed = await client.auth.signInAnonymously();
    if (signed.error) throw signed.error;
    user = signed.data.user;
    updateAccountStatus(user);
    return user;
  }
  async function linkProvider(provider) {
    accountMessage("");
    try {
      const currentUser = await guest();
      const result = currentUser.is_anonymous
        ? await client.auth.linkIdentity({ provider: provider, options: { redirectTo: authRedirectUrl() } })
        : await client.auth.signInWithOAuth({ provider: provider, options: { redirectTo: authRedirectUrl() } });
      if (result.error) throw result.error;
      accountMessage("Continue in the provider window to finish linking your account.");
    } catch (error) { accountMessage(authErrorMessage(error), true); }
  }
  async function linkEmail(event) {
    event.preventDefault();
    const email = $("raceAccountEmail").value.trim();
    if (!email) return accountMessage("Enter your email address first.", true);
    accountMessage("");
    try {
      let currentUser;
      try {
        currentUser = await guest();
      } catch (error) {
        if (error.code !== "anonymous_provider_disabled") throw error;
        const created = await client.auth.signInWithOtp({
          email: email,
          options: { emailRedirectTo: authRedirectUrl(), shouldCreateUser: true }
        });
        if (created.error) throw created.error;
        accountMessage("Check your inbox. This creates an email account for future race stats. Guest play is currently disabled, so there are no guest stats to attach.");
        return;
      }
      if (!currentUser.is_anonymous) throw new Error("You are already signed in.");
      const result = await client.auth.updateUser({ email: email }, { emailRedirectTo: authRedirectUrl() });
      if (result.error) throw result.error;
      accountMessage("Check your inbox to verify and link this email to your guest stats.");
    } catch (error) { accountMessage(authErrorMessage(error), true); }
  }
  async function signInExistingEmail() {
    const email = $("raceAccountEmail").value.trim();
    if (!email) return accountMessage("Enter the email on your account first.", true);
    accountMessage("");
    try {
      const result = await client.auth.signInWithOtp({
        email: email,
        options: { emailRedirectTo: authRedirectUrl(), shouldCreateUser: false }
      });
      if (result.error) throw result.error;
      accountMessage("Sign-in link sent. Open it to sign in to your saved account.");
    } catch (error) { accountMessage(authErrorMessage(error), true); }
  }
  async function api(action, args) {
    await guest();
    const result = await client.functions.invoke("race", { body: Object.assign({ action: action }, args || {}) });
    if (result.error) {
      let message = result.error.message || "The race server could not complete that request.";
      try {
        const detail = await result.error.context.json();
        if (detail && detail.error) message = detail.error;
      } catch (_) {}
      throw new Error(message);
    }
    return result.data && Object.prototype.hasOwnProperty.call(result.data, "data") ? result.data.data : result.data;
  }
  function busyButton(button, busyNow, label) {
    if (busyNow) {
      button.dataset.oldLabel = button.textContent;
      button.textContent = label;
      button.disabled = true;
    } else {
      button.textContent = button.dataset.oldLabel || button.textContent;
      button.disabled = false;
    }
  }
  function addRow(list, name, score, isOnline) {
    const item = document.createElement("li");
    item.className = "room-player";
    const left = document.createElement("strong");
    left.textContent = name + (isOnline ? " · Online" : "");
    const right = document.createElement("span");
    right.textContent = score;
    item.append(left, right);
    list.appendChild(item);
  }
  function renderPlayers(players) {
    const roster = $("roomPlayers"), scores = $("raceScores");
    roster.replaceChildren(); scores.replaceChildren();
    const ordered = (players || []).slice().sort((a,b) => Number(b.score)-Number(a.score));
    $("roomPlayerCount").textContent = "(" + ordered.length + "/20)";
    ordered.forEach((p) => {
      const isOnline = online.has(p.user_id);
      addRow(roster, p.nickname, isOnline ? "Online" : "Joined", isOnline);
      addRow(scores, p.nickname, Number(p.score || 0).toLocaleString() + " pts", isOnline);
    });
  }
  function renderFriendsChart(players, chartId) {
    const chart = $(chartId || "raceFriendsChart");
    chart.replaceChildren();
    const ranked = (players || []).slice().sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    if (!ranked.length) {
      const empty = document.createElement("p"); empty.className = "leaderboard-chart-empty";
      empty.textContent = "Race scores will appear here when this room finishes."; chart.appendChild(empty); return;
    }
    const maxScore = Math.max(1, ...ranked.map((player) => Number(player.score || 0)));
    const totalPoints = ranked.reduce((sum, player) => sum + Number(player.score || 0), 0);
    const header = document.createElement("div"); header.className = "leaderboard-chart-header";
    const title = document.createElement("strong"); title.textContent = ranked.length + (ranked.length === 1 ? " player" : " players");
    const meta = document.createElement("span"); meta.textContent = totalPoints.toLocaleString() + " points earned";
    header.append(title, meta); chart.appendChild(header);
    ranked.forEach((player, index) => {
      const points = Number(player.score || 0);
      const row = document.createElement("div"); row.className = "leaderboard-bar-row rank-" + (index + 1);
      row.setAttribute("aria-label", (index + 1) + ". " + player.nickname + ": " + points + " points");
      const rank = document.createElement("span"); rank.className = "leaderboard-rank"; rank.textContent = "#" + (index + 1);
      const playerCell = document.createElement("div"); playerCell.className = "leaderboard-player-cell";
      const label = document.createElement("span"); label.className = "leaderboard-bar-label";
      label.textContent = player.nickname;
      const track = document.createElement("span"); track.className = "leaderboard-bar-track";
      const bar = document.createElement("span"); bar.className = "leaderboard-bar-fill";
      bar.style.width = (points ? Math.max(5, points / maxScore * 100) : 0) + "%";
      track.setAttribute("aria-hidden", "true"); track.appendChild(bar); playerCell.append(label, track);
      const value = document.createElement("span"); value.className = "leaderboard-bar-value";
      value.textContent = points.toLocaleString() + " pts";
      row.append(rank, playerCell, value); chart.appendChild(row);
    });
  }
  function renderScoreList(players, listId) {
    const root = $(listId); root.replaceChildren();
    (players || []).slice().sort((a, b) => Number(b.score || 0) - Number(a.score || 0)).forEach((player, index) => {
      const row = document.createElement("li"); row.className = "room-player";
      const name = document.createElement("strong"); name.textContent = (index + 1) + ". " + player.nickname;
      const score = document.createElement("span"); score.textContent = Number(player.score || 0).toLocaleString() + " pts";
      row.append(name, score); root.appendChild(row);
    });
  }
  function renderGlobalChart(players) {
    const chart = $("friendsLeaderboardChart"); chart.replaceChildren();
    const ranked = players || [];
    if (!ranked.length) return;
    const header = document.createElement("div"); header.className = "leaderboard-chart-header";
    const title = document.createElement("strong"); title.textContent = ranked.length + (ranked.length === 1 ? " player" : " players");
    const meta = document.createElement("span"); meta.textContent = "Ranked by quiz accuracy";
    header.append(title, meta); chart.appendChild(header);
    ranked.forEach((player, index) => {
      const row = document.createElement("div"); row.className = "leaderboard-bar-row rank-" + (index + 1);
      const rank = document.createElement("span"); rank.className = "leaderboard-rank"; rank.textContent = "#" + (index + 1);
      const cell = document.createElement("div"); cell.className = "leaderboard-player-cell";
      const label = document.createElement("span"); label.className = "leaderboard-bar-label"; label.textContent = player.nickname;
      const track = document.createElement("span"); track.className = "leaderboard-bar-track";
      const bar = document.createElement("span"); bar.className = "leaderboard-bar-fill"; bar.style.width = Math.max(3, Number(player.accuracy || 0)) + "%";
      track.appendChild(bar); cell.append(label, track);
      const value = document.createElement("span"); value.className = "leaderboard-bar-value"; value.textContent = Number(player.accuracy || 0) + "%";
      row.setAttribute("aria-label", `${index + 1}. ${player.nickname}: ${player.accuracy}% accuracy across ${player.quizzes} quizzes`);
      row.append(rank, cell, value); chart.appendChild(row);
    });
  }
  function renderGlobalList(players) {
    const root = $("friendsLeaderboardList"); root.replaceChildren();
    (players || []).forEach((player, index) => {
      const row = document.createElement("li"); row.className = "room-player";
      const name = document.createElement("strong"); name.textContent = `${index + 1}. ${player.nickname}`;
      const detail = document.createElement("span"); detail.textContent = `${player.correct}/${player.questions} correct · ${player.quizzes} quizzes`;
      row.append(name, detail); root.appendChild(row);
    });
  }
  function friendMessage(message, error) {
    const target = $("friendsMessage"); target.textContent = message || ""; target.classList.toggle("is-error", Boolean(error));
  }
  async function loadFriends() {
    if (!ready) { friendMessage("Friends need the free backend connection.", true); return; }
    try {
      const data = await api("friendData", { nickname: localName() });
      $("myFriendCode").textContent = data.friendCode || "--------";
      const requests = $("friendRequestsList"); requests.replaceChildren();
      (data.incoming || []).forEach((request) => {
        const li = document.createElement("li"); li.className = "room-player";
        const label = document.createElement("strong"); label.textContent = request.nickname;
        const accept = document.createElement("button"); accept.type = "button"; accept.className = "secondary-btn compact-btn"; accept.textContent = "Accept";
        accept.addEventListener("click", async () => { try { await api("acceptFriendRequest", { requestId: request.id }); friendMessage("Friend request accepted."); await loadFriends(); } catch (e) { friendMessage(authErrorMessage(e), true); } });
        li.append(label, accept); requests.appendChild(li);
      });
      (data.outgoing || []).forEach((request) => {
        const li = document.createElement("li"); li.className = "room-player";
        const label = document.createElement("strong"); label.textContent = request.nickname;
        const status = document.createElement("span"); status.textContent = "Awaiting response";
        li.append(label, status); requests.appendChild(li);
      });
      $("friendRequestsEmpty").hidden = Boolean((data.incoming || []).length || (data.outgoing || []).length);
      const friends = $("accountFriendsList"); friends.replaceChildren();
      (data.friends || []).forEach((friend) => addRow(friends, friend.nickname, "Friend", false));
      $("accountFriendsEmpty").hidden = Boolean((data.friends || []).length);
    } catch (error) { friendMessage(authErrorMessage(error), true); }
  }
  function renderPodium(players) {
    const podium = $("racePodium"); podium.replaceChildren();
    (players || []).slice().sort((a, b) => Number(b.score || 0) - Number(a.score || 0)).slice(0, 3).forEach((player, index) => {
      const card = document.createElement("div"); card.className = "podium-card rank-" + (index + 1);
      const place = document.createElement("span"); place.className = "podium-rank";
      place.textContent = ["🥇 1st place", "🥈 2nd place", "🥉 3rd place"][index];
      const name = document.createElement("strong"); name.className = "podium-name"; name.textContent = player.nickname;
      const score = document.createElement("span"); score.className = "podium-score"; score.textContent = Number(player.score || 0).toLocaleString() + " pts";
      card.append(place, name, score); podium.appendChild(card);
    });
  }
  function renderReview(review, myAnswers) {
    const root = $("raceReviewList"); root.replaceChildren();
    const byIndex = new Map((myAnswers || []).map((answer) => [answer.question_index, answer]));
    (review || []).forEach((q) => {
      const card = document.createElement("article"); card.className = "race-review-card";
      const h = document.createElement("h4"); h.textContent = (q.question_index + 1) + ". " + q.prompt;
      const a = byIndex.get(q.question_index);
      const your = document.createElement("p");
      your.textContent = "Your answer: " + (a && q.options[a.answer_index] ? q.options[a.answer_index] : "No answer submitted");
      const correct = document.createElement("p"); correct.textContent = "Correct answer: " + q.options[q.correct_index];
      const why = document.createElement("p"); why.textContent = "Why: " + q.explanation;
      card.append(h, your, correct, why); root.appendChild(card);
    });
  }
  function renderRoom(data) {
    state = data;
    const room = data.room, players = data.players || [];
    $("roomCodeValue").textContent = room.room_code;
    $("roomTitle").textContent = room.status === "live" ? "Race in progress" : room.status === "finished" ? "Race results" : "Waiting room";
    $("roomStateEyebrow").textContent = room.status === "live" ? "RACE LIVE" : room.status === "finished" ? "RACE COMPLETE" : "WAITING ROOM";
    $("roomCategoryText").textContent = room.category + " · " + room.question_count + " questions · 15 seconds each";
    renderPlayers(players);
    const host = room.host_user_id === (user && user.id);
    $("raceLobbyView").hidden = room.status !== "lobby";
    $("racePlayView").hidden = room.status !== "live";
    $("raceFinishedView").hidden = room.status !== "finished";
    $("startRoomBtn").hidden = !host;
    $("startRoomBtn").disabled = !host || players.length < 2;
    $("hostWaitNote").textContent = host
      ? (players.length < 2 ? "Share the code above. Start when at least two players are here." : "Everyone is here. Start the five-question race.")
      : "Waiting for the host to start the race.";

    if (room.status === "live") {
      renderFriendsChart(players, "raceFriendsChartLive");
      $("raceQuestionStatus").textContent = "Question " + (room.question_index + 1) + " of " + room.question_count;
      $("raceProgressFill").style.width = Math.round(((room.question_index + 1) / room.question_count) * 100) + "%";
      $("raceQuestionText").textContent = data.question ? data.question.prompt : "Preparing question…";
      const options = $("raceOptions"); options.replaceChildren();
      const submitted = Boolean(data.myAnswer);
      (data.question && data.question.options || []).forEach((choice, index) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "race-answer" + (data.myAnswer && data.myAnswer.answer_index === index ? " is-selected" : "");
        b.textContent = choice; b.disabled = submitted;
        b.addEventListener("click", async () => {
          b.disabled = true;
          try {
            await api("answer", { roomId: roomId, questionIndex: room.question_index, answerIndex: index });
            $("raceFeedback").textContent = "Answer locked. Scores update at the end.";
            await refresh();
            await announce();
          } catch (error) { $("raceFeedback").textContent = error.message; }
        });
        options.appendChild(b);
      });
      $("raceFeedback").textContent = submitted ? "Answer locked. Scores update at the end." : "";
      runClock(room.question_deadline);
    } else stopClock();

    if (room.status === "finished") {
      renderPodium(players);
      renderFriendsChart(players, "raceFriendsChart");
      renderScoreList(players, "raceFinalScores");
      renderReview(data.review, data.myAnswers);
      try {
        sessionStorage.setItem(lastRaceKey, JSON.stringify({
          roomCode: room.room_code,
          category: room.category,
          finishedAt: Date.now(),
          players: players.map((player) => ({ nickname: player.nickname, score: Number(player.score || 0) }))
        }));
      } catch (_) {}
    }
  }
  function stopClock() { if (clock) clearInterval(clock); clock = null; }
  function runClock(deadline) {
    stopClock();
    const tick = async () => {
      const left = Math.max(0, Math.ceil((Date.parse(deadline) - Date.now()) / 1000));
      $("raceTimer").textContent = String(left);
      if (left === 0 && !busy) {
        busy = true;
        try {
          const result = await api("advance", { roomId: roomId });
          if (result && result.changed) await announce();
        } catch (_) {
        } finally { busy = false; }
        await refresh();
      }
    };
    tick(); clock = setInterval(tick, 250);
  }
  async function announce() {
    if (!channel) return;
    try { await channel.send({ type: "broadcast", event: "refresh", payload: { time: Date.now() } }); } catch (_) {}
  }
  async function refresh() {
    if (!roomId || busy) return;
    busy = true;
    try {
      const result = await api("state", { roomId: roomId });
      renderRoom(result);
    } catch (error) {
      notice(error.message, true);
      if (error.message.indexOf("not in this room") >= 0) {
        await reset(); panel("hub");
      }
    } finally { busy = false; }
  }
  async function subscribe() {
    if (!client || !roomId) return;
    if (channel) { await client.removeChannel(channel); channel = null; }
    channel = client.channel("race:" + roomId, { config: { private: true, presence: { key: user.id } } });
    channel.on("broadcast", { event: "refresh" }, refresh);
    channel.on("presence", { event: "sync" }, () => {
      online = new Set(Object.keys(channel.presenceState()));
      if (state) renderPlayers(state.players);
    });
    channel.on("presence", { event: "join" }, refresh);
    channel.on("presence", { event: "leave" }, refresh);
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ nickname: $("raceNickname").value.trim(), onlineAt: Date.now() });
        await refresh();
      }
    });
  }
  async function enterRoom(room, nickname) {
    roomId = room.id;
    sessionStorage.setItem(roomKey, room.id);
    sessionStorage.setItem(nickKey, nickname);
    $("raceNickname").value = nickname;
    notice("");
    panel("room");
    await guest();
    await subscribe();
    if (!poll) poll = setInterval(refresh, 4000);
    await refresh();
  }
  async function createRoom() {
    const nickname = $("raceNickname").value.trim();
    if (!nickname) { notice("Enter a nickname first.", true); return; }
    busyButton($("createRaceBtn"), true, "Creating…");
    try {
      const result = await api("create", { nickname: nickname, category: $("raceCategory").value, questionCount: 5 });
      await enterRoom(result.room, nickname);
    } catch (error) { notice(authErrorMessage(error), true); }
    finally { busyButton($("createRaceBtn"), false); }
  }
  async function joinRoom() {
    const nickname = $("raceNickname").value.trim();
    if (!nickname) { notice("Enter a nickname first.", true); return; }
    busyButton($("joinRaceBtn"), true, "Joining…");
    try {
      const result = await api("join", { nickname: nickname, roomCode: $("joinCodeInput").value });
      await enterRoom(result.room, nickname); await announce();
    } catch (error) { notice(authErrorMessage(error), true); }
    finally { busyButton($("joinRaceBtn"), false); }
  }
  async function startRoom() {
    if (!roomId) return;
    busyButton($("startRoomBtn"), true, "Starting…");
    try {
      await api("start", { roomId: roomId }); await announce(); await refresh();
    } catch (error) { notice(authErrorMessage(error), true); }
    finally { busyButton($("startRoomBtn"), false); }
  }
  async function loadLeaderboard(mode) {
    panel("leaderboard");
    const selected = mode || "overall";
    $("overallBoardTab").classList.toggle("active", selected === "overall");
    $("friendsBoardTab").classList.toggle("active", selected === "friends");
    $("overallBoardTab").setAttribute("aria-selected", String(selected === "overall"));
    $("friendsBoardTab").setAttribute("aria-selected", String(selected === "friends"));
    $("leaderboardStatus").textContent = "Loading standings…";
    $("friendsLeaderboardEmpty").hidden = true;
    $("friendsLeaderboardResults").hidden = true;
    try {
      const data = await api("leaderboard", { mode: selected, nickname: localName() });
      const players = data.players || [];
      $("leaderboardStatus").textContent = "";
      const hasResults = players.length > 0;
      $("friendsLeaderboardEmpty").hidden = hasResults;
      $("friendsLeaderboardResults").hidden = !hasResults;
      $("leaderboardEmptyTitle").textContent = selected === "friends" && !data.friendCount ? "Add friends to start your board" : "No quiz results yet";
      $("leaderboardEmptyCopy").textContent = selected === "friends" && !data.friendCount ? "Use the Friends section in Account to share codes and accept requests." : "Complete a solo quiz or race to appear on the board.";
      if (!hasResults) return;
      $("friendsLeaderboardCaption").textContent = selected === "friends" ? "You and your accepted friends · lifetime quiz accuracy" : "Everyone who has completed a quiz · lifetime accuracy";
      renderGlobalChart(players); renderGlobalList(players);
    } catch (error) { $("leaderboardStatus").textContent = authErrorMessage(error); }
  }
  async function recordSoloResult(result) {
    return await api("recordSolo", Object.assign({ nickname: localName() }, result));
  }
  async function reset(callLeave) {
    stopClock();
    if (poll) clearInterval(poll); poll = null;
    if (callLeave && roomId && client) { try { await api("leave", { roomId: roomId }); } catch (_) {} }
    if (channel && client) { try { await client.removeChannel(channel); } catch (_) {} }
    channel = null; roomId = ""; state = null; online.clear();
    sessionStorage.removeItem(roomKey); sessionStorage.removeItem(nickKey);
  }
  async function copyCode() {
    const code = $("roomCodeValue").textContent;
    try {
      await navigator.clipboard.writeText(code);
      $("copyRoomCodeBtn").textContent = "Copied";
      setTimeout(() => { $("copyRoomCodeBtn").textContent = "Copy"; }, 1200);
    } catch (_) { notice("Share this room code: " + code); }
  }

  $("openRaceHubBtn").addEventListener("click", () => {
    panel("hub");
    $("raceNickname").value = $("raceNickname").value || localStorage.getItem("quiz_race_last_nickname") || localName();
    guest().then(() => notice("You are ready to create or join a race.")).catch((error) => notice(authErrorMessage(error), true));
  });
  $("backToSoloBtn").addEventListener("click", () => panel("solo"));
  $("createRaceBtn").addEventListener("click", createRoom);
  $("joinRaceBtn").addEventListener("click", joinRoom);
  $("startRoomBtn").addEventListener("click", startRoom);
  $("copyRoomCodeBtn").addEventListener("click", copyCode);
  $("leaveRoomBtn").addEventListener("click", async () => { await reset(true); panel("hub"); });
  $("newRaceBtn").addEventListener("click", async () => { await reset(true); panel("hub"); });
  $("openLeaderboardBtn").addEventListener("click", () => loadLeaderboard("overall"));
  $("overallBoardTab").addEventListener("click", () => loadLeaderboard("overall"));
  $("friendsBoardTab").addEventListener("click", () => loadLeaderboard("friends"));
  $("backFromLeaderboardBtn").addEventListener("click", () => panel("hub"));
  $("navAccountBtn").addEventListener("click", () => { loadFriends(); });
  $("addFriendForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = $("friendCodeInput").value.trim().toUpperCase();
    if (!code) return friendMessage("Enter your friend’s code first.", true);
    try {
      const result = await api("sendFriendRequest", { friendCode: code, nickname: localName() });
      $("friendCodeInput").value = "";
      friendMessage(`Request sent to ${result.nickname}.`);
      await loadFriends();
    } catch (error) { friendMessage(authErrorMessage(error), true); }
  });
  $("friendCodeInput").addEventListener("input", () => { $("friendCodeInput").value = $("friendCodeInput").value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8); });
  $("copyFriendCodeBtn").addEventListener("click", async () => {
    const code = $("myFriendCode").textContent;
    if (!/^[A-Z0-9]{8}$/.test(code)) return friendMessage("Open Account while online to create your friend code.", true);
    try { await navigator.clipboard.writeText(code); friendMessage("Friend code copied."); }
    catch (_) { friendMessage("Your friend code is " + code); }
  });
  $("toggleRaceReviewBtn").addEventListener("click", (event) => {
    const list = $("raceReviewList"); list.hidden = !list.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!list.hidden));
  });
  $("raceNickname").addEventListener("input", () => localStorage.setItem("quiz_race_last_nickname", $("raceNickname").value.slice(0,24)));
  $("joinCodeInput").addEventListener("input", () => {
    $("joinCodeInput").value = $("joinCodeInput").value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,6);
  });
  if ($("linkGoogleAccountBtn")) $("linkGoogleAccountBtn").addEventListener("click", () => linkProvider("google"));
  if ($("linkAppleAccountBtn")) $("linkAppleAccountBtn").addEventListener("click", () => linkProvider("apple"));
  $("linkEmailForm").addEventListener("submit", linkEmail);
  $("signInEmailAccountBtn").addEventListener("click", signInExistingEmail);
  if (client) {
    client.auth.onAuthStateChange((_event, session) => {
      user = session && session.user ? session.user : null;
      updateAccountStatus(user);
      if (user && !user.is_anonymous) {
        window.setTimeout(() => client.functions.invoke("race", { body: { action: "syncStats" } })
          .then(({ error }) => { if (error) accountMessage("Account linked. Some older race stats could not sync yet.", true); })
          .catch(() => {}), 0);
      }
    });
    client.auth.getSession().then(({ data }) => updateAccountStatus(data.session && data.session.user));
  } else {
    updateAccountStatus(null);
  }

  window.QuizMultiplayer = { recordSoloResult };

  const savedRoom = sessionStorage.getItem(roomKey);
  if (savedRoom && ready) {
    roomId = savedRoom;
    $("raceNickname").value = sessionStorage.getItem(nickKey) || localName();
    guest().then(async () => {
      panel("room"); await subscribe();
      if (!poll) poll = setInterval(refresh, 4000);
      await refresh();
    }).catch(() => { sessionStorage.removeItem(roomKey); sessionStorage.removeItem(nickKey); });
  }
})();

