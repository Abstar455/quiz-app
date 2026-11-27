(function () {
  const PROFILE_KEY = "quiz_app_user_v2";
  const TIME_PER_QUESTION = 15;

  // Full UI Translations (English, French, Spanish, Twi)
  const TEXT = {
    en: {
      welcomeNav: (name) => `Welcome, ${name}`,
      quizNav: "Home",
      accountNav: "Account",
      settingsNav: "Settings",
      settingsHeading: "Settings",
      settingsSubtext: "Choose your language, voice, and sound preferences.",
      settingsExperience: "Experience",
      settingsData: "Your data",
      settingsDataNote: "This prototype stores your profile in this browser. Sign-in and cloud sync are not connected.",
      resumeTitle: "Paused quiz",
      resumeSummary: (category, count, question) => `${category} · ${count} questions · Question ${question} of ${count}`,
      resumeBtn: "Resume quiz",
      discardBtn: "Discard",
      reviewBtn: "Review answers",
      hideReviewBtn: "Hide review",
      reviewHeading: "Your answers",
      reviewStatusCorrect: "Correct",
      reviewStatusMissed: "Needs review",
      reviewYourAnswer: "Your answer",
      reviewCorrectAnswer: "Correct answer",
      reviewNoAnswer: "No answer submitted",
      reviewTimedOut: "Time ran out",
      reviewExplanation: "Why",
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
      emailLabel: "Email address",
      emailHint: "This prototype keeps your profile on this device. Email sign-in is not connected yet.",
      methodHint: (method) => method === "Guest" ? "A guest profile is saved only in this browser." : method === "Email" ? "This is a local profile; password and email verification are not enabled." : `${method} sign-in needs provider setup and is shown as a preview.`,
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
      accEmail: (v) => v ? `Email: ${v}` : "No email on this guest profile",
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
      quizNav: "Accueil",
      accountNav: "Compte",
      settingsNav: "Réglages",
      settingsHeading: "Réglages",
      settingsSubtext: "Choisissez la langue, la voix et les sons.",
      settingsExperience: "Préférences",
      settingsData: "Vos données",
      settingsDataNote: "Cette version conserve le profil dans ce navigateur. La connexion et la synchronisation ne sont pas activées.",
      resumeTitle: "Quiz en pause",
      resumeSummary: (category, count, question) => `${category} · ${count} questions · Question ${question} sur ${count}`,
      resumeBtn: "Reprendre",
      discardBtn: "Abandonner",
      reviewBtn: "Revoir les réponses",
      hideReviewBtn: "Masquer la correction",
      reviewHeading: "Vos réponses",
      reviewStatusCorrect: "Correct",
      reviewStatusMissed: "À revoir",
      reviewYourAnswer: "Votre réponse",
      reviewCorrectAnswer: "Bonne réponse",
      reviewNoAnswer: "Aucune réponse envoyée",
      reviewTimedOut: "Temps écoulé",
      reviewExplanation: "Explication",
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
      emailLabel: "Adresse e-mail",
      emailHint: "Cette version conserve le profil sur cet appareil. La connexion par e-mail n'est pas activée.",
      methodHint: (method) => method === "Guest" ? "Le profil invité est enregistré dans ce navigateur." : method === "Email" ? "Profil local : mot de passe et vérification ne sont pas activés." : `La connexion ${method} nécessite une configuration du fournisseur.`,
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
      accEmail: (v) => v ? `E-mail : ${v}` : "Aucun e-mail sur ce profil invité",
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
      quizNav: "Inicio",
      accountNav: "Cuenta",
      settingsNav: "Ajustes",
      settingsHeading: "Ajustes",
      settingsSubtext: "Elige el idioma, la voz y los sonidos.",
      settingsExperience: "Preferencias",
      settingsData: "Tus datos",
      settingsDataNote: "Esta versión guarda el perfil en este navegador. El acceso y la sincronización en la nube no están conectados.",
      resumeTitle: "Quiz en pausa",
      resumeSummary: (category, count, question) => `${category} · ${count} preguntas · Pregunta ${question} de ${count}`,
      resumeBtn: "Reanudar quiz",
      discardBtn: "Descartar",
      reviewBtn: "Revisar respuestas",
      hideReviewBtn: "Ocultar revisión",
      reviewHeading: "Tus respuestas",
      reviewStatusCorrect: "Correcta",
      reviewStatusMissed: "Para repasar",
      reviewYourAnswer: "Tu respuesta",
      reviewCorrectAnswer: "Respuesta correcta",
      reviewNoAnswer: "Sin respuesta",
      reviewTimedOut: "Se acabó el tiempo",
      reviewExplanation: "Explicación",
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
      emailLabel: "Correo electrónico",
      emailHint: "Esta versión guarda el perfil en este dispositivo. El acceso por correo aún no está conectado.",
      methodHint: (method) => method === "Guest" ? "El perfil de invitado se guarda solo en este navegador." : method === "Email" ? "Perfil local; no hay contraseña ni verificación de correo." : `El acceso con ${method} necesita configurar el proveedor.`,
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
      accEmail: (v) => v ? `Correo: ${v}` : "Este perfil de invitado no tiene correo",
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
      quizNav: "Fie",
      accountNav: "Akaunti",
      settingsNav: "Nhyehyɛe",
      settingsHeading: "Nhyehyɛe",
      settingsSubtext: "Paw kasa, nne ne nnyɛe a wopɛ.",
      settingsExperience: "Wo pɛde",
      settingsData: "Wo data",
      settingsDataNote: "Saa prototype yi sie profile wɔ browser yi mu. Sign-in ne cloud sync nni hɔ.",
      resumeTitle: "Quiz a agyae",
      resumeSummary: (category, count, question) => `${category} · nsɛmmisa ${count} · Asɛmmisa ${question} wɔ ${count} mu`,
      resumeBtn: "San toa so",
      discardBtn: "Pepa",
      reviewBtn: "Hwɛ mmuae",
      hideReviewBtn: "Fa review no sie",
      reviewHeading: "Wo mmuae",
      reviewStatusCorrect: "Ɛyɛ nokware",
      reviewStatusMissed: "San hwɛ eyi",
      reviewYourAnswer: "Wo mmuae",
      reviewCorrectAnswer: "Mmuae a ɛyɛ nokware",
      reviewNoAnswer: "Wommuae",
      reviewTimedOut: "Bere no asa",
      reviewExplanation: "Nkyerɛmu",
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
      emailLabel: "Email",
      emailHint: "Saa bere yi sie wo profile wɔ mfiri yi so. Email login nni hɔ seesei.",
      methodHint: (method) => method === "Guest" ? "Wɔde guest profile no sie browser yi mu." : method === "Email" ? "Ɛyɛ local profile; password ne email verification nni hɔ." : `Ɛsɛ sɛ wɔhyehyɛ ${method} login provider no ansa.`,
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
      accEmail: (v) => v ? `Email: ${v}` : "Guest profile yi nni email",
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
  const appHeader = document.getElementById("appHeader");
  const navAvatar = document.getElementById("navAvatar");
  const navTitle = document.getElementById("navTitle");
  const navQuizBtn = document.getElementById("navQuizBtn");
  const navAccountBtn = document.getElementById("navAccountBtn");
  const navSettingsBtn = document.getElementById("navSettingsBtn");
  const navSfxBtn = document.getElementById("navSfxBtn");
  const navVoiceBtn = document.getElementById("navVoiceBtn");

  const onboardingScreen = document.getElementById("onboardingScreen");
  const configScreen = document.getElementById("configScreen");
  const signupScreen = document.getElementById("signupScreen");
  const accountScreen = document.getElementById("accountScreen");
  const settingsScreen = document.getElementById("settingsScreen");
  const quizScreen = document.getElementById("quizScreen");
  const resultScreen = document.getElementById("resultScreen");
  const resumePanel = document.getElementById("resumePanel");
  const resumeQuizBtn = document.getElementById("resumeQuizBtn");
  const discardResumeBtn = document.getElementById("discardResumeBtn");
  const reviewPanel = document.getElementById("reviewPanel");
  const reviewList = document.getElementById("reviewList");
  const toggleReviewBtn = document.getElementById("toggleReviewBtn");

  const onboardLangSelect = document.getElementById("onboardLangSelect");
  const termsCheck = document.getElementById("termsCheck");
  const toSignupBtn = document.getElementById("toSignupBtn");

  const signupForm = document.getElementById("signupForm");
  const signupName = document.getElementById("signupName");
  const signupEmail = document.getElementById("signupEmail");
  const signupEmailField = document.getElementById("signupEmailField");
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
  let answered = false;
  let pickedAnswer = null;
  let answers = [];
  let savedAttempt = null;
  let feedbackText = "";
  const ATTEMPT_KEY = "quiz_app_attempt_v1";

  function loadUser() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return { ...{ completedOnboarding: false, registered: false, createdAt: Date.now(), sessions: 0, language: "en", name: "", email: "", age: "", method: "Email", voice: "female", avatarType: "letter", avatarPhoto: "", sfx: true, voiceEnabled: true }, ...JSON.parse(raw) };
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

  function loadAttempt() {
    try {
      const saved = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "null");
      if (!saved || !Array.isArray(saved.questions) || !saved.questions.length || !saved.currentQ) return null;
      return saved;
    } catch (_) {
      return null;
    }
  }

  function clearSavedAttempt() {
    try { localStorage.removeItem(ATTEMPT_KEY); } catch (_) {}
    savedAttempt = null;
    renderResumePanel();
  }

  function saveAttempt() {
    if (!questions.length || !currentQ) return;
    savedAttempt = {
      version: 1,
      category: selectedCategory,
      selectedCount,
      questions,
      missedList,
      qIndex,
      currentQ,
      score,
      mistakes,
      timeLeft,
      answered,
      pickedAnswer,
      answers,
      feedbackText,
      savedAt: Date.now()
    };
    try { localStorage.setItem(ATTEMPT_KEY, JSON.stringify(savedAttempt)); } catch (_) {}
    renderResumePanel();
  }

  function renderResumePanel() {
    const tr = t();
    document.getElementById("resumeTitle").textContent = tr.resumeTitle;
    resumeQuizBtn.textContent = tr.resumeBtn;
    discardResumeBtn.textContent = tr.discardBtn;
    if (!savedAttempt) {
      resumePanel.hidden = true;
      return;
    }
    const category = tr.categories[savedAttempt.category] || savedAttempt.category;
    const count = savedAttempt.questions.length;
    const question = Math.min(savedAttempt.qIndex || 1, count);
    document.getElementById("resumeSummary").textContent = tr.resumeSummary(category, count, question);
    resumePanel.hidden = false;
  }

  function renderAnswerReview() {
    const tr = t();
    document.getElementById("reviewHeading").textContent = tr.reviewHeading;
    reviewList.replaceChildren();
    questions.forEach((question, index) => {
      const response = answers[index] || null;
      const isCorrect = Boolean(response && response.isCorrect);
      const card = document.createElement("article");
      card.className = `review-item ${isCorrect ? "is-correct" : "is-incorrect"}`;

      const head = document.createElement("div");
      head.className = "review-item-head";
      const number = document.createElement("h4");
      number.textContent = `${index + 1}. ${question.question}`;
      const status = document.createElement("span");
      status.className = "review-status";
      status.textContent = isCorrect ? tr.reviewStatusCorrect : tr.reviewStatusMissed;
      head.append(number, status);

      const yourAnswer = document.createElement("p");
      const chosen = response && Number.isInteger(response.selectedIndex)
        ? question.options[response.selectedIndex]
        : tr.reviewNoAnswer;
      yourAnswer.textContent = `${tr.reviewYourAnswer}: ${response && response.timedOut ? tr.reviewTimedOut : chosen}`;

      const correctAnswer = document.createElement("p");
      correctAnswer.textContent = `${tr.reviewCorrectAnswer}: ${question.options[question.correctAnswer]}`;

      const explanation = document.createElement("p");
      explanation.className = "review-explanation";
      explanation.textContent = `${tr.reviewExplanation}: ${question.explanation}`;

      card.append(head, yourAnswer, correctAnswer, explanation);
      reviewList.appendChild(card);
    });
  }

  function resumeSavedAttempt() {
    const attempt = savedAttempt;
    if (!attempt) return;
    stopTimer();
    selectedCategory = attempt.category || "Programming";
    selectedCount = attempt.selectedCount || attempt.questions.length;
    questions = attempt.questions;
    missedList = Array.isArray(attempt.missedList) ? attempt.missedList : [];
    qIndex = Math.max(1, Math.min(attempt.qIndex || 1, questions.length));
    currentQ = attempt.currentQ || questions[qIndex - 1];
    score = Number(attempt.score) || 0;
    mistakes = Number(attempt.mistakes) || 0;
    timeLeft = Math.max(1, Math.min(TIME_PER_QUESTION, Number(attempt.timeLeft) || TIME_PER_QUESTION));
    answered = Boolean(attempt.answered);
    pickedAnswer = Number.isInteger(attempt.pickedAnswer) ? attempt.pickedAnswer : null;
    answers = Array.isArray(attempt.answers) ? attempt.answers : [];
    feedbackText = attempt.feedbackText || "";
    document.querySelectorAll(".category-option").forEach((button) => {
      const selected = button.dataset.cat === selectedCategory;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll(".question-option").forEach((button) => {
      const selected = Number(button.dataset.count) === selectedCount;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    showOnly(quizScreen);
    renderCurrentQuestion();
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
      const image = document.createElement("img");
      image.src = photoData;
      image.alt = "";
      el.replaceChildren(image);
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
    document.getElementById("navHomeLabel").textContent = tr.quizNav;
    document.getElementById("navAccountLabel").textContent = tr.accountNav;
    document.getElementById("navSettingsLabel").textContent = tr.settingsNav;
    document.getElementById("settingsHeading").textContent = tr.settingsHeading;
    document.getElementById("settingsSubtext").textContent = tr.settingsSubtext;
    document.getElementById("settingsExperienceHeading").textContent = tr.settingsExperience;
    document.getElementById("settingsDataHeading").textContent = tr.settingsData;
    document.getElementById("settingsDataNote").textContent = tr.settingsDataNote;
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
    document.getElementById("emailLabel").textContent = tr.emailLabel;
    document.getElementById("emailHint").textContent = tr.emailHint;
    document.getElementById("methodHint").textContent = tr.methodHint(signupMethod.value);
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
    document.getElementById("accEmailOut").textContent = tr.accEmail(user.email || "");
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
    document.getElementById("toggleReviewBtn").textContent = reviewPanel.style.display === "block" ? tr.hideReviewBtn : tr.reviewBtn;
    renderResumePanel();

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
    [onboardingScreen, signupScreen, configScreen, accountScreen, settingsScreen, quizScreen, resultScreen].forEach((sec) => {
      sec.style.display = sec === target ? "block" : "none";
    });
    topNav.style.display = user.registered ? "flex" : "none";
    appHeader.style.display = user.registered ? "flex" : "none";
    navQuizBtn.classList.toggle("active", target === configScreen || target === quizScreen || target === resultScreen);
    navAccountBtn.classList.toggle("active", target === accountScreen);
    navSettingsBtn.classList.toggle("active", target === settingsScreen);
    navQuizBtn.setAttribute("aria-current", target === configScreen || target === quizScreen || target === resultScreen ? "page" : "false");
    navAccountBtn.setAttribute("aria-current", target === accountScreen ? "page" : "false");
    navSettingsBtn.setAttribute("aria-current", target === settingsScreen ? "page" : "false");
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

    if (!genQuestion.pools) genQuestion.pools = {
      programming: [
        ["Arrays", "Which method adds an item to the end of a JavaScript array?", "push()", ["pop()", "shift()", "slice()"], "push() adds elements to the end."],
        ["HTML", "Which HTML tag creates a hyperlink?", "<a>", ["<link>", "<href>", "<url>"], "<a> defines a link."],
        ["CSS", "Which CSS property adds space inside a border?", "padding", ["margin", "gap", "float"], "padding is inside the border."],
        ["Databases", "What does SQL stand for?", "Structured Query Language", ["Simple Query List", "Standard Question Log", "System Queue Link"], "SQL queries structured data."],
        ["Git", "Which command saves staged changes to local history?", "git commit", ["git pull", "git status", "git branch"], "git commit records a snapshot."],
        ["JavaScript", "What does the === operator compare?", "Value and type", ["Only the value", "Only the type", "Whether two objects are identical by contents"], "Strict equality compares value and type without coercion."],
        ["JavaScript", "Which keyword declares a block-scoped variable that can be reassigned?", "let", ["const", "static", "define"], "let declares a block-scoped binding that can be reassigned."],
        ["JavaScript", "Which method creates a new array by transforming each item?", "map()", ["forEach()", "find()", "some()"], "map() returns a new array containing each callback result."],
        ["JavaScript", "What does JSON.parse() do?", "Converts JSON text into a JavaScript value", ["Converts a value into JSON text", "Sends JSON to a server", "Sorts object keys"], "JSON.parse reads JSON text and creates the represented JavaScript value."],
        ["JavaScript", "Which browser API selects the first matching CSS selector?", "document.querySelector()", ["document.find()", "window.getSelector()", "document.css()"], "querySelector returns the first matching element."],
        ["JavaScript", "Which event fires when a user submits a form?", "submit", ["send", "formdone", "post"], "Forms dispatch a submit event when submitted."],
        ["JavaScript", "What is the result of typeof NaN?", "number", ["NaN", "undefined", "object"], "NaN is a special numeric value, so typeof NaN is 'number'."],
        ["JavaScript", "Which method keeps only array items that pass a test?", "filter()", ["reduce()", "map()", "join()"], "filter() returns a new array with items that pass the callback test."],
        ["JavaScript", "Which storage API keeps simple key/value data after a tab is closed?", "localStorage", ["sessionStorage", "history.state", "window.cache"], "localStorage persists until the site clears it or the user removes it."],
        ["HTML", "Which element is intended for a page's main content?", "<main>", ["<aside>", "<summary>", "<small>"], "The main element identifies the dominant content of the document."],
        ["HTML", "Which attribute provides alternative text for an image?", "alt", ["title", "caption", "description"], "The alt attribute gives text alternatives for images."],
        ["HTML", "Which attribute connects a label to an input by its id?", "for", ["name", "target", "value"], "A label's for value should match the input's id."],
        ["HTML", "Which element represents a standalone piece of content that could be reused?", "<article>", ["<span>", "<b>", "<br>"], "An article is a self-contained composition."],
        ["CSS", "Which property changes the text color?", "color", ["font-color", "text-fill", "foreground"], "The color property sets an element's text color."],
        ["CSS", "Which layout system is designed for arranging items along one axis?", "Flexbox", ["Float layout", "Table layout", "Position flow"], "Flexbox is a one-dimensional layout model."],
        ["CSS", "Which unit is relative to the root element's font size?", "rem", ["px", "vh", "pt"], "rem is based on the root element's font size."],
        ["Git", "Which command shows changed, staged, and untracked files?", "git status", ["git log", "git stash", "git init"], "git status summarizes the working tree and staging area."],
        ["Git", "Which command downloads a remote repository for the first time?", "git clone", ["git merge", "git reset", "git tag"], "git clone creates a local copy of a remote repository."],
        ["Web", "What does HTTP status code 404 mean?", "The requested resource was not found", ["The request succeeded", "The server redirected permanently", "The server is starting"], "404 indicates that the server could not find the requested resource."],
        ["Web", "What does API commonly stand for?", "Application Programming Interface", ["Applied Program Internet", "Automated Protocol Input", "Application Process Index"], "An API defines how software components communicate."],
        ["Web", "Which protocol secures HTTP traffic with encryption?", "HTTPS", ["FTP", "SMTP", "SSH"], "HTTPS uses TLS to protect HTTP connections."]
      ],
      geography: [
        ["Capitals", "What is the capital city of Ghana?", "Accra", ["Kumasi", "Tamale", "Cape Coast"], "Accra is the capital of Ghana."],
        ["Rivers", "Which river flows through Egypt?", "Nile River", ["Amazon River", "Congo River", "Niger River"], "The Nile flows north through Egypt to the Mediterranean Sea."],
        ["Continents", "Which continent has the largest land area?", "Asia", ["Africa", "Europe", "Australia"], "Asia is the largest continent."],
        ["Oceans", "Which ocean is the largest on Earth?", "Pacific Ocean", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], "The Pacific is the largest ocean."],
        ["Deserts", "Which is the largest hot desert in the world?", "Sahara Desert", ["Gobi Desert", "Kalahari Desert", "Mojave Desert"], "The Sahara is the largest hot desert."],
        ["Capitals", "What is the capital city of Japan?", "Tokyo", ["Kyoto", "Osaka", "Sapporo"], "Tokyo is Japan's capital."],
        ["Capitals", "What is the capital city of Canada?", "Ottawa", ["Toronto", "Vancouver", "Montreal"], "Ottawa is Canada's capital."],
        ["Capitals", "What is the capital city of Kenya?", "Nairobi", ["Mombasa", "Kisumu", "Nakuru"], "Nairobi is Kenya's capital."],
        ["Capitals", "What is the capital city of Peru?", "Lima", ["Cusco", "Arequipa", "Trujillo"], "Lima is Peru's capital."],
        ["Capitals", "What is the capital city of Norway?", "Oslo", ["Bergen", "Trondheim", "Stavanger"], "Oslo is Norway's capital."],
        ["Capitals", "What is the capital city of Australia?", "Canberra", ["Sydney", "Melbourne", "Perth"], "Canberra is Australia's capital."],
        ["Capitals", "What is the capital city of France?", "Paris", ["Lyon", "Nice", "Marseille"], "Paris is France's capital."],
        ["Landmarks", "In which country is the Great Wall located?", "China", ["Japan", "India", "Mongolia"], "The Great Wall is in China."],
        ["Landmarks", "Machu Picchu is in which country?", "Peru", ["Chile", "Bolivia", "Ecuador"], "Machu Picchu is an Inca site in Peru."],
        ["Landmarks", "The Taj Mahal is in which Indian city?", "Agra", ["Delhi", "Jaipur", "Mumbai"], "The Taj Mahal is in Agra, India."],
        ["Mountains", "What is the world's highest mountain above sea level?", "Mount Everest", ["K2", "Kangchenjunga", "Denali"], "Mount Everest has the highest summit above sea level."],
        ["Mountains", "Which mountain range runs along the western edge of South America?", "The Andes", ["The Alps", "The Rockies", "The Atlas Mountains"], "The Andes extend along western South America."],
        ["Oceans", "Which ocean lies between Africa and Australia?", "Indian Ocean", ["Atlantic Ocean", "Arctic Ocean", "Southern Ocean"], "The Indian Ocean lies between Africa, Asia, and Australia."],
        ["Landforms", "Which country contains most of the Amazon rainforest?", "Brazil", ["Argentina", "Mexico", "Peru"], "Most of the Amazon rainforest is in Brazil."],
        ["Landmarks", "The Great Barrier Reef is off the coast of which country?", "Australia", ["South Africa", "India", "Mexico"], "The Great Barrier Reef lies off northeastern Australia."],
        ["Countries", "Which is the world's largest country by land area?", "Russia", ["Canada", "China", "United States"], "Russia is the largest country by area."],
        ["Countries", "Which is the world's smallest independent country by area?", "Vatican City", ["Monaco", "San Marino", "Liechtenstein"], "Vatican City is the smallest sovereign state by area."],
        ["Countries", "Which country is famous for the fjords around Bergen?", "Norway", ["Sweden", "Finland", "Denmark"], "Norway's western coast is known for its fjords."],
        ["Continents", "On which continent is the Sahara Desert?", "Africa", ["Asia", "South America", "Australia"], "The Sahara stretches across northern Africa."],
        ["Continents", "Which continent contains the South Pole?", "Antarctica", ["Europe", "Asia", "South America"], "The South Pole is in Antarctica."],
        ["Countries", "Which country has the city of Istanbul?", "Türkiye", ["Greece", "Bulgaria", "Egypt"], "Istanbul is a major city in Türkiye."],
        ["Countries", "Which country is an island nation east of China and Korea?", "Japan", ["Nepal", "Laos", "Mongolia"], "Japan is an island nation in East Asia."],
        ["Countries", "Which country has the cities of Casablanca and Marrakesh?", "Morocco", ["Tunisia", "Algeria", "Egypt"], "Casablanca and Marrakesh are cities in Morocco."],
        ["Countries", "Which country is directly south of the United States?", "Mexico", ["Cuba", "Guatemala", "Costa Rica"], "Mexico shares the United States' southern land border."]
      ],
      entertainment: [
        ["Animation", "Which movie features a snowman named Olaf?", "Frozen", ["Moana", "Tangled", "Encanto"], "Olaf is in Frozen."],
        ["Studio", "Which studio made 'Spirited Away'?", "Studio Ghibli", ["Pixar", "DreamWorks", "Illumination"], "Studio Ghibli produced Spirited Away."],
        ["Music", "Who is known as the 'King of Pop'?", "Michael Jackson", ["Elvis Presley", "Prince", "Stevie Wonder"], "Michael Jackson is the King of Pop."],
        ["Gaming", "What does 'NPC' stand for in video games?", "Non-Player Character", ["New Player Control", "Next Playable Class", "Network Player Core"], "NPC means Non-Player Character."],
        ["Film", "Which movie features Captain Jack Sparrow?", "Pirates of the Caribbean", ["Star Wars", "Dune", "Inception"], "Jack Sparrow is in Pirates of the Caribbean."],
        ["Books", "Who wrote the Harry Potter series?", "J. K. Rowling", ["J. R. R. Tolkien", "C. S. Lewis", "Roald Dahl"], "J. K. Rowling wrote the Harry Potter books."],
        ["Film", "Which animated film features a toy cowboy named Woody?", "Toy Story", ["Cars", "Up", "Ratatouille"], "Woody is one of the main characters in Toy Story."],
        ["Gaming", "Which company created the Mario series?", "Nintendo", ["Sega", "Atari", "Sony"], "Mario is a Nintendo video game character."],
        ["Comics", "What is the name of Batman's home city?", "Gotham City", ["Metropolis", "Star City", "Central City"], "Batman stories are set primarily in Gotham City."],
        ["Books", "Who is the detective in 'The Hound of the Baskervilles'?", "Sherlock Holmes", ["Hercule Poirot", "Miss Marple", "Philip Marlowe"], "The novel features Sherlock Holmes and Dr. Watson."],
        ["Film", "What is the name of the blue people in the film 'Avatar'?", "Na'vi", ["Wookiees", "Elves", "Klingons"], "The Na'vi are the indigenous people of Pandora in Avatar."],
        ["Television", "In which fictional town is 'Stranger Things' mainly set?", "Hawkins", ["Riverdale", "Sunnydale", "Smallville"], "The series is mainly set in Hawkins, Indiana."],
        ["Film", "What glowing weapon is used by Jedi in Star Wars?", "Lightsaber", ["Phaser", "Wand", "Blaster staff"], "Jedi are known for using lightsabers."],
        ["Gaming", "Which game features a character named Creeper?", "Minecraft", ["Fortnite", "Roblox", "Terraria"], "Creepers are hostile mobs in Minecraft."],
        ["Gaming", "Who created the original video game Tetris?", "Alexey Pajitnov", ["Shigeru Miyamoto", "Hideo Kojima", "Sid Meier"], "Alexey Pajitnov created Tetris in the Soviet Union."],
        ["Animation", "Which franchise features the character Pikachu?", "Pokémon", ["Digimon", "Mogwai", "Sonic the Hedgehog"], "Pikachu is one of the best-known Pokémon characters."],
        ["Books", "Who is the ring-bearer in much of 'The Lord of the Rings'?", "Frodo Baggins", ["Bilbo Baggins", "Samwise Gamgee", "Peregrin Took"], "Frodo carries the One Ring toward Mordor."],
        ["Music", "Which band recorded 'Hey Jude'?", "The Beatles", ["The Rolling Stones", "Queen", "The Kinks"], "The Beatles released 'Hey Jude' in 1968."],
        ["Music", "Which instrument has keys, pedals, and strings struck by hammers?", "Piano", ["Flute", "Trumpet", "Violin"], "A piano uses keys to make hammers strike strings."],
        ["Film", "Which fictional archaeologist is played by Harrison Ford in a film series?", "Indiana Jones", ["James Bond", "Han Solo", "Rick Deckard"], "Harrison Ford plays Indiana Jones."],
        ["Comics", "What is the real name of Spider-Man?", "Peter Parker", ["Bruce Wayne", "Clark Kent", "Tony Stark"], "Peter Parker is Spider-Man's best-known identity."],
        ["Animation", "What is the name of the family in 'The Simpsons'?", "The Simpsons", ["The Griffins", "The Belchers", "The Jetsons"], "The series follows the Simpson family."],
        ["Film", "Which film series features a school called Hogwarts?", "Harry Potter", ["The Hunger Games", "Twilight", "The Chronicles of Narnia"], "Hogwarts is the wizarding school in Harry Potter."],
        ["Gaming", "Which game series features the kingdom of Hyrule?", "The Legend of Zelda", ["Final Fantasy", "Sonic the Hedgehog", "God of War"], "Many Legend of Zelda games take place in Hyrule."],
        ["Animation", "What kind of animal is Dumbo?", "Elephant", ["Mouse", "Duck", "Horse"], "Dumbo is a young elephant with unusually large ears."],
        ["Film", "Which fictional spy is known by the code number 007?", "James Bond", ["Jason Bourne", "Ethan Hunt", "Austin Powers"], "007 is the code number of James Bond."],
        ["Gaming", "Which company makes the PlayStation console?", "Sony", ["Microsoft", "Nintendo", "Sega"], "PlayStation is a video game console brand made by Sony."],
        ["Books", "Who wrote 'The Hobbit'?", "J. R. R. Tolkien", ["C. S. Lewis", "George Orwell", "Ursula K. Le Guin"], "J. R. R. Tolkien wrote The Hobbit."],
        ["Film", "Which Pixar film features a robot named WALL-E?", "WALL-E", ["Finding Nemo", "Coco", "Inside Out"], "WALL-E follows a small waste-collecting robot on Earth."]
      ]
    };

    const pools = genQuestion.pools;
    const list = pools[c] || pools.programming;
    const row = list[n % list.length];
    return makeItem(row[0], row[1], row[2], row[3], row[4]);
  }

  function buildDeck(cat, count) {
    if (cat.toLowerCase() !== "mathematics") {
      const bankSize = cat.toLowerCase() === "programming" ? 26 : 29;
      const indexes = shuffle(Array.from({ length: bankSize }, (_, index) => index)).slice(0, count);
      return indexes.map((index) => genQuestion(cat, index));
    }

    const out = [];
    const seen = new Set();
    let attempts = 0;
    while (out.length < count && attempts < count * 20) {
      const item = genQuestion(cat, out.length + attempts);
      attempts++;
      if (seen.has(item.question)) continue;
      seen.add(item.question);
      out.push(item);
    }
    return out;
  }

  // Draw Meme Card on Canvas (No emojis)
  function drawMemeCard(name, errCount, totCount) {
    const memeImage = document.getElementById("memeImage");
    if (memeImage) {
      memeImage.hidden = true;
      memeImage.onload = () => { memeImage.hidden = false; memeCanvas.hidden = true; };
      memeImage.onerror = () => { memeImage.hidden = true; memeCanvas.hidden = false; };
      memeImage.src = "https://api.memegen.link/images/drake/guessing_confidently/reading_the_question.png?width=880";
    }
    memeCanvas.hidden = false;
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

  function startTimer(reset = true) {
    stopTimer();
    if (reset) timeLeft = TIME_PER_QUESTION;
    timerText.textContent = `${timeLeft}s`;
    timerBox.style.background = timeLeft <= 5 ? "var(--timer-red)" : "var(--timer-grey)";

    timerId = setInterval(() => {
      timeLeft--;
      timerText.textContent = `${timeLeft}s`;
      if (timeLeft > 0 && timeLeft <= 5) sfx.tick();
      saveAttempt();

      if (timeLeft <= 0) {
        stopTimer();
        answered = true;
        timerBox.style.background = "var(--timer-red)";
        mistakes++;
        missedList.push(currentQ);
        pickedAnswer = null;
        answers[qIndex - 1] = { selectedIndex: null, isCorrect: false, timedOut: true };
        sfx.wrong();
        updateStatsBar();
        revealOptions(null);
        lockOptions();
        feedbackText = t().timedOutNote(currentQ.explanation);
        explanationText.textContent = feedbackText;
        explanationText.style.display = "block";
        nextQuestionBtn.style.visibility = "visible";
        saveAttempt();
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
      li.setAttribute("aria-disabled", "true");
    });
  }

  function revealOptions(pickedIdx) {
    answerOptions.querySelectorAll(".answer-option").forEach((li, idx) => {
      const selected = idx === pickedIdx;
      li.classList.toggle("is-selected", selected);
      li.setAttribute("aria-pressed", String(selected));
      if (idx === currentQ.correctAnswer) {
        li.classList.add("correct");
      } else if (idx === pickedIdx) {
        li.classList.add("incorrect");
      }
    });
  }

  function pickAnswer(li, idx) {
    if (answered) return;
    answered = true;
    stopTimer();
    const ok = idx === currentQ.correctAnswer;
    pickedAnswer = idx;
    answers[qIndex - 1] = { selectedIndex: idx, isCorrect: ok, timedOut: false };
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
    feedbackText = currentQ.explanation;
    explanationText.textContent = feedbackText;
    explanationText.style.display = "block";
    nextQuestionBtn.style.visibility = "visible";
    saveAttempt();
  }

  function renderCurrentQuestion() {
    const tr = t();
    progressFill.style.width = `${Math.round((qIndex / questions.length) * 100)}%`;
    progressFill.parentElement.setAttribute("aria-valuenow", String(Math.round((qIndex / questions.length) * 100)));
    questionStatus.textContent = tr.statusText(qIndex, questions.length);
    questionText.textContent = currentQ.question;
    answerOptions.innerHTML = "";
    updateStatsBar();

    currentQ.options.forEach((opt, idx) => {
      const li = document.createElement("li");
      li.className = "answer-option";
      li.tabIndex = answered ? -1 : 0;
      li.setAttribute("role", "button");
      li.setAttribute("aria-pressed", "false");
      li.setAttribute("aria-label", `Answer ${idx + 1}: ${opt}`);
      li.textContent = opt;
      li.addEventListener("click", () => pickAnswer(li, idx));
      li.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          pickAnswer(li, idx);
        }
      });
      answerOptions.appendChild(li);
    });

    if (answered) {
      revealOptions(pickedAnswer);
      lockOptions();
      explanationText.textContent = feedbackText || currentQ.explanation;
      explanationText.style.display = "block";
      nextQuestionBtn.style.visibility = "visible";
      timerText.textContent = `${timeLeft}s`;
      timerBox.style.background = answers[qIndex - 1] && answers[qIndex - 1].timedOut ? "var(--timer-red)" : "var(--timer-grey)";
    } else {
      explanationText.textContent = "";
      explanationText.style.display = "none";
      nextQuestionBtn.style.visibility = "hidden";
      startTimer(false);
    }
    saveAttempt();
  }

  function renderNext() {
    if (qIndex >= questions.length) {
      finishSession();
      return;
    }

    currentQ = questions[qIndex];
    qIndex++;
    timeLeft = TIME_PER_QUESTION;
    answered = false;
    pickedAnswer = null;
    feedbackText = "";
    renderCurrentQuestion();
  }

  function beginQuiz(overrideList) {
    questions = overrideList || buildDeck(selectedCategory, selectedCount);
    missedList = [];
    answers = [];
    qIndex = 0;
    score = 0;
    mistakes = 0;
    answered = false;
    pickedAnswer = null;
    feedbackText = "";
    clearSavedAttempt();
    recordBackgroundAdaptation();
    showOnly(quizScreen);
    renderNext();
  }

  function finishSession() {
    stopTimer();
    clearSavedAttempt();
    const tr = t();
    const tot = questions.length;
    const maxErr = getMaxMistakes(tot);
    const passed = mistakes <= maxErr;

    if (window.QuizMultiplayer && typeof window.QuizMultiplayer.recordSoloResult === "function") {
      window.QuizMultiplayer.recordSoloResult({ attemptId: crypto.randomUUID(), category: selectedCategory, correct: score, total: tot })
        .catch(() => {});
    }

    showOnly(resultScreen);
    renderAnswerReview();
    reviewPanel.style.display = "none";
    toggleReviewBtn.setAttribute("aria-expanded", "false");
    toggleReviewBtn.textContent = tr.reviewBtn;
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
    signupEmail.value = user.email || "";
    signupMethod.value = user.method || "Email";
    signupMethod.dispatchEvent(new Event("change"));
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

  signupMethod.addEventListener("change", () => {
    signupEmailField.hidden = signupMethod.value === "Guest";
    signupEmail.required = signupMethod.value === "Email";
    document.getElementById("methodHint").textContent = t().methodHint(signupMethod.value);
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
    user.email = signupMethod.value === "Guest" ? "" : signupEmail.value.trim();
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
    if (quizScreen.style.display === "block" && !window.confirm("Leave this quiz? You can resume it from Home.")) return;
    stopTimer();
    if (questions.length) saveAttempt();
    showOnly(configScreen);
  });

  navAccountBtn.addEventListener("click", () => {
    sfx.tap();
    if (quizScreen.style.display === "block" && !window.confirm("Leave this quiz? You can resume it from Home.")) return;
    stopTimer();
    if (questions.length) saveAttempt();
    applyAllTranslations();
    showOnly(accountScreen);
  });

  navSettingsBtn.addEventListener("click", () => {
    sfx.tap();
    if (quizScreen.style.display === "block" && !window.confirm("Leave this quiz? You can resume it from Home.")) return;
    stopTimer();
    if (questions.length) saveAttempt();
    applyAllTranslations();
    showOnly(settingsScreen);
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
    signupEmail.value = user.email || "";
    signupMethod.value = user.method || "Email";
    signupVoice.value = user.voice || "female";
    signupMethod.dispatchEvent(new Event("change"));
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
      document.querySelectorAll(".category-option").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      selectedCategory = btn.dataset.cat;
    });
  });

  document.querySelectorAll(".question-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      document.querySelectorAll(".question-option").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".question-option").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      selectedCount = parseInt(btn.dataset.count, 10);
      applyAllTranslations();
    });
  });

  startQuizBtn.addEventListener("click", () => {
    sfx.tap();
    if (savedAttempt && !window.confirm("Start a new quiz and replace the saved run?")) return;
    beginQuiz(null);
  });

  resumeQuizBtn.addEventListener("click", () => {
    sfx.tap();
    resumeSavedAttempt();
  });

  discardResumeBtn.addEventListener("click", () => {
    sfx.tap();
    clearSavedAttempt();
  });

  toggleReviewBtn.addEventListener("click", () => {
    sfx.tap();
    const opening = reviewPanel.style.display !== "block";
    reviewPanel.style.display = opening ? "block" : "none";
    toggleReviewBtn.setAttribute("aria-expanded", String(opening));
    toggleReviewBtn.textContent = opening ? t().hideReviewBtn : t().reviewBtn;
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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && quizScreen.style.display === "block") saveAttempt();
  });
  window.addEventListener("beforeunload", () => {
    if (quizScreen.style.display === "block") saveAttempt();
  });

  // Boot
  savedAttempt = loadAttempt();
  applyAllTranslations();
  if (user.registered && user.name) {
    showOnly(configScreen);
  } else if (user.completedOnboarding) {
    showOnly(signupScreen);
  } else {
    showOnly(onboardingScreen);
  }
})();

