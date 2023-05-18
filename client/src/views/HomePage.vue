<template>
  <div class="home">
    <div class="greets">
      <h1 class="homepage_title">Добро пожаловать в Интернет-магазин</h1>
    </div>
    <carousel :wrap-around="true" :items-to-show="1">
      <slide class="slide" v-for="slide in slides" :key="slide.id">
        <div
          class="slideItem"
          v-for="slideItem in slide.items"
          :key="slideItem.id"
        >
          <div class="slideItem_title">{{ slideItem.title }}</div>
          <img class="slideItem_image" :src="getImageUrl(slideItem.imageUrl)" />
        </div>
      </slide>

      <template #addons>
        <navigation />
      </template>
    </carousel>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { v4 as uuidv4 } from "uuid";
import { useUserUtilities } from "../composables/utilities";

const { getImageUrl } = useUserUtilities();
type Slide = {
  imageUrl: string;
  title: string;
  id: string;
};

type MiniSlider = {
  id: string;
  items: Slide[];
};

const slides: MiniSlider[] = [
  {
    id: uuidv4(),
    items: [
      {
        imageUrl: "../assets/slides/slide1.png",
        title: "Телефоны и гаджеты",
        id: uuidv4(),
      },
      {
        imageUrl: "../assets/slides/slide2.png",
        title: "Бытовая техника",
        id: uuidv4(),
      },

      {
        imageUrl: "../assets/slides/slide3.png",
        title: "ТВ, Аудио, Видео",
        id: uuidv4(),
      },
      {
        imageUrl: "../assets/slides/slide4.png",
        title: "Компьютеры",
        id: uuidv4(),
      },
    ],
  },
  {
    id: uuidv4(),
    items: [
      {
        imageUrl: "../assets/slides/slide1.png",
        title: "Телефоны и гаджеты",
        id: uuidv4(),
      },
      {
        imageUrl: "../assets/slides/slide2.png",
        title: "Бытовая техника",
        id: uuidv4(),
      },

      {
        imageUrl: "../assets/slides/slide3.png",
        title: "ТВ, Аудио, Видео",
        id: uuidv4(),
      },
      {
        imageUrl: "../assets/slides/slide4.png",
        title: "Компьютеры",
        id: uuidv4(),
      },
    ],
  },
];
</script>

<style >
.home {
  height: 70vh;
  padding: 50px 0;
}

.carousel {
  width: 1200px;
  margin: 0 auto;
  position: relative;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background-color: #f1f1f1;
  padding: 15px;
  font-size: 0;
  border-radius: 50%;
  background-size: 20px 25px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("../assets/slider-arrow.svg");
}

.carousel__next {
  position: absolute;
  right: -40px;
}

.carousel__prev {
  background-image: url("../assets/slider-arrow-prev.svg");
  position: absolute;
  left: -40px;
}

.slide {
  display: flex;
  justify-content: center;
  column-gap: 30px;
}

.slideItem {
  padding: 10px;
  width: 250px;
  height: 320px;
  border: 1px solid #ebebeb;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
}
.slideItem_title {
  font-size: 28px;
  margin-bottom: 20px;
}
.slideItem_image {
  width: 230px;
  object-fit: cover;
}
.homepage_title {
  font-size: 40px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 50px;
}

.homepage_title {
  text-align: center;

  background: linear-gradient(
    to right,
    #ac2200 20%,
    rgb(221, 72, 3) 40%,
    rgb(255, 0, 0) 60%,
    #968e8c 80%
  );
  background-size: 200% auto;
  color: #000;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: shine 1s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}
</style>
