function toggleGroup(targetsString) {
  const ids = targetsString.split(",").map((id) => id.trim());
  const elements = ids
    .map((id) => document.getElementById(id))
    .filter((el) => el);

  if (elements.length === 0) {
    console.log("Элементы не найдены");
    return;
  }

  // Проверяем состояние первого элемента
  const firstElementStyle = window.getComputedStyle(elements[0]);
  const areAllHidden = firstElementStyle.display === "none";

  // Переключаем все элементы
  elements.forEach((el) => {
    el.style.display = areAllHidden ? "block" : "none";
  });

  console.log(
    areAllHidden
      ? `Показано ${elements.length} элементов`
      : `Скрыто ${elements.length} элементов`
  );
}

// Обработчик для всех кнопок
document.querySelectorAll(".toggle-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const targets = this.getAttribute("data-targets");
    if (targets) {
      toggleGroup(targets);
    }
  });
});

// Основные функции для работы с изображениями
function toggleImage(imageId) {
  const image = document.getElementById(imageId);
  console.log(image);
  if (image.style.display === "none" || image.style.display === "") {
    showImage(image);
  } else {
    hideImage(image);
  }
}

function showImage(image) {
  image.style.display = "block";
  image.style.animation = "fadeIn 0.5s ease-in";

  // Прокрутка к изображению для удобства просмотра
  image.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function hideImage(image) {
  image.style.display = "none";
}

// Функция для показа/скрытия всех изображений одновременно
function toggleAllImages() {
  const images = document.querySelectorAll(".collapsible-image");
  const allHidden = Array.from(images).every(
    (img) => img.style.display === "none"
  );

  images.forEach((image) => {
    if (allHidden) {
      showImage(image);
    } else {
      hideImage(image);
    }
  });
}

// Функция для добавления новой картинки динамически
function addImage(containerId, imageUrl, altText, buttonText) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const imageId = "dynamicImage_" + Date.now();

  const imageHtml = `
        <div class="image-container">
            <button class="toggle-image-btn" onclick="toggleImage('${imageId}')">
                ${buttonText || "🖼️ Показать/скрыть изображение"}
            </button>
            <img id="${imageId}" src="${imageUrl}" alt="${altText}" class="collapsible-image" style="display:none;">
        </div>
    `;

  container.insertAdjacentHTML("beforeend", imageHtml);
}

// Функция для предзагрузки изображений
function preloadImages() {
  const images = document.querySelectorAll(".collapsible-image");
  images.forEach((img) => {
    const tempImage = new Image();
    tempImage.src = img.src;
  });
}

// Функция для добавления эффекта увеличения при клике
function addZoomEffect() {
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("collapsible-image")) {
      const image = e.target;
      if (image.classList.contains("zoomed")) {
        image.classList.remove("zoomed");
        document.body.style.overflow = "auto";
      } else {
        image.classList.add("zoomed");
        document.body.style.overflow = "hidden";
      }
    }
  });
}

// Добавляем CSS для эффекта увеличения
const zoomStyles = `
    .collapsible-image.zoomed {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.5);
        z-index: 1000;
        max-width: 90vw;
        max-height: 90vh;
        cursor: zoom-out;
        box-shadow: 0 0 0 1000px rgba(0,0,0,0.8);
    }
    
    .collapsible-image {
        cursor: zoom-in;
        transition: transform 0.3s ease;
    }
`;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Добавляем стили для zoom эффекта
  const styleSheet = document.createElement("style");
  styleSheet.textContent = zoomStyles;
  document.head.appendChild(styleSheet);

  // Предзагрузка изображений
  preloadImages();

  // Добавляем эффект увеличения
  addZoomEffect();

  // Добавляем кнопку для управления всеми изображениями (опционально)
  const header = document.querySelector(".header");
  if (header) {
    const globalControlBtn = document.createElement("button");
    globalControlBtn.textContent = "👁️ Показать/скрыть все изображения";
    globalControlBtn.className = "toggle-image-btn";
    globalControlBtn.style.marginTop = "15px";
    globalControlBtn.onclick = toggleAllImages;
    header.appendChild(globalControlBtn);
  }

  console.log("Image gallery initialized successfully!");
});

// Дополнительные утилиты для работы с изображениями

// Функция для получения списка всех изображений
function getAllImages() {
  return Array.from(document.querySelectorAll(".collapsible-image"));
}

// Функция для получения статуса изображений (открыты/закрыты)
function getImagesStatus() {
  const images = getAllImages();
  return images.map((img) => ({
    id: img.id,
    visible: img.style.display !== "none",
    src: img.src,
    alt: img.alt,
  }));
}

// Функция для сохранения состояния изображений в localStorage
function saveImagesState() {
  const state = getImagesStatus();
  localStorage.setItem("imagesState", JSON.stringify(state));
}

// Функция для восстановления состояния изображений из localStorage
function loadImagesState() {
  const savedState = localStorage.getItem("imagesState");
  if (savedState) {
    const state = JSON.parse(savedState);
    state.forEach((imgState) => {
      const img = document.getElementById(imgState.id);
      if (img) {
        img.style.display = imgState.visible ? "block" : "none";
      }
    });
  }
}

// Экспорт функций для глобального использования
window.ImageGallery = {
  toggleImage,
  showImage,
  hideImage,
  toggleAllImages,
  addImage,
  getAllImages,
  getImagesStatus,
  saveImagesState,
  loadImagesState,
};

// Пример использования для добавления новой картинки:
/*
// Добавить новую картинку в конец страницы
addImage(
    'content', 
    'https://example.com/image.jpg', 
    'Описание изображения',
    '📸 Моя новая картинка'
);
*/
