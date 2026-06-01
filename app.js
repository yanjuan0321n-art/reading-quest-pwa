const LESSON_BANK_URL = "./sentence-lesson-bank.json";
const STORAGE_KEY = "reading-quest-progress-v2";
const CUSTOM_KEY = "reading-quest-custom-article-v1";
const FONT_SIZE_KEY = "reading-quest-lesson-font-size-v1";
const FONT_SIZE_STEPS = [0.92, 1, 1.12, 1.24];
const FONT_SIZE_LABELS = ["小", "标准", "大", "特大"];

const els = {
  totalXp: document.querySelector("#totalXp"),
  streakDays: document.querySelector("#streakDays"),
  heartCount: document.querySelector("#heartCount"),
  studyTimeText: document.querySelector("#studyTimeText"),
  articleSelect: document.querySelector("#articleSelect"),
  articleInput: document.querySelector("#articleInput"),
  buildCustomBtn: document.querySelector("#buildCustomBtn"),
  backToMapBtn: document.querySelector("#backToMapBtn"),
  resetProgressBtn: document.querySelector("#resetProgressBtn"),
  articleKicker: document.querySelector("#articleKicker"),
  articleTitle: document.querySelector("#articleTitle"),
  mapScreen: document.querySelector("#mapScreen"),
  profileScreen: document.querySelector("#profileScreen"),
  lessonScreen: document.querySelector("#lessonScreen"),
  summaryScreen: document.querySelector("#summaryScreen"),
  paragraphCount: document.querySelector("#paragraphCount"),
  courseProgressText: document.querySelector("#courseProgressText"),
  courseProgressBar: document.querySelector("#courseProgressBar"),
  courseHeroTitle: document.querySelector("#courseHeroTitle"),
  courseHeroText: document.querySelector("#courseHeroText"),
  profileCourseTitle: document.querySelector("#profileCourseTitle"),
  levelMap: document.querySelector("#levelMap"),
  lessonProgressBar: document.querySelector("#lessonProgressBar"),
  lessonStepText: document.querySelector("#lessonStepText"),
  lessonXpText: document.querySelector("#lessonXpText"),
  decreaseFontBtn: document.querySelector("#decreaseFontBtn"),
  increaseFontBtn: document.querySelector("#increaseFontBtn"),
  fontSizeLabel: document.querySelector("#fontSizeLabel"),
  paragraphBadge: document.querySelector("#paragraphBadge"),
  paragraphText: document.querySelector("#paragraphText"),
  challengeCard: document.querySelector("#challengeCard"),
  feedbackBar: document.querySelector("#feedbackBar"),
  summaryTitle: document.querySelector("#summaryTitle"),
  summaryText: document.querySelector("#summaryText"),
  summaryCorrect: document.querySelector("#summaryCorrect"),
  summaryXp: document.querySelector("#summaryXp"),
  summaryTime: document.querySelector("#summaryTime"),
  nextLevelBtn: document.querySelector("#nextLevelBtn"),
  summaryMapBtn: document.querySelector("#summaryMapBtn"),
  tabQuest: document.querySelector("#tabQuest"),
  tabImport: document.querySelector("#tabImport"),
  tabMe: document.querySelector("#tabMe"),
  toast: document.querySelector("#toast")
};

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "this",
  "from",
  "were",
  "was",
  "are",
  "but",
  "not",
  "you",
  "our",
  "their",
  "they",
  "have",
  "has",
  "had",
  "into",
  "about",
  "which",
  "what",
  "when",
  "where",
  "will",
  "would",
  "could",
  "should",
  "been",
  "being",
  "than",
  "then",
  "them",
  "each",
  "some",
  "more",
  "most",
  "much",
  "many",
  "very",
  "only",
  "after",
  "before",
  "over",
  "under",
  "around",
  "through",
  "because",
  "there",
  "here",
  "itself",
  "still"
]);

const GLOSSARY = {
  responsible: "负责的；造成的",
  emissions: "排放",
  decarbonize: "脱碳；减少碳排放",
  transportation: "交通运输",
  greenhouse: "温室的",
  breakdown: "明细；分解",
  vehicles: "车辆",
  passenger: "乘客",
  shipping: "航运",
  fuels: "燃料",
  lightweight: "轻量的",
  settled: "确定；解决",
  solutions: "解决方案",
  synthetic: "合成的",
  hydrocarbons: "碳氢化合物",
  sector: "行业；领域",
  aviation: "航空",
  sustainable: "可持续的",
  recycled: "回收再利用的",
  batteries: "电池",
  electric: "电动的",
  charge: "充电",
  electrified: "电气化的",
  hydrogen: "氢",
  ammonia: "氨",
  ignite: "点燃",
  engine: "发动机",
  redesign: "重新设计",
  transition: "转变；过渡",
  renewable: "可再生的",
  estimated: "估计的",
  demand: "需求",
  analyses: "分析",
  development: "发展",
  "ninth-grade": "九年级的",
  cowboy: "牛仔",
  strict: "严格的",
  demanded: "要求",
  heartbreak: "心碎",
  rejected: "拒绝",
  wondering: "想知道",
  essay: "文章；短文",
  interpreted: "理解；解释",
  thesis: "论点",
  statement: "陈述",
  shocked: "震惊的",
  realized: "意识到",
  necessity: "必要性",
  persuasive: "有说服力的",
  assignment: "任务；作业",
  "personal-narrative": "个人叙事",
  workshop: "工作坊",
  specifications: "要求；规范",
  genre: "体裁",
  staggering: "惊人的",
  diverse: "多样的",
  broadened: "拓宽",
  demonstrated: "展示；证明",
  significance: "意义",
  connect: "连接",
  kitchen: "厨房",
  vase: "花瓶",
  daylight: "日光",
  wedding: "婚礼",
  beloved: "心爱的",
  donated: "捐赠",
  rented: "租用",
  supposedly: "据称；所谓",
  landfill: "垃圾填埋场",
  additional: "额外的",
  photos: "照片",
  description: "描述",
  exchange: "交换；交流",
  precious: "珍贵的",
  chaos: "混乱",
  apartment: "公寓",
  belongings: "物品；财产",
  appreciating: "欣赏；感激"
};

