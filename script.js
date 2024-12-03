const carousel = document.querySelector('.carousel');
const cards = Array.from(carousel.children);
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const carouselStatus = document.getElementById('carouselStatus');

// Мобильные кнопки
const prevButtonMobile = document.getElementById('prevButtonMobile');
const nextButtonMobile = document.getElementById('nextButtonMobile');
const carouselStatusMobile = document.getElementById('carouselStatusMobile');

let currentIndex = 0;

function updateStatus() {
  carouselStatus.textContent = `${(currentIndex % cards.length) + 1} / ${
    cards.length
  }`;
  carouselStatusMobile.textContent = `${(currentIndex % cards.length) + 1} / ${
    cards.length
  }`;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === cards.length - 1;
  prevButtonMobile.disabled = currentIndex === 0;
  nextButtonMobile.disabled = currentIndex === cards.length - 1;
}

function showNextCard() {
  const firstCard = cards.shift();
  cards.push(firstCard);
  carousel.append(firstCard);
  currentIndex = (currentIndex + 1) % cards.length;
  updateStatus();
}



function showPrevCard() {
  const lastCard = cards.pop();
  cards.unshift(lastCard);
  carousel.prepend(lastCard);
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateStatus();
}

prevButton.addEventListener('click', showPrevCard);
nextButton.addEventListener('click', showNextCard);
prevButtonMobile.addEventListener('click', showPrevCard);
nextButtonMobile.addEventListener('click', showNextCard);

setInterval(showNextCard, 4000); // Каждые 4 секунды
updateStatus();

const indicators = document.querySelectorAll('.carousel-indicator circle');
const trackM = document.querySelector('.carousel-track_mobile');
const prevButtonM = document.getElementById('prevButton_M');
const nextButtonM = document.getElementById('nextButton_M');
const cardsM = document.querySelectorAll('.card_mobile');
let currentIndexM = 0;

// Обновляем состояние индикаторов
function updateIndicators() {
  indicators.forEach((circle, index) => {
    circle.setAttribute(
      'fill',
      index === currentIndexM ? '#313131' : '#D9D9D9'
    ); // Активный - темный, остальные - светлые
  });
}

// Функция для обновления смещения карусели
function updateCarousel() {
  const offset = -currentIndexM * 100 / 5; // Смещение для показа текущей карточки
  trackM.style.transform = `translateX(${offset}%)`;
  updateButtons();
}

// Обновляем состояние кнопок (активность/неактивность)
function updateButtons() {
  prevButtonM.disabled = currentIndexM === 0;
  nextButtonM.disabled = currentIndexM === cardsM.length - 1;
  // Изменяем стили кнопок для визуализации их состояния
  prevButtonM.style.opacity = prevButtonM.disabled ? '0.2' : '1';
  nextButtonM.style.opacity = nextButtonM.disabled ? '0.2' : '1';
}

// Слушатель событий для кнопки "Влево"
prevButtonM.addEventListener('click', () => {
  if (currentIndexM > 0) {
    currentIndexM--;
    updateIndicators();
    updateButtons();
    updateCarousel();
  }
});

// Слушатель событий для кнопки "Вправо"
nextButtonM.addEventListener('click', () => {
  if (currentIndexM < cardsM.length - 1) {
    currentIndexM++;
    updateIndicators();
    updateButtons();
    updateCarousel();
  }
});

// Инициализация карусели
function initCarousel() {
  currentIndexM = 0; // Убедимся, что начальный индекс установлен
  updateIndicators(); // Обновляем индикаторы
  updateButtons();
  updateCarousel(); // Устанавливаем начальное положение карусели
}

// Запуск карусели при загрузке страницы
initCarousel();

