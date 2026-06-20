/**
 * -------------------------------------------------------------
 * 1. Spanish Word Data (word: Spanish word, article: Gender article, meaning: Korean translation)
 * -------------------------------------------------------------
 */
const WORDS_DATA = [
  { word: "problema", article: "el", meaning: "문제" },
  { word: "mapa", article: "el", meaning: "지도" },
  { word: "mano", article: "la", meaning: "손" },
  { word: "foto", article: "la", meaning: "사진" },
  { word: "moto", article: "la", meaning: "오토바이" },
  { word: "día", article: "el", meaning: "하루" },
  { word: "agua", article: "el", meaning: "물" },
  { word: "planeta", article: "el", meaning: "행성" },
  { word: "idioma", article: "el", meaning: "언어" },
  { word: "flor", article: "la", meaning: "꽃" },
  { word: "clima", article: "el", meaning: "기후" },
  { word: "programa", article: "el", meaning: "프로그램" },
  { word: "tema", article: "el", meaning: "주제" },
  { word: "sistema", article: "el", meaning: "시스템" },
  { word: "sofá", article: "el", meaning: "소파" },
  { word: "radio", article: "la", meaning: "라디오" },
  { word: "luz", article: "la", meaning: "빛" },
  { word: "clase", article: "la", meaning: "수업" },
  { word: "leche", article: "la", meaning: "우유" },
  { word: "carne", article: "la", meaning: "고기" },
  { word: "ciudad", article: "la", meaning: "도시" },
  { word: "canción", article: "la", meaning: "노래" },
  { word: "árbol", article: "el", meaning: "나무" },
  { word: "lápiz", article: "el", meaning: "연필" },
  { word: "corazón", article: "el", meaning: "마음" },
  { word: "arquitectura", article: "la", meaning: "건축" },
  { word: "auditorio", article: "el", meaning: "콘서트 홀, 강당" },
  { word: "baile", article: "el", meaning: "춤, 댄스" },
  { word: "ciclismo", article: "el", meaning: "사이클링, 자전거 경기" },
  { word: "comedia", article: "la", meaning: "코미디" },
  { word: "concierto", article: "el", meaning: "음악회, 콘서트" },
  { word: "crítica", article: "la", meaning: "비평" },
  { word: "deporte", article: "el", meaning: "운동, 스포츠" },
  { word: "dibujo", article: "el", meaning: "그림" },
  { word: "disciplina artística", article: "la", meaning: "예술적 연마, 훈련" },
  { word: "drama", article: "el", meaning: "드라마" },
  { word: "ensayo", article: "el", meaning: "수필" },
  { word: "entrada", article: "la", meaning: "입장권" },
  { word: "escultura", article: "la", meaning: "조각" },
  { word: "espectáculo", article: "el", meaning: "공연" },
  { word: "estadio", article: "el", meaning: "경기장" },
  { word: "evento", article: "el", meaning: "행사" },
  { word: "exposición", article: "la", meaning: "전시(회)" },
  { word: "feria", article: "la", meaning: "박람회, (시)장" },
  { word: "fila", article: "la", meaning: "(좌석 등의) 열, 줄" },
  { word: "función", article: "la", meaning: "공연" },
  { word: "galería", article: "la", meaning: "화랑, 갤러리" },
  { word: "golf", article: "el", meaning: "골프" },
  { word: "película", article: "la", meaning: "영화" },
  { word: "lectura", article: "la", meaning: "독서" },
  { word: "novela", article: "la", meaning: "소설" },
  { word: "asiento", article: "el", meaning: "좌석" },
  { word: "metro", article: "el", meaning: "지하철" },
  { word: "tren", article: "el", meaning: "기차" },
  { word: "pasaporte", article: "el", meaning: "여권" },
  { word: "despacho", article: "el", meaning: "연구실, 서재" },
  { word: "coche", article: "el", meaning: "자동차" }
];

/**
 * -------------------------------------------------------------
 * 2. Game State Variables
 * -------------------------------------------------------------
 */
let gameWords = [];       // List of words active in the current round
let selectedWordId = null; // ID of the currently selected word card
let correctCount = 0;     // Number of correctly matched words
const totalCount = 10;     // Number of cards to play in one round
let toastTimeoutId = null; // Timeout reference for toast notification

/**
 * -------------------------------------------------------------
 * 3. DOM Elements Setup
 * -------------------------------------------------------------
 */
const wordGrid = document.getElementById("word-grid");
const progressText = document.getElementById("progress-text");
const progressBarFill = document.getElementById("progress-bar-fill");
const successModal = document.getElementById("success-modal");
const btnRestart = document.getElementById("btn-restart");
const toast = document.getElementById("toast");
const articleButtons = document.querySelectorAll(".btn-article");

