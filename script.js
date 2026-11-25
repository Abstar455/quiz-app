(function () {
  const PROFILE_KEY = "quiz_app_user_v2";
  const TIME_PER_QUESTION = 15;

  // Full UI Translations (English, French, Spanish, Twi)
  const TEXT = {
    en: {
      welcomeNav: (name) => `Welcome, ${name}`,
      quizNav: "Quiz",
      accountNav: "Account",
      sfxOn: "SFX: ON",
      sfxOff: "SFX: OFF",
      voiceOn: "Voice: ON",
      voiceOff: "Voice: OFF",
      onboardHeading: "Quiz Setup",
      onboardSubtext: "Select your language and accept the terms to continue.",
      langLabel: "Language",
      termsText: "I agree to the Terms and Conditions for using this quiz app.",
      nextBtn: "Next",
      signupHeading: "Create Account",
      signupSubtext: "Set up your profile details to begin.",
      nameLabel: "Name",
      ageLabel: "Age",
      methodLabel: "Sign-In Method",
      voiceLabel: "Account Voice",
      male: "Male",
      female: "Female",
      avatarLabel: "Profile Picture",
      useLetterBtn: "First Letter",
      uploadPhotoLabel: "Upload Photo",
      letterCaption: "First letter avatar",
      photoCaption: "Custom image avatar",
      backBtn: "Back",
      finishSignup: "Finish Sign Up",
      accountHeading: "Account Details",
      accName: (v) => `Name: ${v}`,
      accAge: (v) => `Age: ${v}`,
      accMethod: (v) => `Sign-In: ${v}`,
      accLang: (v) => `Language: ${v}`,
      accVoice: (v) => `Voice: ${v}`,
      accLangLabel: "Change Language",
      accVoiceLabel: "Account Voice",
      editProfileBtn: "Edit Profile",
      backToQuizBtn: "Back to Quiz",
      cfgTitle: "Quiz Configuration",
      cfgCategoryLabel: "Select Category",
      cfgCountLabel: "No. of Questions",
      categories: {
        Programming: "Programming",
        Geography: "Geography",
        Mathematics: "Mathematics",
        Entertainment: "Entertainment"
      },
      ruleNote: (count, maxErr) =>
        `Reward rule for ${count} questions: ${maxErr} or fewer mistakes (or all correct). More mistakes trigger a meme.`,
      startQuizBtn: "Start Quiz",
      quizHeaderTitle: "Quiz Application",
      scoreStat: (s, t) => `Score: ${s}/${t}`,
      mistakesStat: (m, maxErr) => `Mistakes: ${m} (Max ${maxErr})`,
      statusText: (cur, tot) => `${cur} of ${tot} Questions`,
      timedOutNote: (exp) => `Time ran out. Counted as a mistake. ${exp}`,
      rewardBadge: "REWARD",
      rewardTitle: "Congratulations",
      rewardMsg: (name, s, tot, m) =>
        `${name}, you scored ${s} out of ${tot} with ${m} mistake${m === 1 ? "" : "s"}. Reward earned.`,
      punishmentTitle: "Meme Punishment",
      jokeText: (name, m, tot) =>
        `Joke for ${name}: You racked up ${m} mistake${m === 1 ? "" : "s"} out of ${tot} questions. Even the timer had second-hand embarrassment.`,
      adviceText: (m, maxErr, missedSummary) =>
        `Improvement note: You had ${m} mistake${m === 1 ? "" : "s"} (allowed: ${maxErr}). ${missedSummary} Read each prompt carefully before tapping.`,
      missedPrefix: (topics) => `Focus on: ${topics}.`,
      noMissedTopics: "Watch out for time pressure and close answer choices.",
      tryAgainBtn: "Try Again",
      retryMissedBtn: "Retry Missed",
      voicePass: (s, tot) => `Reward earned. ${s} out of ${tot} correct.`,
      voiceFail: (m, tot) => `${m} mistakes out of ${tot}. Check your improvement note and try again.`
    },
    fr: {
      welcomeNav: (name) => `Bienvenue, ${name}`,
      quizNav: "Quiz",
      accountNav: "Compte",
      sfxOn: "SFX : ACTIF",
      sfxOff: "SFX : INACTIF",
      voiceOn: "Voix : ACTIVE",
      voiceOff: "Voix : INACTIVE",
      onboardHeading: "Configuration du Quiz",
      onboardSubtext: "Choisissez votre langue et acceptez les conditions pour continuer.",
      langLabel: "Langue",
      termsText: "J'accepte les conditions générales d'utilisation de cette application.",
      nextBtn: "Suivant",
      signupHeading: "Créer un Compte",
      signupSubtext: "Renseignez vos informations pour personnaliser votre profil.",
      nameLabel: "Nom",
      ageLabel: "Âge",
      methodLabel: "Méthode de Connexion",
      voiceLabel: "Voix du Compte",
      male: "Homme",
      female: "Femme",
      avatarLabel: "Photo de Profil",
      useLetterBtn: "Première Lettre",
      uploadPhotoLabel: "Importer Photo",
      letterCaption: "Avatar première lettre",
      photoCaption: "Image personnalisée",
      backBtn: "Retour",
      finishSignup: "Terminer",
      accountHeading: "Détails du Compte",
      accName: (v) => `Nom : ${v}`,
      accAge: (v) => `Âge : ${v}`,
      accMethod: (v) => `Connexion : ${v}`,
      accLang: (v) => `Langue : ${v}`,
      accVoice: (v) => `Voix : ${v}`,
      accLangLabel: "Changer de Langue",
      accVoiceLabel: "Voix du Compte",
      editProfileBtn: "Modifier Profil",
      backToQuizBtn: "Retour au Quiz",
      cfgTitle: "Configuration du Quiz",
      cfgCategoryLabel: "Choisir une Catégorie",
      cfgCountLabel: "Nombre de Questions",
      categories: {
        Programming: "Programmation",
        Geography: "Géographie",
        Mathematics: "Mathématiques",
        Entertainment: "Divertissement"
      },
      ruleNote: (count, maxErr) =>
        `Règle pour ${count} questions : ${maxErr} erreur(s) max (ou tout juste). Au-delà, un mème s'affiche.`,
      startQuizBtn: "Démarrer",
      quizHeaderTitle: "Application Quiz",
      scoreStat: (s, t) => `Score : ${s}/${t}`,
      mistakesStat: (m, maxErr) => `Erreurs : ${m} (Max ${maxErr})`,
      statusText: (cur, tot) => `${cur} sur ${tot} Questions`,
      timedOutNote: (exp) => `Temps écoulé. Compté comme erreur. ${exp}`,
      rewardBadge: "RÉCOMPENSE",
      rewardTitle: "Félicitations",
      rewardMsg: (name, s, tot, m) =>
        `${name}, vous avez obtenu ${s} sur ${tot} avec ${m} erreur${m > 1 ? "s" : ""}. Récompense débloquée.`,
      punishmentTitle: "Punition Mème",
      jokeText: (name, m, tot) =>
        `Blague pour ${name} : ${m} erreur${m > 1 ? "s" : ""} sur ${tot} questions. Même le chronomètre a soupiré.`,
      adviceText: (m, maxErr, missedSummary) =>
        `Note d'amélioration : ${m} erreur${m > 1 ? "s" : ""} (limite : ${maxErr}). ${missedSummary} Lisez bien chaque question.`,
      missedPrefix: (topics) => `À revoir : ${topics}.`,
      noMissedTopics: "Attention au temps et aux réponses proches.",
      tryAgainBtn: "Réessayer",
      retryMissedBtn: "Revoir Erreurs",
      voicePass: (s, tot) => `Récompense débloquée. ${s} sur ${tot}.`,
      voiceFail: (m, tot) => `${m} erreurs sur ${tot}. Lisez le conseil et réessayez.`
    },
    es: {
      welcomeNav: (name) => `Bienvenido, ${name}`,
      quizNav: "Quiz",
      accountNav: "Cuenta",
      sfxOn: "SFX: ON",
      sfxOff: "SFX: OFF",
      voiceOn: "Voz: ON",
      voiceOff: "Voz: OFF",
      onboardHeading: "Configuración Inicial",
      onboardSubtext: "Elige tu idioma y acepta los términos para continuar.",
      langLabel: "Idioma",
      termsText: "Acepto los Términos y Condiciones de esta aplicación de quiz.",
      nextBtn: "Siguiente",
      signupHeading: "Crear Cuenta",
      signupSubtext: "Completa tus datos para configurar tu perfil.",
      nameLabel: "Nombre",
      ageLabel: "Edad",
      methodLabel: "Método de Acceso",
      voiceLabel: "Voz de Cuenta",
      male: "Masculina",
      female: "Femenina",
      avatarLabel: "Foto de Perfil",
      useLetterBtn: "Primera Letra",
      uploadPhotoLabel: "Subir Foto",
      letterCaption: "Avatar de primera letra",
      photoCaption: "Imagen personalizada",
      backBtn: "Atrás",
      finishSignup: "Finalizar Registro",
      accountHeading: "Detalles de Cuenta",
      accName: (v) => `Nombre: ${v}`,
      accAge: (v) => `Edad: ${v}`,
      accMethod: (v) => `Acceso: ${v}`,
      accLang: (v) => `Idioma: ${v}`,
      accVoice: (v) => `Voz: ${v}`,
      accLangLabel: "Cambiar Idioma",
      accVoiceLabel: "Voz de Cuenta",
      editProfileBtn: "Editar Perfil",
      backToQuizBtn: "Volver al Quiz",
      cfgTitle: "Configuración del Quiz",
      cfgCategoryLabel: "Seleccionar Categoría",
      cfgCountLabel: "Número de Preguntas",
      categories: {
        Programming: "Programación",
        Geography: "Geografía",
        Mathematics: "Matemáticas",
        Entertainment: "Entretenimiento"
      },
      ruleNote: (count, maxErr) =>
        `Regla para ${count} preguntas: máximo ${maxErr} error(es) (o todo bien). Si pasas, sale un meme.`,
      startQuizBtn: "Iniciar Quiz",
      quizHeaderTitle: "Aplicación de Quiz",
      scoreStat: (s, t) => `Puntos: ${s}/${t}`,
      mistakesStat: (m, maxErr) => `Errores: ${m} (Máx ${maxErr})`,
      statusText: (cur, tot) => `${cur} de ${tot} Preguntas`,
      timedOutNote: (exp) => `Se acabó el tiempo. Cuenta como error. ${exp}`,
      rewardBadge: "RECOMPENSA",
      rewardTitle: "Felicidades",
      rewardMsg: (name, s, tot, m) =>
        `${name}, lograste ${s} de ${tot} con ${m} error${m === 1 ? "" : "es"}. Recompensa ganada.`,
      punishmentTitle: "Castigo Meme",
      jokeText: (name, m, tot) =>
        `Chiste para ${name}: acumulaste ${m} error${m === 1 ? "" : "es"} de ${tot} preguntas. Hasta el reloj se quedó mirando.`,
      adviceText: (m, maxErr, missedSummary) =>
        `Nota de mejora: tuviste ${m} error${m === 1 ? "" : "es"} (permitidos: ${maxErr}). ${missedSummary} Revisa bien cada opción.`,
      missedPrefix: (topics) => `Repasa: ${topics}.`,
      noMissedTopics: "Cuida el tiempo y lee cada pregunta con calma.",
      tryAgainBtn: "Intentar de Nuevo",
      retryMissedBtn: "Repetir Fallos",
      voicePass: (s, tot) => `Recompensa ganada. ${s} de ${tot}.`,
      voiceFail: (m, tot) => `${m} errores de ${tot}. Lee la nota e inténtalo de nuevo.`
    },
    tw: {
      welcomeNav: (name) => `Akwaaba, ${name}`,
      quizNav: "Quiz",
      accountNav: "Akaunti",
      sfxOn: "Nnyɛe: WƆ SO",
      sfxOff: "Nnyɛe: ADUM",
      voiceOn: "Nne: WƆ SO",
      voiceOff: "Nne: ADUM",
      onboardHeading: "Quiz Nhyehyɛe",
      onboardSubtext: "Paw wo kasa na gye mmara no tom ansa na wɔakɔ so.",
      langLabel: "Kasa",
      termsText: "Megye quiz app yi mmara ne ne nhyehyɛe tom.",
      nextBtn: "Kɔ So",
      signupHeading: "Bɔ Akaunti",
      signupSubtext: "Hyɛ wo nsɛm ma yɛnsiesie wo profile.",
      nameLabel: "Din",
      ageLabel: "Mfe",
      methodLabel: "Kwan a Wode Wura Mu",
      voiceLabel: "Akaunti Nne",
      male: "Barima",
      female: "Ɔbea",
      avatarLabel: "Mfonini",
      useLetterBtn: "Nkyerɛwde a Edi Kan",
      uploadPhotoLabel: "Fa Mfonini",
      letterCaption: "Din nkyerɛwde a edi kan",
      photoCaption: "Wo ankasa mfonini",
      backBtn: "San Kyi",
      finishSignup: "Wie",
      accountHeading: "Akaunti Nsɛm",
      accName: (v) => `Din: ${v}`,
      accAge: (v) => `Mfe: ${v}`,
      accMethod: (v) => `Kwan: ${v}`,
      accLang: (v) => `Kasa: ${v}`,
      accVoice: (v) => `Nne: ${v}`,
      accLangLabel: "Sesa Kasa",
      accVoiceLabel: "Akaunti Nne",
      editProfileBtn: "Sesa Profile",
      backToQuizBtn: "San Kɔ Quiz",
      cfgTitle: "Quiz Nhyehyɛe",
      cfgCategoryLabel: "Paw Nsɛmti",
      cfgCountLabel: "Nsɛmmisa Dodow",
      categories: {
        Programming: "Programming",
        Geography: "Geography",
        Mathematics: "Mathematics",
        Entertainment: "Entertainment"
      },
      ruleNote: (count, maxErr) =>
        `Nsɛmmisa ${count} mmara: mfomso ${maxErr} anaasɛ nea ɛnnu saa (anaasɛ fa nyinaa). Wotra so a meme bɛba.`,
      startQuizBtn: "Fi Quiz Ase",
      quizHeaderTitle: "Quiz App",
      scoreStat: (s, t) => `Nkontaa: ${s}/${t}`,
      mistakesStat: (m, maxErr) => `Mfomso: ${m} (Kɛse ${maxErr})`,
      statusText: (cur, tot) => `${cur} wɔ ${tot} Mu`,
      timedOutNote: (exp) => `Berɛ no asa. Wɔabu no sɛ mfomso. ${exp}`,
      rewardBadge: "AKATUA",
      rewardTitle: "Mo Ne Adwuma",
      rewardMsg: (name, s, tot, m) =>
        `${name}, woanya ${s} wɔ ${tot} mu a mfomso yɛ ${m}. Wɔama wo akatua.`,
      punishmentTitle: "Meme Asotwe",
      jokeText: (name, m, tot) =>
        `Asɛm ketewa ma ${name}: woanya mfomso ${m} wɔ nsɛmmisa ${tot} mu. Berɛ no mpo hwɛɛ wo dinn.`,
      adviceText: (m, maxErr, missedSummary) =>
        `Nsɛm a ɛbɛboa wo: mfomso ${m} (kɛse: ${maxErr}). ${missedSummary} Kenkan asɛmmisa no yie ansa na woapaw.`,
      missedPrefix: (topics) => `Hwɛ yi so yie: ${topics}.`,
      noMissedTopics: "Hwɛ berɛ so na kenkan nsɛmmisa no yie.",
      tryAgainBtn: "San Bɔ Mmɔden",
      retryMissedBtn: "San Sɔ Nea Wofom",
      voicePass: (s, tot) => `Woanya akatua. ${s} wɔ ${tot}.`,
      voiceFail: (m, tot) => `Mfomso ${m} wɔ ${tot}. Kenkan afotu no na san bɔ mmɔden.`
    }
  };

  // Elements
  const topNav = document.getElementById("topNav");
  const navAvatar = document.getElementById("navAvatar");
  const navTitle = document.getElementById("navTitle");
  const navQuizBtn = document.getElementById("navQuizBtn");
  const navAccountBtn = document.getElementById("navAccountBtn");
  const navSfxBtn = document.getElementById("navSfxBtn");
  const navVoiceBtn = document.getElementById("navVoiceBtn");

  const onboardingScreen = document.getElementById("onboardingScreen");
  const configScreen = document.getElementById("configScreen");
  const signupScreen = document.getElementById("signupScreen");
  const accountScreen = document.getElementById("accountScreen");
  const quizScreen = document.getElementById("quizScreen");
  const resultScreen = document.getElementById("resultScreen");

  const onboardLangSelect = document.getElementById("onboardLangSelect");
  const termsCheck = document.getElementById("termsCheck");
  const toSignupBtn = document.getElementById("toSignupBtn");

  const signupForm = document.getElementById("signupForm");
  const signupName = document.getElementById("signupName");
  const signupAge = document.getElementById("signupAge");
  const signupMethod = document.getElementById("signupMethod");
  const signupVoice = document.getElementById("signupVoice");
  const useLetterBtn = document.getElementById("useLetterBtn");
  const avatarUpload = document.getElementById("avatarUpload");
  const signupAvatarPreview = document.getElementById("signupAvatarPreview");
  const avatarMethodCaption = document.getElementById("avatarMethodCaption");
  const backToOnboardBtn = document.getElementById("backToOnboardBtn");

  const accountLangSelect = document.getElementById("accountLangSelect");
  const accountVoiceSelect = document.getElementById("accountVoiceSelect");
  const reEditProfileBtn = document.getElementById("reEditProfileBtn");
  const backToQuizFromAccBtn = document.getElementById("backToQuizFromAccBtn");

  const startQuizBtn = document.getElementById("startQuizBtn");
  const timerBox = document.getElementById("timerBox");
  const timerText = document.getElementById("timerText");
  const progressFill = document.getElementById("progressFill");
  const scoreStat = document.getElementById("scoreStat");
  const mistakesStat = document.getElementById("mistakesStat");
  const questionText = document.getElementById("questionText");
  const answerOptions = document.getElementById("answerOptions");
  const explanationText = document.getElementById("explanationText");
  const questionStatus = document.getElementById("questionStatus");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");

  const rewardView = document.getElementById("rewardView");
  const punishmentView = document.getElementById("punishmentView");
  const memeCanvas = document.getElementById("memeCanvas");
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  const retryMissedBtn = document.getElementById("retryMissedBtn");

  // State
  let user = loadUser();
  let draftAvatarType = user.avatarType || "letter";
  let draftAvatarPhoto = user.avatarPhoto || "";
  let selectedCategory = "Programming";
  let selectedCount = 10;
  let questions = [];
  let missedList = [];
  let qIndex = 0;
  let currentQ = null;
  let score = 0;
  let mistakes = 0;
  let timeLeft = TIME_PER_QUESTION;
  let timerId = null;

  function loadUser() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      completedOnboarding: false,
      registered: false,
      createdAt: Date.now(),
      sessions: 0,
      language: "en",
      name: "",
      age: "",
      method: "Email",
      voice: "female",
      avatarType: "letter",
      avatarPhoto: "",
      sfx: true,
      voiceEnabled: true
    };
  }

  function saveUser() {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    } catch (_) {}
  }

  // Silent background adaptation tracker (2-6 months)
  function recordBackgroundAdaptation() {
    const days = Math.floor((Date.now() - (user.createdAt || Date.now())) / 86400000);
    user.sessions = (user.sessions || 0) + 1;
    user.adaptationPhase = days >= 120 ? "months_4_to_6" : days >= 60 ? "months_2_to_3" : "month_1";
    saveUser();
  }

  function t() {
    return TEXT[user.language] || TEXT.en;
  }

  // Sound Effects (Web Audio API)
  let ctx = null;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  function tone(freq, dur, type, delay, vol) {
    if (!user.sfx) return;
    const c = audio();
    if (!c) return;
    const t0 = c.currentTime + (delay || 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(vol || 0.11, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }

  const sfx = {
    tap: () => tone(540, 0.06, "triangle", 0, 0.09),
    tick: () => tone(820, 0.04, "sine", 0, 0.05),
    right: () => {
      tone(587, 0.1, "triangle", 0, 0.12);
      tone(880, 0.16, "triangle", 0.08, 0.12);
    },
    wrong: () => {
      tone(210, 0.15, "sawtooth", 0, 0.1);
      tone(150, 0.2, "sawtooth", 0.11, 0.1);
    },
    win: () => {
      tone(523, 0.11, "triangle", 0, 0.13);
      tone(659, 0.11, "triangle", 0.1, 0.13);
      tone(784, 0.11, "triangle", 0.2, 0.13);
      tone(1046, 0.28, "triangle", 0.31, 0.15);
    },
    lose: () => {
      tone(300, 0.13, "sawtooth", 0, 0.11);
      tone(240, 0.13, "sawtooth", 0.12, 0.11);
      tone(175, 0.28, "sawtooth", 0.24, 0.12);
    }
  };

  // Consistent Account Voice (Male / Female)
  function speak(line) {
    if (!user.voiceEnabled || !("speechSynthesis" in window) || !line) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(line);
    const voices = window.speechSynthesis.getVoices();
    const isFemale = user.voice !== "male";
    const pick = voices.find((v) => {
      const n = v.name.toLowerCase();
      return isFemale
        ? n.includes("female") || n.includes("zira") || n.includes("samantha") || n.includes("victoria")
        : n.includes("male") || n.includes("david") || n.includes("daniel") || n.includes("mark");
    });
    if (pick) msg.voice = pick;
    msg.pitch = isFemale ? 1.15 : 0.86;
    window.speechSynthesis.speak(msg);
  }

  function applyAvatar(el, nameStr, type, photoData) {
    if (type === "photo" && photoData) {
      el.innerHTML = `<img src="${photoData}" alt="" />`;
      return;
    }
    const ch = ((nameStr || "A").trim().charAt(0) || "A").toUpperCase();
    el.textContent = ch;
  }

  function getMaxMistakes(count) {
    return Math.max(0, Math.floor(count / 5));
  }

  function applyAllTranslations() {
    const tr = t();
    document.documentElement.lang = user.language || "en";

    onboardLangSelect.value = user.language || "en";
    accountLangSelect.value = user.language || "en";
    accountVoiceSelect.value = user.voice || "female";

    navTitle.textContent = tr.welcomeNav(user.name || "User");
    navQuizBtn.textContent = tr.quizNav;
    navAccountBtn.textContent = tr.accountNav;
    navSfxBtn.textContent = user.sfx ? tr.sfxOn : tr.sfxOff;
    navVoiceBtn.textContent = user.voiceEnabled ? tr.voiceOn : tr.voiceOff;
    navSfxBtn.classList.toggle("muted", !user.sfx);
    navVoiceBtn.classList.toggle("muted", !user.voiceEnabled);

    document.getElementById("onboardHeading").textContent = tr.onboardHeading;
    document.getElementById("onboardSubtext").textContent = tr.onboardSubtext;
    document.getElementById("langLabel").textContent = tr.langLabel;
    document.getElementById("termsText").textContent = tr.termsText;
    toSignupBtn.textContent = tr.nextBtn;

    document.getElementById("signupHeading").textContent = tr.signupHeading;
    document.getElementById("signupSubtext").textContent = tr.signupSubtext;
    document.getElementById("nameLabel").textContent = tr.nameLabel;
    document.getElementById("ageLabel").textContent = tr.ageLabel;
    document.getElementById("methodLabel").textContent = tr.methodLabel;
    document.getElementById("voiceLabel").textContent = tr.voiceLabel;
    signupVoice.options[0].textContent = tr.female;
    signupVoice.options[1].textContent = tr.male;
    accountVoiceSelect.options[0].textContent = tr.female;
    accountVoiceSelect.options[1].textContent = tr.male;
    document.getElementById("avatarLabel").textContent = tr.avatarLabel;
    useLetterBtn.textContent = tr.useLetterBtn;
    document.getElementById("uploadPhotoLabel").textContent = tr.uploadPhotoLabel;
    avatarMethodCaption.textContent = draftAvatarType === "photo" && draftAvatarPhoto ? tr.photoCaption : tr.letterCaption;
    backToOnboardBtn.textContent = tr.backBtn;
    document.getElementById("completeSignupBtn").textContent = tr.finishSignup;

    document.getElementById("accountHeading").textContent = tr.accountHeading;
    document.getElementById("accNameOut").textContent = tr.accName(user.name || "");
    document.getElementById("accAgeOut").textContent = tr.accAge(user.age || "");
    document.getElementById("accMethodOut").textContent = tr.accMethod(user.method || "Email");
    document.getElementById("accLangOut").textContent = tr.accLang(accountLangSelect.options[accountLangSelect.selectedIndex].text);
    document.getElementById("accVoiceOut").textContent = tr.accVoice(user.voice === "male" ? tr.male : tr.female);
    document.getElementById("accLangLabel").textContent = tr.accLangLabel;
    document.getElementById("accVoiceLabel").textContent = tr.accVoiceLabel;
    reEditProfileBtn.textContent = tr.editProfileBtn;
    backToQuizFromAccBtn.textContent = tr.backToQuizBtn;

    document.getElementById("cfgTitle").textContent = tr.cfgTitle;
    document.getElementById("cfgCategoryLabel").textContent = tr.cfgCategoryLabel;
    document.getElementById("cfgCountLabel").textContent = tr.cfgCountLabel;
    document.getElementById("catProg").textContent = tr.categories.Programming;
    document.getElementById("catGeo").textContent = tr.categories.Geography;
    document.getElementById("catMath").textContent = tr.categories.Mathematics;
    document.getElementById("catEnt").textContent = tr.categories.Entertainment;
    document.getElementById("ruleNoteText").textContent = tr.ruleNote(selectedCount, getMaxMistakes(selectedCount));
    startQuizBtn.textContent = tr.startQuizBtn;

    document.getElementById("quizHeaderTitle").textContent = tr.quizHeaderTitle;
    nextQuestionBtn.textContent = tr.nextBtn;
    tryAgainBtn.textContent = tr.tryAgainBtn;
    retryMissedBtn.textContent = tr.retryMissedBtn;

    applyAvatar(navAvatar, user.name, user.avatarType, user.avatarPhoto);
    applyAvatar(accountAvatarView, user.name, user.avatarType, user.avatarPhoto);
    applyAvatar(signupAvatarPreview, signupName.value || user.name, draftAvatarType, draftAvatarPhoto);

    if (quizScreen.style.display === "block" && questions.length > 0) {
      const maxErr = getMaxMistakes(questions.length);
      scoreStat.textContent = tr.scoreStat(score, questions.length);
      mistakesStat.textContent = tr.mistakesStat(mistakes, maxErr);
      questionStatus.textContent = tr.statusText(qIndex, questions.length);
    }
  }

  function showOnly(target) {
    [onboardingScreen, signupScreen, configScreen, accountScreen, quizScreen, resultScreen].forEach((sec) => {
      sec.style.display = sec === target ? "block" : "none";
    });
    topNav.style.display = user.registered ? "flex" : "none";
    navQuizBtn.classList.toggle("active", target === configScreen || target === quizScreen || target === resultScreen);
    navAccountBtn.classList.toggle("active", target === accountScreen);
  }

  // Question Generator (Dynamic, no static limit)
  function rand(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function makeItem(topic, prompt, correct, wrong, exp) {
    const unique = Array.from(new Set([String(correct), ...wrong.map(String)])).slice(0, 4);
    const opts = shuffle(unique);
    return {
      topic,
      question: prompt,
      options: opts,
      correctAnswer: opts.indexOf(String(correct)),
      explanation: exp
    };
  }

  function genQuestion(cat, n) {
    const c = cat.toLowerCase();
    if (c === "mathematics") {
      const mode = (n + rand(0, 2)) % 3;
      if (mode === 0) {
        const a = rand(10, 50);
        const b = rand(6, 30);
        const ans = a + b;
        return makeItem("Arithmetic", `What is ${a} + ${b}?`, ans, [ans + 3, ans - 2, ans + 7], `${a} + ${b} = ${ans}.`);
      }
      if (mode === 1) {
        const a = rand(4, 15);
        const b = rand(3, 12);
        const ans = a * b;
        return makeItem("Multiplication", `What is ${a} × ${b}?`, ans, [ans + b, Math.max(1, ans - a), ans + 6], `${a} × ${b} = ${ans}.`);
      }
      const x = rand(2, 10);
      const rhs = 2 * x + 4;
      return makeItem("Algebra", `Solve for x: 2x + 4 = ${rhs}`, x, [x + 1, Math.max(1, x - 1), x + 2], `2x = ${rhs - 4}, so x = ${x}.`);
    }

    const pools = {
      programming: [
        ["Arrays", "Which method adds an item to the end of a JavaScript array?", "push()", ["pop()", "shift()", "slice()"], "push() adds elements to the end."],
        ["HTML", "Which HTML tag creates a hyperlink?", "<a>", ["<link>", "<href>", "<url>"], "<a> defines a link."],
        ["CSS", "Which CSS property adds space inside a border?", "padding", ["margin", "gap", "float"], "padding is inside the border."],
        ["Databases", "What does SQL stand for?", "Structured Query Language", ["Simple Query List", "Standard Question Log", "System Queue Link"], "SQL queries structured data."],
        ["Git", "Which command saves staged changes to local history?", "git commit", ["git pull", "git status", "git branch"], "git commit records a snapshot."]
      ],
      geography: [
        ["Capitals", "What is the capital city of Ghana?", "Accra", ["Kumasi", "Tamale", "Cape Coast"], "Accra is the capital of Ghana."],
        ["Rivers", "Which river is the longest in the world?", "Nile River", ["Amazon River", "Congo River", "Niger River"], "The Nile is the longest river."],
        ["Continents", "Which continent has the largest land area?", "Asia", ["Africa", "Europe", "Australia"], "Asia is the largest continent."],
        ["Oceans", "Which ocean is the largest on Earth?", "Pacific Ocean", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], "The Pacific is the largest ocean."],
        ["Deserts", "Which is the largest hot desert in the world?", "Sahara Desert", ["Gobi Desert", "Kalahari Desert", "Mojave Desert"], "The Sahara is the largest hot desert."]
      ],
      entertainment: [
        ["Animation", "Which movie features a snowman named Olaf?", "Frozen", ["Moana", "Tangled", "Encanto"], "Olaf is in Frozen."],
        ["Studio", "Which studio made 'Spirited Away'?", "Studio Ghibli", ["Pixar", "DreamWorks", "Illumination"], "Studio Ghibli produced Spirited Away."],
        ["Music", "Who is known as the 'King of Pop'?", "Michael Jackson", ["Elvis Presley", "Prince", "Stevie Wonder"], "Michael Jackson is the King of Pop."],
        ["Gaming", "What does 'NPC' stand for in video games?", "Non-Player Character", ["New Player Control", "Next Playable Class", "Network Player Core"], "NPC means Non-Player Character."],
        ["Film", "Which movie features Captain Jack Sparrow?", "Pirates of the Caribbean", ["Star Wars", "Dune", "Inception"], "Jack Sparrow is in Pirates of the Caribbean."]
      ]
    };

    const list = pools[c] || pools.programming;
    const row = list[n % list.length];
    const cycle = Math.floor(n / list.length) + 1;
    const prompt = cycle > 1 ? `${row[1]} (#${cycle})` : row[1];
    return makeItem(row[0], prompt, row[2], row[3], row[4]);
  }

  function buildDeck(cat, count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(genQuestion(cat, i));
    }
    return out;
  }

  // Draw Meme Card on Canvas (No emojis)
  function drawMemeCard(name, errCount, totCount) {
    const c = memeCanvas.getContext("2d");
    if (!c) return;
    const w = memeCanvas.width;
    const h = memeCanvas.height;

    c.fillStyle = "#121212";
    c.fillRect(0, 0, w, h);

    c.strokeStyle = "#5145BA";
    c.lineWidth = 6;
    c.strokeRect(8, 8, w - 16, h - 16);

    // Simple geometric meme face in center
    c.fillStyle = "#5145BA";
    c.beginPath();
    c.arc(w / 2, h / 2, 42, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = "#FFFFFF";
    c.lineWidth = 4;
    // Eyes
    c.beginPath();
    c.moveTo(w / 2 - 18, h / 2 - 12);
    c.lineTo(w / 2 - 8, h / 2 - 6);
    c.lineTo(w / 2 - 18, h / 2);
    c.moveTo(w / 2 + 18, h / 2 - 12);
    c.lineTo(w / 2 + 8, h / 2 - 6);
    c.lineTo(w / 2 + 18, h / 2);
    // Flat mouth
    c.moveTo(w / 2 - 14, h / 2 + 16);
    c.lineTo(w / 2 + 14, h / 2 + 16);
    c.stroke();

    c.fillStyle = "#FFFFFF";
    c.textAlign = "center";
    c.font = "bold 24px Impact, 'Arial Black', sans-serif";
    c.fillText(`${name.toUpperCase()} TOOK ${errCount}/${totCount} L'S`, w / 2, 42);
    c.fillText("THE TIMER WATCHED IN SILENCE", w / 2, h - 22);
  }

  // Timer & Gameplay
  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    timeLeft = TIME_PER_QUESTION;
    timerText.textContent = `${timeLeft}s`;
    timerBox.style.background = "var(--timer-grey)";

    timerId = setInterval(() => {
      timeLeft--;
      timerText.textContent = `${timeLeft}s`;
      if (timeLeft > 0 && timeLeft <= 5) sfx.tick();

      if (timeLeft <= 0) {
        stopTimer();
        timerBox.style.background = "var(--timer-red)";
        mistakes++;
        missedList.push(currentQ);
        sfx.wrong();
        updateStatsBar();
        revealOptions(null);
        lockOptions();
        explanationText.textContent = t().timedOutNote(currentQ.explanation);
        explanationText.style.display = "block";
        nextQuestionBtn.style.visibility = "visible";
      }
    }, 1000);
  }

  function updateStatsBar() {
    const tr = t();
    const maxErr = getMaxMistakes(questions.length);
    scoreStat.textContent = tr.scoreStat(score, questions.length);
    mistakesStat.textContent = tr.mistakesStat(mistakes, maxErr);
  }

  function lockOptions() {
    answerOptions.querySelectorAll(".answer-option").forEach((li) => {
      li.style.pointerEvents = "none";
    });
  }

  function revealOptions(pickedIdx) {
    answerOptions.querySelectorAll(".answer-option").forEach((li, idx) => {
      if (idx === currentQ.correctAnswer) {
        li.classList.add("correct");
      } else if (idx === pickedIdx) {
        li.classList.add("incorrect");
      }
    });
  }

  function pickAnswer(li, idx) {
    stopTimer();
    const ok = idx === currentQ.correctAnswer;
    if (ok) {
      score++;
      sfx.right();
    } else {
      mistakes++;
      missedList.push(currentQ);
      sfx.wrong();
    }
    updateStatsBar();
    revealOptions(idx);
    lockOptions();
    explanationText.textContent = currentQ.explanation;
    explanationText.style.display = "block";
    nextQuestionBtn.style.visibility = "visible";
  }

  function renderNext() {
    if (qIndex >= questions.length) {
      finishSession();
      return;
    }

    currentQ = questions[qIndex];
    qIndex++;

    const tr = t();
    progressFill.style.width = `${Math.round((qIndex / questions.length) * 100)}%`;
    questionStatus.textContent = tr.statusText(qIndex, questions.length);
    questionText.textContent = currentQ.question;
    explanationText.style.display = "none";
    nextQuestionBtn.style.visibility = "hidden";
    answerOptions.innerHTML = "";
    updateStatsBar();

    currentQ.options.forEach((opt, idx) => {
      const li = document.createElement("li");
      li.className = "answer-option";
      li.textContent = opt;
      li.addEventListener("click", () => pickAnswer(li, idx));
      answerOptions.appendChild(li);
    });

    startTimer();
  }

  function beginQuiz(overrideList) {
    questions = overrideList || buildDeck(selectedCategory, selectedCount);
    missedList = [];
    qIndex = 0;
    score = 0;
    mistakes = 0;
    recordBackgroundAdaptation();
    showOnly(quizScreen);
    renderNext();
  }

  function finishSession() {
    stopTimer();
    const tr = t();
    const tot = questions.length;
    const maxErr = getMaxMistakes(tot);
    const passed = mistakes <= maxErr;

    showOnly(resultScreen);
    retryMissedBtn.style.display = missedList.length > 0 ? "inline-block" : "none";

    if (passed) {
      rewardView.style.display = "block";
      punishmentView.style.display = "none";
      document.getElementById("rewardBadge").textContent = tr.rewardBadge;
      document.getElementById("rewardTitle").textContent = tr.rewardTitle;
      document.getElementById("rewardMsg").textContent = tr.rewardMsg(user.name || "User", score, tot, mistakes);
      sfx.win();
      speak(tr.voicePass(score, tot));
    } else {
      rewardView.style.display = "none";
      punishmentView.style.display = "block";
      drawMemeCard(user.name || "User", mistakes, tot);
      document.getElementById("punishmentTitle").textContent = tr.punishmentTitle;
      document.getElementById("punishmentJoke").textContent = tr.jokeText(user.name || "User", mistakes, tot);

      const topics = Array.from(new Set(missedList.map((m) => m.topic)));
      const missedSummary = topics.length > 0 ? tr.missedPrefix(topics.join(", ")) : tr.noMissedTopics;
      document.getElementById("improvementBox").textContent = tr.adviceText(mistakes, maxErr, missedSummary);

      sfx.lose();
      speak(tr.voiceFail(mistakes, tot));
    }
  }

  // Onboarding & Sign-Up Listeners
  onboardLangSelect.addEventListener("change", () => {
    sfx.tap();
    user.language = onboardLangSelect.value;
    saveUser();
    applyAllTranslations();
  });

  termsCheck.addEventListener("change", () => {
    sfx.tap();
    toSignupBtn.disabled = !termsCheck.checked;
  });

  toSignupBtn.addEventListener("click", () => {
    if (!termsCheck.checked) return;
    sfx.tap();
    user.completedOnboarding = true;
    saveUser();
    signupName.value = user.name || "";
    signupAge.value = user.age || "";
    signupMethod.value = user.method || "Email";
    signupVoice.value = user.voice || "female";
    draftAvatarType = user.avatarType || "letter";
    draftAvatarPhoto = user.avatarPhoto || "";
    useLetterBtn.classList.toggle("active", draftAvatarType === "letter");
    applyAvatar(signupAvatarPreview, signupName.value, draftAvatarType, draftAvatarPhoto);
    showOnly(signupScreen);
  });

  backToOnboardBtn.addEventListener("click", () => {
    sfx.tap();
    termsCheck.checked = Boolean(user.completedOnboarding);
    toSignupBtn.disabled = !termsCheck.checked;
    showOnly(onboardingScreen);
  });

  signupName.addEventListener("input", () => {
    applyAvatar(signupAvatarPreview, signupName.value, draftAvatarType, draftAvatarPhoto);
  });

  useLetterBtn.addEventListener("click", () => {
    sfx.tap();
    draftAvatarType = "letter";
    useLetterBtn.classList.add("active");
    applyAvatar(signupAvatarPreview, signupName.value, draftAvatarType, draftAvatarPhoto);
    applyAllTranslations();
  });

  avatarUpload.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      draftAvatarPhoto = String(reader.result || "");
      draftAvatarType = "photo";
      useLetterBtn.classList.remove("active");
      applyAvatar(signupAvatarPreview, signupName.value, draftAvatarType, draftAvatarPhoto);
      applyAllTranslations();
    };
    reader.readAsDataURL(file);
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sfx.tap();
    user.name = signupName.value.trim();
    user.age = signupAge.value.trim();
    user.method = signupMethod.value;
    user.voice = signupVoice.value;
    user.avatarType = draftAvatarType;
    user.avatarPhoto = draftAvatarPhoto;
    user.registered = true;
    saveUser();
    applyAllTranslations();
    showOnly(configScreen);
  });

  // Navigation Bar Listeners
  navQuizBtn.addEventListener("click", () => {
    sfx.tap();
    stopTimer();
    showOnly(configScreen);
  });

  navAccountBtn.addEventListener("click", () => {
    sfx.tap();
    stopTimer();
    applyAllTranslations();
    showOnly(accountScreen);
  });

  navSfxBtn.addEventListener("click", () => {
    user.sfx = !user.sfx;
    saveUser();
    applyAllTranslations();
    if (user.sfx) sfx.tap();
  });

  navVoiceBtn.addEventListener("click", () => {
    sfx.tap();
    user.voiceEnabled = !user.voiceEnabled;
    saveUser();
    applyAllTranslations();
  });

  accountLangSelect.addEventListener("change", () => {
    sfx.tap();
    user.language = accountLangSelect.value;
    saveUser();
    applyAllTranslations();
  });

  accountVoiceSelect.addEventListener("change", () => {
    sfx.tap();
    user.voice = accountVoiceSelect.value;
    saveUser();
    applyAllTranslations();
  });

  reEditProfileBtn.addEventListener("click", () => {
    sfx.tap();
    signupName.value = user.name || "";
    signupAge.value = user.age || "";
    signupMethod.value = user.method || "Email";
    signupVoice.value = user.voice || "female";
    draftAvatarType = user.avatarType || "letter";
    draftAvatarPhoto = user.avatarPhoto || "";
    useLetterBtn.classList.toggle("active", draftAvatarType === "letter");
    applyAvatar(signupAvatarPreview, signupName.value, draftAvatarType, draftAvatarPhoto);
    showOnly(signupScreen);
  });

  backToQuizFromAccBtn.addEventListener("click", () => {
    sfx.tap();
    showOnly(configScreen);
  });

  // Config Listeners
  document.querySelectorAll(".category-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      document.querySelectorAll(".category-option").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCategory = btn.dataset.cat;
    });
  });

  document.querySelectorAll(".question-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      document.querySelectorAll(".question-option").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCount = parseInt(btn.dataset.count, 10);
      applyAllTranslations();
    });
  });

  startQuizBtn.addEventListener("click", () => {
    sfx.tap();
    beginQuiz(null);
  });

  nextQuestionBtn.addEventListener("click", () => {
    sfx.tap();
    renderNext();
  });

  tryAgainBtn.addEventListener("click", () => {
    sfx.tap();
    stopTimer();
    showOnly(configScreen);
  });

  retryMissedBtn.addEventListener("click", () => {
    sfx.tap();
    if (missedList.length > 0) {
      beginQuiz(missedList.slice());
    }
  });

  // Boot
  applyAllTranslations();
  if (user.registered && user.name) {
    showOnly(configScreen);
  } else if (user.completedOnboarding) {
    showOnly(signupScreen);
  } else {
    showOnly(onboardingScreen);
  }
})();