const state = {
  baseCourses: [],
  courses: [],
  activeArticleId: null,
  screen: "map",
  activeParagraphIndex: 0,
  challengeIndex: 0,
  selectedChoiceIndex: null,
  orderSelection: [],
  currentResult: null,
  lessonStats: null,
  fontSizeIndex: loadFontSizeIndex(),
  progress: loadProgress()
};

function loadFontSizeIndex() {
  const saved = Number(localStorage.getItem(FONT_SIZE_KEY));
  if (Number.isInteger(saved) && saved >= 0 && saved < FONT_SIZE_STEPS.length) return saved;
  return 1;
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      xp: Number(saved?.xp) || 0,
      streak: Number(saved?.streak) || 1,
      hearts: Number(saved?.hearts) || 5,
      studySeconds: Number(saved?.studySeconds) || 0,
      completed: saved?.completed && typeof saved.completed === "object" ? saved.completed : {}
    };
  } catch {
    return { xp: 0, streak: 1, hearts: 5, studySeconds: 0, completed: {} };
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

async function init() {
  bindEvents();
  applyLessonFontSize();

  try {
    const response = await fetch(LESSON_BANK_URL);
    if (!response.ok) throw new Error(`Unable to load ${LESSON_BANK_URL}`);

    const lessonBank = await response.json();
    const articles = normalizeLessonBank(lessonBank);
    state.baseCourses = articles.map((article) => buildCourse(article, articles));
    state.courses = [...state.baseCourses];

    state.activeArticleId = state.courses[0]?.id || null;
    renderArticleSelect();
    renderStats();
    renderCurrentArticle();
    setScreen("map");
  } catch (error) {
    showToast("题库加载失败，请确认 sentence-lesson-bank.json 可以访问。");
    console.error(error);
  }
}

function normalizeLessonBank(lessonBank) {
  if (Array.isArray(lessonBank)) return lessonBank;
  if (Array.isArray(lessonBank?.articles)) return lessonBank.articles;
  if (Array.isArray(lessonBank?.courses)) return lessonBank.courses;
  if (Array.isArray(lessonBank?.lessons)) return lessonBank.lessons;
  throw new Error("Lesson bank must be an array or contain articles/courses/lessons.");
}

function bindEvents() {
  els.articleSelect.addEventListener("change", (event) => {
    state.activeArticleId = event.target.value;
    state.activeParagraphIndex = 0;
    state.challengeIndex = 0;
    renderCurrentArticle();
    setScreen("map");
  });

  els.buildCustomBtn.addEventListener("click", () => {
    const text = els.articleInput.value.trim();
    if (countWords(text) < 30) {
      showToast("文章太短了，建议至少粘贴 30 个英文词。");
      return;
    }

    const customArticle = {
      id: "custom_article",
      order: 0,
      title: "我的自定义课程",
      type: "custom_reading",
      articleText: text,
      paragraphs: splitIntoLearningParagraphs(text).map((paragraph, index) => ({
        index: index + 1,
        text: paragraph
      })),
      questions: []
    };

    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customArticle));
    state.progress.completed[customArticle.id] = [];
    saveProgress();
    state.courses = [buildCourse(customArticle, [customArticle, ...state.baseCourses]), ...state.baseCourses];
    state.activeArticleId = customArticle.id;
    renderArticleSelect();
    renderCurrentArticle();
    setScreen("map");
    showToast("已生成分段闯关。");
  });

  els.backToMapBtn.addEventListener("click", () => {
    setScreen("map");
    renderMap();
  });

  els.resetProgressBtn.addEventListener("click", () => {
    const confirmed = window.confirm("确定重置 XP、能量和所有关卡进度吗？");
    if (!confirmed) return;
    state.progress = { xp: 0, streak: 1, hearts: 5, studySeconds: 0, completed: {} };
    saveProgress();
    renderStats();
    renderCurrentArticle();
    showToast("学习进度已重置。");
  });

  els.summaryMapBtn.addEventListener("click", () => {
    setScreen("map");
    renderMap();
  });

  els.nextLevelBtn.addEventListener("click", () => {
    const article = getActiveArticle();
    const nextIndex = state.activeParagraphIndex + 1;
    if (!article || nextIndex >= article.paragraphs.length) {
      setScreen("map");
      return;
    }
    startLesson(nextIndex);
  });

  els.decreaseFontBtn.addEventListener("click", () => {
    updateLessonFontSize(state.fontSizeIndex - 1);
  });

  els.increaseFontBtn.addEventListener("click", () => {
    updateLessonFontSize(state.fontSizeIndex + 1);
  });

  els.tabQuest.addEventListener("click", () => {
    setScreen("map");
    setActiveTab("quest");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  els.tabImport.addEventListener("click", () => {
    setScreen("map");
    setActiveTab("import");
    document.querySelector(".import-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => els.articleInput.focus(), 350);
  });

  els.tabMe.addEventListener("click", () => {
    setScreen("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function applyAnswerKey(article, answerKey) {
  const articleKey = answerKey?.[article.id] || {};
  return {
    ...article,
    questions: (article.questions || []).map((question) => ({
      ...question,
      answer: question.answer || articleKey[String(question.number)] || null
    }))
  };
}

function loadSavedCustomArticle() {
  try {
    const article = JSON.parse(localStorage.getItem(CUSTOM_KEY));
    if (!article?.articleText) return null;
    return { ...article, title: "我的自定义课程" };
  } catch {
    return null;
  }
}

function buildCourse(article, articlePool) {
  if (Array.isArray(article.units) && article.units.length) {
    return {
      id: article.id,
      order: article.order,
      title: article.title || "Untitled Lesson",
      type: article.type || "sentence_game_course",
      unitMode: "sentence",
      sourceImage: article.sourceImage || "",
      articleText: article.articleText || article.units.map((unit) => unit.text).join("\n\n"),
      originalQuestions: article.units.flatMap((unit) => unit.exercises || []),
      paragraphs: article.units.map((unit, index) => ({
        id: unit.id,
        index: unit.index || index + 1,
        title: unit.title || `Unit ${index + 1}`,
        text: unit.text || (unit.sentences || []).map((sentence) => sentence.text).join(" "),
        summaryZh: unit.summaryZh || "",
        vocabulary: unit.vocabulary || [],
        granularity: unit.granularity || "single_sentence",
        parentSegmentTitle: unit.parentSegmentTitle || "",
        challenges: (unit.exercises || []).map((exercise) => mapBankExerciseToChallenge(exercise))
      }))
    };
  }

  if (Array.isArray(article.segments) && article.segments.length) {
    return {
      id: article.id,
      order: article.order,
      title: article.title || "Untitled Lesson",
      type: article.type || "reading_game_course",
      unitMode: "paragraph",
      sourceImage: article.sourceImage || "",
      articleText: article.articleText || article.segments.map((segment) => segment.text).join("\n\n"),
      originalQuestions: article.segments.flatMap((segment) => segment.exercises || []),
      paragraphs: article.segments.map((segment, index) => ({
        id: segment.id,
        index: segment.index || index + 1,
        title: segment.title || `Segment ${index + 1}`,
        text: segment.text,
        summaryZh: segment.summaryZh || "",
        vocabulary: segment.vocabulary || [],
        challenges: (segment.exercises || []).map((exercise) => mapBankExerciseToChallenge(exercise))
      }))
    };
  }

  const paragraphTexts = (article.paragraphs?.length
    ? article.paragraphs.map((paragraph) => paragraph.text)
    : splitIntoLearningParagraphs(article.articleText || "")
  ).filter(Boolean);

  const allSentences = articlePool
    .flatMap((item) => splitSentences(item.articleText || ""))
    .filter((sentence) => countWords(sentence) >= 6);

  const answeredQuestions = (article.questions || []).filter((question) => question.answer);

  return {
    id: article.id,
    order: article.order,
    title: article.title || "Untitled Article",
    type: article.type || "reading",
    unitMode: "paragraph",
    sourceImage: article.sourceImage || "",
    articleText: article.articleText || paragraphTexts.join("\n\n"),
    originalQuestions: article.questions || [],
    paragraphs: paragraphTexts.map((text, index) => ({
      index: index + 1,
      text,
      challenges: buildParagraphChallenges({
        article,
        paragraphText: text,
        paragraphIndex: index,
        allSentences,
        answeredQuestions
      })
    }))
  };
}

function mapBankExerciseToChallenge(exercise) {
  const categoryMap = {
    vocab_choice: "词汇",
    multiple_choice: "理解",
    fill_blank_choice: "填空",
    sentence_order: "排序",
    translation_choice: "翻译"
  };
  const titleMap = {
    vocab_choice: "词汇能量",
    multiple_choice: "阅读理解",
    fill_blank_choice: "补全句子",
    sentence_order: "语序拼图",
    translation_choice: "翻译选择"
  };
  const xpMap = {
    vocab_choice: 10,
    multiple_choice: 12,
    fill_blank_choice: 10,
    sentence_order: 12,
    translation_choice: 8
  };

  if (exercise.type === "sentence_order") {
    return {
      id: exercise.id,
      type: "order",
      category: categoryMap[exercise.type],
      title: titleMap[exercise.type],
      prompt: exercise.prompt,
      correctOrder: exercise.answer,
      options: (exercise.options || []).map((option) => ({
        id: option.id,
        label: option.text
      })),
      explanation: exercise.explanation,
      xp: xpMap[exercise.type]
    };
  }

  return {
    id: exercise.id,
    type: "choice",
    category: categoryMap[exercise.type] || "练习",
    title: titleMap[exercise.type] || "选择题",
    prompt: exercise.prompt,
    options: Object.entries(exercise.options || {}).map(([key, value]) => ({
      label: `${key}. ${value}`,
      correct: key === exercise.answer
    })),
    explanation: exercise.explanation,
    xp: xpMap[exercise.type] || 10
  };
}

function buildParagraphChallenges({ article, paragraphText, paragraphIndex, allSentences, answeredQuestions }) {
  const seed = `${article.id}-${paragraphIndex}`;
  return [
    buildVocabChallenge(paragraphText, seed),
    buildReadingChallenge(article, paragraphText, paragraphIndex, allSentences, answeredQuestions, seed),
    buildClozeChallenge(paragraphText, seed),
    buildOrderChallenge(paragraphText, seed),
    buildTranslationChallenge(paragraphText, seed)
  ];
}

function buildVocabChallenge(paragraphText, seed) {
  const keyword = pickKeyword(paragraphText, seed);
  const meaning = getMeaning(keyword.key);

  if (meaning) {
    return {
      id: `${seed}-vocab`,
      type: "choice",
      category: "词汇",
      title: "词汇能量",
      prompt: `“${keyword.raw}” 在本段最接近哪个意思？`,
      options: makeChoiceOptions(meaning, Object.values(GLOSSARY), `${seed}-vocab-options`),
      explanation: `“${keyword.raw}” 可以理解为“${meaning}”。`,
      xp: 10
    };
  }

  const words = keywordPool(paragraphText)
    .map((item) => item.raw)
    .filter((word) => word.toLowerCase() !== keyword.key);

  return {
    id: `${seed}-vocab`,
    type: "choice",
    category: "词汇",
    title: "词汇识别",
    prompt: "下面哪个词是本段的关键词？",
    options: makeChoiceOptions(keyword.raw, words, `${seed}-vocab-options`),
    explanation: `“${keyword.raw}” 是这段里较重要的内容词。`,
    xp: 10
  };
}

function buildReadingChallenge(article, paragraphText, paragraphIndex, allSentences, answeredQuestions, seed) {
  const sourceQuestion = answeredQuestions[paragraphIndex % Math.max(answeredQuestions.length, 1)];
  if (sourceQuestion) {
    const options = Object.entries(sourceQuestion.options || {}).map(([key, value]) => ({
      label: `${key}. ${value}`,
      correct: key === sourceQuestion.answer
    }));
    const correctOption = options.find((option) => option.correct);
    return {
      id: `${seed}-reading`,
      type: "choice",
      category: "理解",
      title: "阅读理解",
      prompt: sourceQuestion.question,
      options,
      explanation: correctOption ? `正确答案是 ${correctOption.label}` : "这道题需要在题库中补充答案。",
      xp: 12
    };
  }

  const correctSentence = chooseSentence(paragraphText, seed, { minWords: 6, maxWords: 30 });
  const decoys = allSentences.filter((sentence) => normalizeText(sentence) !== normalizeText(correctSentence));

  return {
    id: `${seed}-reading`,
    type: "choice",
    category: "理解",
    title: "阅读理解",
    prompt: "哪一句最符合本段内容？",
    options: makeChoiceOptions(correctSentence, decoys, `${seed}-reading-options`),
    explanation: "回到原段落定位关键信息，可以更快排除干扰项。",
    xp: 12
  };
}

function buildClozeChallenge(paragraphText, seed) {
  const keyword = pickKeyword(paragraphText, `${seed}-cloze`);
  const sentence = chooseSentenceContaining(paragraphText, keyword.raw) || chooseSentence(paragraphText, seed);
  const blanked = sentence.replace(new RegExp(`\\b${escapeRegExp(keyword.raw)}\\b`, "i"), "_____");
  const decoys = keywordPool(paragraphText)
    .map((item) => item.raw)
    .filter((word) => word.toLowerCase() !== keyword.key);

  return {
    id: `${seed}-cloze`,
    type: "choice",
    category: "填空",
    title: "补全句子",
    prompt: blanked === sentence ? `在本段中选择合适的词：${sentence}` : blanked,
    options: makeChoiceOptions(keyword.raw, decoys, `${seed}-cloze-options`),
    explanation: `原句使用的是 “${keyword.raw}”。`,
    xp: 10
  };
}

function buildOrderChallenge(paragraphText, seed) {
  const sentence = chooseSentence(paragraphText, `${seed}-order`, { minWords: 7, maxWords: 22 });
  const chunks = chunkSentence(sentence);
  const options = seededShuffle(
    chunks.map((label, index) => ({ id: `${index}`, label })),
    `${seed}-order-options`
  );

  return {
    id: `${seed}-order`,
    type: "order",
    category: "排序",
    title: "语序拼图",
    prompt: "按正确顺序拼回原句。",
    sentence,
    correctOrder: chunks.map((_, index) => `${index}`),
    options,
    explanation: sentence,
    xp: 12
  };
}

function buildTranslationChallenge(paragraphText, seed) {
  const sentence = chooseSentence(paragraphText, `${seed}-translation`, { minWords: 6, maxWords: 26 });
  const points = keywordPool(sentence)
    .slice(0, 4)
    .map((item) => `${item.raw}: ${getMeaning(item.key) || "关键词"}`);

  return {
    id: `${seed}-translation`,
    type: "translation",
    category: "翻译",
    title: "翻译挑战",
    prompt: "把这句英文翻译成中文。",
    sentence,
    referencePoints: points.length ? points : ["先抓主语、谓语，再补充修饰信息"],
    explanation: "翻译题在 MVP 中采用自评；正式题库可在 JSON 中补充 referenceTranslation 后自动判分。",
    xp: 8
  };
}

function splitIntoLearningParagraphs(text) {
  const blocks = text
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);

  const sourceBlocks = blocks.length ? blocks : [text.trim()];
  return sourceBlocks.flatMap((block) => splitLongBlock(block));
}

function splitLongBlock(block) {
  const sentences = splitSentences(block);
  if (sentences.length <= 1 || countWords(block) <= 90) return [block.trim()];

  const groups = [];
  let current = [];
  let currentCount = 0;

  sentences.forEach((sentence) => {
    const sentenceCount = countWords(sentence);
    const shouldStartNew = current.length > 0 && (currentCount + sentenceCount > 82 || current.length >= 3);
    if (shouldStartNew) {
      groups.push(current.join(" "));
      current = [];
      currentCount = 0;
    }
    current.push(sentence);
    currentCount += sentenceCount;
  });

  if (current.length) groups.push(current.join(" "));
  return groups;
}

function splitSentences(text) {
  return (
    text
      .replace(/\s+/g, " ")
      .match(/[^.!?。！？]+[.!?。！？]["”']?|[^.!?。！？]+$/g) || [text]
  )
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function keywordPool(text) {
  const seen = new Set();
  const tokens = (text.match(/[A-Za-z][A-Za-z'-]{2,}/g) || [])
    .map((raw) => ({ raw, key: raw.toLowerCase().replace(/^'|'$/g, "") }))
    .filter((item) => !STOPWORDS.has(item.key) && item.key.length > 3)
    .filter((item) => {
      if (seen.has(item.key)) return false;
      seen.add(item.key);
      return true;
    });

  const withMeaning = tokens.filter((item) => getMeaning(item.key));
  const withoutMeaning = tokens
    .filter((item) => !getMeaning(item.key))
    .sort((a, b) => b.key.length - a.key.length);

  return [...withMeaning, ...withoutMeaning];
}

function pickKeyword(text, seed) {
  const pool = keywordPool(text);
  if (!pool.length) return { raw: "English", key: "english" };
  const preferred = pool.filter((item) => getMeaning(item.key));
  const source = preferred.length ? preferred : pool;
  return source[hashString(seed) % source.length];
}

function getMeaning(key) {
  return GLOSSARY[key] || GLOSSARY[key.replace(/s$/, "")] || null;
}

function chooseSentence(text, seed, limits = {}) {
  const minWords = limits.minWords || 5;
  const maxWords = limits.maxWords || 34;
  const sentences = splitSentences(text);
  const candidates = sentences.filter((sentence) => {
    const words = countWords(sentence);
    return words >= minWords && words <= maxWords;
  });
  const source = candidates.length ? candidates : sentences;
  return source[hashString(seed) % source.length] || text.trim();
}

function chooseSentenceContaining(text, word) {
  return splitSentences(text).find((sentence) => new RegExp(`\\b${escapeRegExp(word)}\\b`, "i").test(sentence));
}

function chunkSentence(sentence) {
  const cleaned = sentence.replace(/[“”"]/g, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= 8) return words;

  const chunkSize = words.length > 16 ? 3 : 2;
  const chunks = [];
  for (let index = 0; index < words.length; index += chunkSize) {
    chunks.push(words.slice(index, index + chunkSize).join(" "));
  }
  return chunks;
}

function makeChoiceOptions(correct, decoys, seed) {
  const uniqueDecoys = uniqueStrings(decoys)
    .filter((item) => normalizeText(item) !== normalizeText(correct))
    .slice(0, 16);
  const filledDecoys = uniqueDecoys.length >= 3 ? uniqueDecoys : [...uniqueDecoys, ...fallbackDecoys(correct)];
  return seededShuffle([correct, ...filledDecoys.slice(0, 3)], seed).map((label) => ({
    label,
    correct: normalizeText(label) === normalizeText(correct)
  }));
}

function fallbackDecoys(correct) {
  const values = Object.values(GLOSSARY).filter((item) => normalizeText(item) !== normalizeText(correct));
  return seededShuffle(values, `fallback-${correct}`).slice(0, 4);
}

function renderArticleSelect() {
  els.articleSelect.innerHTML = state.courses
    .map((article) => `<option value="${escapeHTML(article.id)}">${escapeHTML(article.title)}</option>`)
    .join("");
  els.articleSelect.value = state.activeArticleId;
}

function renderStats() {
  els.totalXp.textContent = state.progress.xp;
  els.streakDays.textContent = `${state.progress.streak} 天`;
  els.heartCount.textContent = state.progress.hearts;
  els.studyTimeText.textContent = formatStudyDuration(state.progress.studySeconds);
}

function renderCurrentArticle() {
  const article = getActiveArticle();
  if (!article) return;
  els.articleKicker.textContent =
    article.type === "custom_reading" ? "自定义课程" : article.unitMode === "sentence" ? "句子级题库" : "本地题库";
  els.articleTitle.textContent = article.title;
  renderMap();
}

function renderMap() {
  const article = getActiveArticle();
  if (!article) return;

  const completed = getCompletedSet(article.id);
  const percent = Math.round((completed.size / article.paragraphs.length) * 100);
  const nextIndex = article.paragraphs.findIndex((_, index) => !completed.has(index));
  const heroIndex = nextIndex === -1 ? article.paragraphs.length : nextIndex + 1;
  const unitLabel = getUnitLabel(article);
  const unitCopy = getUnitCopy(article);
  els.paragraphCount.textContent = `${article.paragraphs.length} ${unitLabel}`;
  els.courseProgressText.textContent = `${percent}% 完成`;
  els.courseProgressBar.style.width = `${percent}%`;
  els.courseHeroTitle.textContent = article.title;
  els.courseHeroText.textContent =
    nextIndex === -1
      ? "整篇文章已完成，可以重练巩固。"
      : `下一关：第 ${heroIndex} ${unitCopy} · ${article.paragraphs.length} ${unitLabel}课程`;
  els.profileCourseTitle.textContent = article.title;

  els.levelMap.innerHTML = article.paragraphs
    .map((paragraph, index) => {
      const done = completed.has(index);
      const unlocked = index === 0 || completed.has(index - 1) || done;
      const current = unlocked && !done && (index === 0 || completed.has(index - 1));
      const side = index % 2 === 0 ? "left" : "right";
      const classes = ["level-card", side, done ? "done" : "", current ? "current" : "", unlocked ? "" : "locked"]
        .filter(Boolean)
        .join(" ");
      const label = done ? "已完成" : unlocked ? "开始" : "待解锁";
      const actionLabel = current ? "继续学习" : done ? "重练" : label;
      return `
        <button class="${classes}" type="button" data-level-index="${index}" ${unlocked ? "" : "disabled"}>
          <span class="level-number">${done ? "✓" : index + 1}</span>
          <div class="level-copy">
            <h3>第 ${index + 1} 关</h3>
            <p>${escapeHTML(paragraph.text)}</p>
            <div class="level-meta">
              <span class="type-pill">词汇</span>
              <span class="type-pill">理解</span>
              <span class="type-pill">${paragraph.challenges.length}题</span>
              <span class="level-start">${actionLabel}</span>
            </div>
          </div>
        </button>
      `;
    })
    .join("");

  els.levelMap.querySelectorAll("[data-level-index]").forEach((button) => {
    button.addEventListener("click", () => startLesson(Number(button.dataset.levelIndex)));
  });
}

function startLesson(paragraphIndex) {
  const article = getActiveArticle();
  if (!article) return;
  const completed = getCompletedSet(article.id);
  const unlocked = paragraphIndex === 0 || completed.has(paragraphIndex - 1) || completed.has(paragraphIndex);
  if (!unlocked) {
    showToast("先完成前一关，再继续解锁。");
    return;
  }

  state.activeParagraphIndex = paragraphIndex;
  state.challengeIndex = 0;
  state.selectedChoiceIndex = null;
  state.orderSelection = [];
  state.currentResult = null;
  state.lessonStats = {
    correct: 0,
    wrong: 0,
    xp: 0,
    answered: 0,
    startTime: Date.now()
  };

  setScreen("lesson");
  renderLesson();
}

function renderLesson() {
  const article = getActiveArticle();
  const paragraph = getCurrentParagraph();
  if (!paragraph) return;

  const total = paragraph.challenges.length;
  els.lessonProgressBar.style.width = `${(state.challengeIndex / total) * 100}%`;
  els.lessonStepText.textContent = `${state.challengeIndex + 1} / ${total}`;
  els.lessonXpText.textContent = `+${state.lessonStats?.xp || 0} XP`;
  els.paragraphBadge.textContent = getUnitBadge(article, paragraph);
  els.paragraphText.textContent = paragraph.text;
  hideFeedback();
  renderChallenge();
}

function renderChallenge() {
  const challenge = getCurrentChallenge();
  if (!challenge) return;

  if (challenge.type === "choice") renderChoiceChallenge(challenge);
  if (challenge.type === "order") renderOrderChallenge(challenge);
  if (challenge.type === "translation") renderTranslationChallenge(challenge);

  if (state.currentResult) {
    showFinalFeedback(state.currentResult);
  }
}

function renderChoiceChallenge(challenge) {
  els.challengeCard.innerHTML = `
    <div class="challenge-top">
      <h3>${escapeHTML(challenge.title)}</h3>
      <span class="type-pill">${escapeHTML(challenge.category)}</span>
    </div>
    <p class="challenge-prompt">${escapeHTML(challenge.prompt)}</p>
    <div class="choice-grid">
      ${challenge.options
        .map((option, index) => {
          const selected = state.selectedChoiceIndex === index;
          const resultClass = state.currentResult
            ? option.correct
              ? "correct"
              : selected
                ? "wrong"
                : ""
            : "";
          const stateLabel = state.currentResult
            ? option.correct
              ? "正确"
              : selected
                ? "错误"
                : ""
            : "";
          return `
            <button class="choice-option ${selected ? "selected" : ""} ${resultClass}" type="button" data-choice-index="${index}" ${state.currentResult ? "disabled" : ""}>
              <span class="choice-label">${escapeHTML(option.label)}</span>
              ${stateLabel ? `<span class="answer-state">${stateLabel}</span>` : ""}
            </button>
          `;
        })
        .join("")}
    </div>
    <div class="actions">
      <button id="checkChoiceBtn" class="primary-btn" type="button" ${state.currentResult ? "disabled" : ""}>检查答案</button>
    </div>
  `;

  els.challengeCard.querySelectorAll("[data-choice-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedChoiceIndex = Number(button.dataset.choiceIndex);
      renderChallenge();
    });
  });

  els.challengeCard.querySelector("#checkChoiceBtn").addEventListener("click", () => {
    if (state.selectedChoiceIndex === null) {
      showToast("先选择一个答案。");
      return;
    }
    const selected = challenge.options[state.selectedChoiceIndex];
    finishChallenge(selected.correct, selected.correct ? challenge.xp : 0, challenge.explanation);
  });
}

function renderOrderChallenge(challenge) {
  const used = new Set(state.orderSelection);
  const selectedTokens = state.orderSelection
    .map((id) => challenge.options.find((option) => option.id === id) || { id, label: "" })
    .map(
      (option, index) =>
        `<button class="selected-token" type="button" data-remove-order="${index}">${escapeHTML(option.label)}</button>`
    )
    .join("");

  els.challengeCard.innerHTML = `
    <div class="challenge-top">
      <h3>${escapeHTML(challenge.title)}</h3>
      <span class="type-pill">${escapeHTML(challenge.category)}</span>
    </div>
    <p class="challenge-prompt">${escapeHTML(challenge.prompt)}</p>
    <div class="order-board">
      <div class="selected-row" aria-label="已选择片段">${selectedTokens}</div>
      <div class="token-row" aria-label="可选片段">
        ${challenge.options
          .map(
            (option) => `
              <button class="order-token ${used.has(option.id) ? "used" : ""}" type="button" data-order-id="${option.id}" ${used.has(option.id) || state.currentResult ? "disabled" : ""}>
                ${escapeHTML(option.label)}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
    <div class="actions">
      <button id="checkOrderBtn" class="primary-btn" type="button" ${state.currentResult ? "disabled" : ""}>检查答案</button>
      <button id="resetOrderBtn" class="secondary-btn" type="button" ${state.currentResult ? "disabled" : ""}>重排</button>
    </div>
  `;

  els.challengeCard.querySelectorAll("[data-order-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.orderSelection.push(button.dataset.orderId);
      renderChallenge();
    });
  });

  els.challengeCard.querySelectorAll("[data-remove-order]").forEach((button) => {
    button.addEventListener("click", () => {
      state.orderSelection.splice(Number(button.dataset.removeOrder), 1);
      renderChallenge();
    });
  });

  els.challengeCard.querySelector("#resetOrderBtn").addEventListener("click", () => {
    state.orderSelection = [];
    renderChallenge();
  });

  els.challengeCard.querySelector("#checkOrderBtn").addEventListener("click", () => {
    if (state.orderSelection.length !== challenge.correctOrder.length) {
      showToast("先把所有片段放到上方。");
      return;
    }
    const isCorrect = challenge.correctOrder.every((id, index) => id === state.orderSelection[index]);
    finishChallenge(isCorrect, isCorrect ? challenge.xp : 0, `原句：${challenge.explanation}`);
  });
}

function renderTranslationChallenge(challenge) {
  els.challengeCard.innerHTML = `
    <div class="challenge-top">
      <h3>${escapeHTML(challenge.title)}</h3>
      <span class="type-pill">${escapeHTML(challenge.category)}</span>
    </div>
    <p class="challenge-prompt">${escapeHTML(challenge.prompt)}</p>
    <p class="challenge-prompt"><strong>${escapeHTML(challenge.sentence)}</strong></p>
    <div class="translation-box">
      <textarea id="translationInput" placeholder="输入你的中文翻译"></textarea>
      <div class="actions">
        <button id="submitTranslationBtn" class="primary-btn" type="button" ${state.currentResult ? "disabled" : ""}>提交翻译</button>
      </div>
    </div>
  `;

  els.challengeCard.querySelector("#submitTranslationBtn").addEventListener("click", () => {
    const value = els.challengeCard.querySelector("#translationInput").value.trim();
    if (value.length < 4) {
      showToast("先写下你的中文理解。");
      return;
    }

    els.feedbackBar.className = "feedback-bar success";
    els.feedbackBar.innerHTML = `
      <strong>对照参考要点</strong>
      <p>${escapeHTML(challenge.explanation)}</p>
      <ul class="reference-points">
        ${challenge.referencePoints.map((point) => `<li>${escapeHTML(point)}</li>`).join("")}
      </ul>
      <div class="actions">
        <button id="selfPassBtn" class="primary-btn" type="button">基本正确</button>
        <button id="retryTranslationBtn" class="secondary-btn" type="button">再练一次</button>
      </div>
    `;
    els.feedbackBar.classList.remove("hidden");

    els.feedbackBar.querySelector("#selfPassBtn").addEventListener("click", () => {
      finishChallenge(true, challenge.xp, "翻译已完成。正式题库可加入参考译文和关键词判分。");
    });

    els.feedbackBar.querySelector("#retryTranslationBtn").addEventListener("click", () => {
      hideFeedback();
      els.challengeCard.querySelector("#translationInput").focus();
    });
  });
}

function finishChallenge(correct, xp, explanation) {
  if (state.currentResult) return;

  state.lessonStats.answered += 1;
  state.lessonStats.xp += xp;
  state.progress.xp += xp;

  if (correct) {
    state.lessonStats.correct += 1;
  } else {
    state.lessonStats.wrong += 1;
    state.progress.hearts = Math.max(0, state.progress.hearts - 1);
  }

  state.currentResult = {
    correct,
    xp,
    title: correct ? "答对了" : "再看一眼",
    message: explanation
  };

  saveProgress();
  renderStats();
  els.lessonXpText.textContent = `+${state.lessonStats.xp} XP`;
  renderChallenge();
}

function showFinalFeedback(result) {
  els.feedbackBar.className = `feedback-bar ${result.correct ? "success" : "error"}`;
  els.feedbackBar.innerHTML = `
    <strong>${escapeHTML(result.title)} · +${result.xp} XP</strong>
    <p>${escapeHTML(result.message)}</p>
    <div class="actions">
      <button id="continueBtn" class="primary-btn" type="button">继续</button>
    </div>
  `;
  els.feedbackBar.classList.remove("hidden");
  els.feedbackBar.querySelector("#continueBtn").addEventListener("click", continueLesson);
}

function continueLesson() {
  const paragraph = getCurrentParagraph();
  if (!paragraph) return;

  if (state.challengeIndex < paragraph.challenges.length - 1) {
    state.challengeIndex += 1;
    state.selectedChoiceIndex = null;
    state.orderSelection = [];
    state.currentResult = null;
    renderLesson();
    return;
  }

  completeLesson();
}

function completeLesson() {
  const article = getActiveArticle();
  if (!article) return;

  const elapsed = Math.max(1, Math.round((Date.now() - state.lessonStats.startTime) / 1000));
  const completed = getCompletedSet(article.id);
  completed.add(state.activeParagraphIndex);
  state.progress.completed[article.id] = [...completed].sort((a, b) => a - b);
  state.progress.hearts = Math.min(5, state.progress.hearts + 1);
  state.progress.studySeconds += elapsed;
  saveProgress();
  renderStats();
  renderSummary(elapsed);
  setScreen("summary");
}

function renderSummary(elapsedOverride) {
  const article = getActiveArticle();
  const stats = state.lessonStats;
  const elapsed = elapsedOverride ?? Math.max(1, Math.round((Date.now() - stats.startTime) / 1000));
  const paragraphNumber = state.activeParagraphIndex + 1;
  const isLast = state.activeParagraphIndex >= article.paragraphs.length - 1;
  const unitCopy = getUnitCopy(article);

  els.summaryTitle.textContent = `第 ${paragraphNumber} 关完成`;
  els.summaryText.textContent = `你完成了 ${stats.answered} 道${unitCopy}练习。继续闯关，整篇文章会变成一条清晰的学习路径。`;
  els.summaryCorrect.textContent = `${stats.correct} / ${stats.answered}`;
  els.summaryXp.textContent = `+${stats.xp}`;
  els.summaryTime.textContent = `${elapsed}s`;
  els.nextLevelBtn.innerHTML = isLast
    ? `<span class="btn-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v6h6" /></svg></span>完成整篇`
    : `<span class="btn-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>下一关`;
}

function setScreen(screen) {
  state.screen = screen;
  document.body.dataset.screen = screen;
  [els.mapScreen, els.profileScreen, els.lessonScreen, els.summaryScreen].forEach((element) =>
    element.classList.remove("active")
  );
  if (screen === "map") els.mapScreen.classList.add("active");
  if (screen === "profile") els.profileScreen.classList.add("active");
  if (screen === "lesson") els.lessonScreen.classList.add("active");
  if (screen === "summary") els.summaryScreen.classList.add("active");
  els.backToMapBtn.classList.toggle("hidden", screen === "map" || screen === "profile");
  if (screen === "map") {
    setActiveTab("quest");
  } else if (screen === "profile") {
    setActiveTab("me");
  } else {
    setActiveTab("");
  }
}

function setActiveTab(tab) {
  document.body.dataset.tab = tab;
  [
    ["quest", els.tabQuest],
    ["import", els.tabImport],
    ["me", els.tabMe]
  ].forEach(([name, element]) => {
    element.classList.toggle("active", name === tab);
  });
}

function updateLessonFontSize(nextIndex) {
  state.fontSizeIndex = Math.max(0, Math.min(FONT_SIZE_STEPS.length - 1, nextIndex));
  localStorage.setItem(FONT_SIZE_KEY, String(state.fontSizeIndex));
  applyLessonFontSize();
}

function applyLessonFontSize() {
  document.body.style.setProperty("--lesson-font-size", `${FONT_SIZE_STEPS[state.fontSizeIndex]}rem`);
  els.fontSizeLabel.textContent = FONT_SIZE_LABELS[state.fontSizeIndex];
  els.decreaseFontBtn.disabled = state.fontSizeIndex === 0;
  els.increaseFontBtn.disabled = state.fontSizeIndex === FONT_SIZE_STEPS.length - 1;
}

function hideFeedback() {
  els.feedbackBar.className = "feedback-bar hidden";
  els.feedbackBar.innerHTML = "";
}

function getActiveArticle() {
  return state.courses.find((article) => article.id === state.activeArticleId) || state.courses[0];
}

function getCurrentParagraph() {
  return getActiveArticle()?.paragraphs[state.activeParagraphIndex] || null;
}

function getCurrentChallenge() {
  return getCurrentParagraph()?.challenges[state.challengeIndex] || null;
}

function getUnitLabel(article) {
  return article?.unitMode === "sentence" ? "单元" : "段";
}

function getUnitCopy(article) {
  return article?.unitMode === "sentence" ? "句子单元" : "段落";
}

function getUnitBadge(article, paragraph) {
  if (article?.unitMode !== "sentence") return `段落 ${paragraph.index}`;
  const label = paragraph.granularity === "sentence_group" ? "句组" : "句子";
  return `${label} ${paragraph.index}`;
}

function getCompletedSet(articleId) {
  return new Set(state.progress.completed[articleId] || []);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.add("hidden"), 2600);
}

function formatStudyDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return restMinutes ? `${hours}时${restMinutes}分` : `${hours}时`;
}

function uniqueStrings(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeText(item);
    if (!item || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function seededShuffle(items, seed) {
  const result = [...items];
  let value = hashString(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const swapIndex = value % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function hashString(input) {
  return String(input)
    .split("")
    .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
}

function countWords(text) {
  return (text.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;
}

function normalizeText(text) {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

init();
registerServiceWorker();
