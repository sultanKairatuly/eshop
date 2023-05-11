<template>
  <Teleport to=".app">
    <div class="slider" v-if="props.isSlider">
      <div class="slider_content">
        <img
          src="../assets/close-icon.svg"
          @click="emit('changeSliderFlag', false)"
          class="close_slider-btn"
        />
        <div
          class="prev_slide_btn slider_navigator_btn"
          @click="handlePreviousSlideClick"
          v-if="currentSlideIndex !== 0"
        ></div>
        <img
          class="slider_item"
          :src="getImageUrl(image)"
          :key="image"
          v-for="(image, idx) in images"
          :class="{
            'slider_item-disactivated': idx !== props.currentSlideIndex,
          }"
        />
        <div
          class="next_slide_btn slider_navigator_btn"
          @click="handleNextSlideClick"
          v-if="props.currentSlideIndex !== props.images.length - 1"
        ></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUserUtilities } from "../composables/utilities";

const { getImageUrl } = useUserUtilities();
const props = defineProps<{
  isSlider: boolean;
  currentSlideIndex: number;
  images: string[];
}>();

const emit = defineEmits<{
  (e: "changeSlideIndex", value: number): void;
  (e: "changeSliderFlag", value: boolean): void;
}>();

function handlePreviousSlideClick() {
  if (props.currentSlideIndex !== 0) {
    emit("changeSlideIndex", props.currentSlideIndex - 1);
  }
}

function handleNextSlideClick() {
  if (props.currentSlideIndex !== props.images.length - 1) {
    emit("changeSlideIndex", props.currentSlideIndex + 1);
  }
}
</script>

<style scoped>
.slider {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000060;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
}
.slider_content {
  width: 75%;
  max-width: 1000px;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  position: relative;
}
.slider_item {
  width: 50%;
  height: 90%;
  object-fit: contain;
  user-select: none;
}

.slider_item-disactivated {
  display: none;
}

.slider_navigator_btn {
  background-repeat: no-repeat;
  width: 50px;
  height: 40px;
  position: absolute;
  cursor: pointer;
}
.next_slide_btn {
  background-image: url("../assets/sliders-controls.png");
  background-position: -22px -3px;
  right: 10px;
}

.prev_slide_btn {
  background-image: url("../assets/sliders-controls.png");
  background-position: 24px -3px;
  left: 10px;
}

.close_slider-btn {
  width: 25px;
  height: 25px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