/**
 * -------------------------------------------------------------
 * 4. Helper & Core Game Functions
 * -------------------------------------------------------------
 */

// Shuffles an array using the Fisher-Yates shuffle algorithm
function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Shows a custom toast notification with a slide-up effect
function showToast(message) {
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }
  
  toast.textContent = message;
  toast.classList.remove("hidden");
  
  // Slide up and fade in
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";

  toastTimeoutId = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    
    // Hide completely after transition finishes
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 300);
  }, 2500);
}

// Updates progress bar and text UI
function updateProgress() {
  progressText.textContent = `${correctCount} / ${totalCount} 맞춤`;
  const percentage = (correctCount / totalCount) * 100;
  progressBarFill.style.width = `${percentage}%`;
}

// Renders the word cards grid dynamically
function renderGrid() {
  wordGrid.innerHTML = "";
  
  gameWords.forEach(item => {
    const card = document.createElement("div");
    card.className = "word-card";
    card.id = `card-${item.id}`;
    
    // Accessibility markup
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `단어: ${item.word}, 뜻: ${item.meaning}`);
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <span class="word-sp">${item.word}</span>
      <span class="word-ko">${item.meaning}</span>
    `;

    // Click handler to select card
    card.addEventListener("click", () => selectCard(item.id));
    
    // Keyboard support (Enter/Space)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectCard(item.id);
      }
    });

    wordGrid.appendChild(card);
  });
}

// Handles selecting and toggling cards
function selectCard(id) {
  // If the clicked card is already selected, deselect it
  if (selectedWordId === id) {
    const activeCard = document.getElementById(`card-${selectedWordId}`);
    if (activeCard) activeCard.classList.remove("selected");
    selectedWordId = null;
    return;
  }

  // Remove selection from previous card if any
  if (selectedWordId !== null) {
    const prevCard = document.getElementById(`card-${selectedWordId}`);
    if (prevCard) prevCard.classList.remove("selected");
  }

  // Select the new card
  selectedWordId = id;
  const currentCard = document.getElementById(`card-${selectedWordId}`);
  if (currentCard) {
    currentCard.classList.add("selected");
  }
}

// Check matching article gender
function handleArticleSelect(selectedArticle) {
  // Check if a card is selected first
  if (selectedWordId === null) {
    showToast("단어 카드를 먼저 선택해 주세요! 👆");
    return;
  }

  // Find the word object in active list
  const activeWordObj = gameWords.find(item => item.id === selectedWordId);
  const cardElement = document.getElementById(`card-${selectedWordId}`);

  if (!activeWordObj || !cardElement) return;

  // Compare article gender
  if (activeWordObj.article === selectedArticle) {
    // Correct Match
    cardElement.classList.remove("selected");
    cardElement.classList.add("correct");
    
    // Save selected ID locally to block multiple inputs while animation plays
    const matchedId = selectedWordId;
    selectedWordId = null;
    
    // Wait for the success pulse + fadeOut animation (500ms)
    setTimeout(() => {
      // Remove element from grid display
      cardElement.remove();
      
      // Update score and progress
      correctCount++;
      updateProgress();

      // Check if all cards matched successfully
      if (correctCount === totalCount) {
        setTimeout(showSuccessModal, 300);
      }
    }, 500);
    
  } else {
    // Incorrect Match
    cardElement.classList.add("incorrect");
    
    // Remove incorrect class after animation ends to allow re-triggering
    cardElement.addEventListener('animationend', () => {
      cardElement.classList.remove("incorrect");
    }, { once: true });
    
    // Play a haptic-like toast on wrong match
    showToast(`틀렸습니다! '${activeWordObj.word}' 단어의 성별을 다시 확인해 보세요. ❌`);
  }
}

// Shows final success modal popup
function showSuccessModal() {
  successModal.classList.remove("hidden");
}

// Initializes / restarts the game state
function initGame() {
  // Reset states
  correctCount = 0;
  selectedWordId = null;
  updateProgress();
  
  // Shuffle words, take only 10 words, and append a unique identifier
  const shuffled = shuffle(WORDS_DATA);
  const selectedTen = shuffled.slice(0, 10);
  gameWords = selectedTen.map((item, index) => ({
    ...item,
    id: index
  }));

  // Render cards grid
  renderGrid();
  
  // Hide modal popup
  successModal.classList.add("hidden");
}

/**
 * -------------------------------------------------------------
 * 5. Event Listeners Setup
 * -------------------------------------------------------------
 */

// Connect Article Sidebar buttons
articleButtons.forEach(button => {
  button.addEventListener("click", () => {
    const articleVal = button.getAttribute("data-article");
    handleArticleSelect(articleVal);
  });
});

// Connect restart button inside success modal
btnRestart.addEventListener("click", initGame);

// Run initial game setup when document is loaded
window.addEventListener("DOMContentLoaded", initGame);
