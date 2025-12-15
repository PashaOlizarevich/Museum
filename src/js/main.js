import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../sass/style.scss";

const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      on: {
        init (swiper) {
          updateWelcomeCounter(swiper);
        },
        slideChange(wisper) {
          updateWelcomeCounter(swiper);
        },
      },
    modules: [Navigation, Pagination],
});

// функция обновления счётчика
function updateWelcomeCounter(swiper) {
 const counter = document.querySelector('.welcome__counter');
 if (!counter) return;
 // текущий слайд (нумерация с 1)
 const current = String(swiper.realIndex + 1).padStart(2, '0');
 // общее кол-во слайдов
 const total = String(swiper.slides.length).padStart(2, '0');
 // если включишь loop: total можно задать руками, например 5
 counter.textContent = `${current} | ${total}`;
}



import BeerSlider from 'beerslider';

import 'beerslider/dist/BeerSlider.css';

// если Vite, то скрипт уже подключён как type="module" в index.html

document.addEventListener('DOMContentLoaded', () => {

  const sliders = document.querySelectorAll('.beer-slider');

  sliders.forEach(slider => {

    new BeerSlider(slider, {

      // опционально: стартовая позиция в %

      // start: 50,

    });

  });

});
 






/* =========================
   КАСТОМНЫЙ ВИДЕОПЛЕЕР: JS
   ========================= */

/* 1) Находим нужные элементы в DOM */
const player = document.querySelector(".video-player__box");              // контейнер плеера (нужен для fullscreen + классов состояния)
const video = document.querySelector(".video-player__media");            // сам <video>
const overlayPlay = document.querySelector(".video-player__overlay-play"); // большая кнопка play по центру

const btnPlay = document.querySelector(".video-player__btn--play");      // play/pause в панели
const progress = document.querySelector(".video-player__progress-range");// прогресс-бар (перемотка)

const btnVolume = document.querySelector(".video-player__btn--volume");  // кнопка mute/unmute (иконка звука)
const volume = document.querySelector(".video-player__volume-range");    // ползунок громкости

const btnFullscreen = document.querySelector(".video-player__btn--fullscreen"); // fullscreen

const timeCurrent = document.querySelector(".video-player__time--current");   // текущее время "0:00"
const timeDuration = document.querySelector(".video-player__time--duration"); // длительность "0:00"

/* Если на странице нет плеера (защита), выходим */
if (!player || !video) {
  console.warn("Video player elements not found");
} else {
  /* 2) Вспомогательная функция: форматируем секунды в m:ss */
  function formatTime(seconds) {
    // seconds может быть дробным — приводим к целому
    const sec = Math.floor(seconds);
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    // padStart делает 5 -> "05"
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  /* 3) Переключатель Play/Pause */
  function togglePlay() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  /* 4) События Play/Pause:
        - добавляем/убираем класс is-playing (в CSS мы скрываем overlay кнопку)
        - можно менять aria-label, чтобы было доступно */
  video.addEventListener("play", () => {
    player.classList.add("is-playing");
    overlayPlay?.setAttribute("aria-label", "Pause video");
    btnPlay?.setAttribute("aria-label", "Pause");
  });

  video.addEventListener("pause", () => {
    player.classList.remove("is-playing");
    overlayPlay?.setAttribute("aria-label", "Play video");
    btnPlay?.setAttribute("aria-label", "Play");
  });

  /* 5) Клики по кнопкам Play (и большой, и маленькой) */
  overlayPlay?.addEventListener("click", togglePlay);
  btnPlay?.addEventListener("click", togglePlay);

  /* Дополнительно: клик по самому видео тоже ставим на play/pause (как на YouTube) */
  video.addEventListener("click", togglePlay);

  /* 6) Когда метаданные загрузились, мы узнаём duration (длительность) */
  video.addEventListener("loadedmetadata", () => {
    if (timeDuration) timeDuration.textContent = formatTime(video.duration);
    if (timeCurrent) timeCurrent.textContent = formatTime(0);
    if (progress) progress.value = 0;
  });

  /* 7) Обновляем прогресс и текущее время во время воспроизведения */
  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;

    // процент просмотра
    const percent = (video.currentTime / video.duration) * 100;

    // обновляем range
    if (progress) progress.value = String(percent);

    // обновляем текст времени
    if (timeCurrent) timeCurrent.textContent = formatTime(video.currentTime);
  });

  /* 8) Перемотка:
        input — срабатывает, когда пользователь тянет ползунок */
  progress?.addEventListener("input", () => {
    if (!video.duration) return;

    // progress.value = 0..100 => переводим в секунды
    const newTime = (Number(progress.value) / 100) * video.duration;
    video.currentTime = newTime;
  });

  /* 9) Громкость:
        video.volume принимает значение 0..1, а наш range 0..100 */
  volume?.addEventListener("input", () => {
    video.volume = Number(volume.value) / 100;

    // если громкость 0, логично считать muted
    video.muted = video.volume === 0;
  });

  /* 10) Mute/Unmute кнопка (иконка звука) */
  btnVolume?.addEventListener("click", () => {
    video.muted = !video.muted;

    // синхронизируем ползунок громкости с muted
    if (volume) {
      if (video.muted) {
        // если замьютили — ставим 0 (чтобы UI совпадал)
        volume.value = "0";
      } else {
        // если разьютили — вернём громкость (если была 0, сделаем например 50)
        if (Number(volume.value) === 0) volume.value = "50";
        video.volume = Number(volume.value) / 100;
      }
    }
  });

  /* 11) Fullscreen:
        лучше фуллскринить контейнер player, а не video,
        чтобы твои controls тоже были видны в fullscreen */
  btnFullscreen?.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await player.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen error:", err);
    }
  });

  /* 12) После окончания видео:
        - сбрасываем прогресс
        - возвращаем overlay кнопку */
  video.addEventListener("ended", () => {
    player.classList.remove("is-playing");
    if (progress) progress.value = "0";
    if (timeCurrent) timeCurrent.textContent = formatTime(0);
    video.currentTime = 0;
  });
}
