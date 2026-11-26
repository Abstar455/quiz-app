(function () {
  const config = window.QUIZ_BACKEND_CONFIG || {};
  const ready = Boolean(config.supabaseUrl && config.supabasePublishableKey && window.supabase && window.supabase.createClient);
  const client = ready ? window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }) : null;
  const roomKey = "quiz_race_room_id";
  const nickKey = "quiz_race_nickname";
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
    if (code === "anonymous_provider_disabled" || /anonymous sign-ins are disabled/i.test(message)) {
      return "Guest sign-in is turned off in Supabase, so races and account linking cannot start yet. In Supabase: Authentication → Sign In / Providers → enable Anonymous Sign-Ins, then save and reload this app.";
    }
    if (/identity.*already.*linked|already been registered|already registered/i.test(message)) {
      return "That email is already connected to an account. Use Sign in to receive a sign-in link instead.";
    }
    if (/manual.*link|identity linking/i.test(message)) {
      return "Enable manual identity linking in Supabase Authentication settings, then try again.";
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
        ? await client.auth.linkIdentity({ provider: provider, options: { redirectTo: window.location.href } })
        : await client.auth.signInWithOAuth({ provider: provider, options: { redirectTo: window.location.href } });
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
      const currentUser = await guest();
      if (!currentUser.is_anonymous) throw new Error("You are already signed in.");
      const result = await client.auth.updateUser({ email: email }, { emailRedirectTo: window.location.href });
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
        options: { emailRedirectTo: window.location.href, shouldCreateUser: false }
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
  function renderLeaderboard(list, id, chartId) {
    const root = $(id);
    root.replaceChildren();
    const chart = chartId ? $(chartId) : null;
    if (chart) chart.replaceChildren();

    if (!list || !list.length) {
      const li = document.createElement("li");
      li.className = "room-player";
      li.textContent = "No linked-account scores yet. Save your stats after joining an account.";
      root.appendChild(li);
      if (chart) {
        const empty = document.createElement("p");
        empty.className = "leaderboard-chart-empty";
        empty.textContent = "The chart will appear when linked players have finished races.";
        chart.appendChild(empty);
      }
      return;
    }

    const maxWins = Math.max(1, ...list.map((entry) => Number(entry.races_won || 0)));
    if (chart) list.slice(0, 10).forEach((entry, index) => {
      const wins = Number(entry.races_won || 0);
      const row = document.createElement("div"); row.className = "leaderboard-bar-row"; row.setAttribute("aria-label", entry.nickname + ": " + wins + " wins");
      const label = document.createElement("span"); label.className = "leaderboard-bar-label";
      label.textContent = (index + 1) + ". " + entry.nickname;
      const track = document.createElement("span"); track.className = "leaderboard-bar-track";
      const bar = document.createElement("span"); bar.className = "leaderboard-bar-fill";
      bar.style.width = (wins ? Math.max(5, (wins / maxWins) * 100) : 0) + "%";
      track.appendChild(bar);
      const value = document.createElement("span"); value.className = "leaderboard-bar-value";
      value.textContent = wins + " wins";
      row.append(label, track, value); chart.appendChild(row);
    });

    list.forEach((entry, index) => {
      const li = document.createElement("li"); li.className = "room-player";
      const name = document.createElement("strong");
      name.textContent = (index + 1) + ". " + entry.nickname;
      const score = document.createElement("span");
      score.textContent = entry.races_won + " wins · " + Number(entry.total_points).toLocaleString() + " pts";
      li.append(name, score); root.appendChild(li);
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
      const podium = $("racePodium"); podium.replaceChildren();
      players.slice(0, 10).forEach((p, i) => addRow(podium, (i + 1) + ". " + p.nickname, Number(p.score || 0).toLocaleString() + " pts", false));
      renderReview(data.review, data.myAnswers);
      renderLeaderboard(data.persistentLeaderboard, "racePersistentLeaderboard", "racePersistentLeaderboardChart");
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
  async function loadLeaderboard() {
    panel("leaderboard");
    const root = $("globalLeaderboard"); root.replaceChildren();
    const li = document.createElement("li"); li.className = "room-player"; li.textContent = "Loading leaderboard…"; root.appendChild(li);
    try {
      const result = await api("leaderboard");
      renderLeaderboard(result.leaderboard, "globalLeaderboard", "globalLeaderboardChart");
    } catch (error) {
      root.replaceChildren(); const failed = document.createElement("li"); failed.className = "room-player"; failed.textContent = error.message; root.appendChild(failed);
    }
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
  $("openLeaderboardBtn").addEventListener("click", loadLeaderboard);
  $("backFromLeaderboardBtn").addEventListener("click", () => panel("hub"));
  $("toggleRaceReviewBtn").addEventListener("click", (event) => {
    const list = $("raceReviewList"); list.hidden = !list.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!list.hidden));
  });
  $("raceNickname").addEventListener("input", () => localStorage.setItem("quiz_race_last_nickname", $("raceNickname").value.slice(0,24)));
  $("joinCodeInput").addEventListener("input", () => {
    $("joinCodeInput").value = $("joinCodeInput").value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,6);
  });
  $("linkGoogleAccountBtn").addEventListener("click", () => linkProvider("google"));
  $("linkAppleAccountBtn").addEventListener("click", () => linkProvider("apple"));
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

