<template>
  <div class="product_image_container">
    <div class="badges_container">
      <img class="badges" src="../assets/12-0-0.svg" />
      <img class="badges" src="../assets/bonus.svg" />
    </div>
    <img
      class="product_image"
      @click="activateSliderFlag"
      :src="getImageUrl(props.currentImage)"
    />
    <div class="zoom_tooltip">{{ $t("reviews.zoom") }}</div>
  </div>
</template>

<script setup lang="ts">
import { useUserUtilities } from "../composables/utilities";

const { getImageUrl } = useUserUtilities();

const props = defineProps<{
  currentImage: string;
}>();

const emit = defineEmits<{
  (e: "activateSliderFlag"): void;
}>();

function activateSliderFlag() {
  emit("activateSliderFlag");
}
</script>

<style scoped>
.product_image_container {
  height: 550px;
  width: 250px;
  padding: 30px;
  width: 100%;
  position: relative;
  transition: 0.2s ease-in-out;
  margin-bottom: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.product_image {
  width: 60%;
  margin: 0 auto;
  height: 75%;
  object-fit: contain;
  cursor: zoom-in;
}

.badges {
  width: 100px;
}

.badges_container {
  position: absolute;
  right: 30px;
  top: 30px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.zoom_tooltip {
  color: #9ba2ac;
  text-align: center;
  margin-top: 20px;
}
</style>
