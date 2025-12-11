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
 