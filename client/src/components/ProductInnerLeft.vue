<template>
  <div class="product_left">
    <ProductDetailsMainImage
      :current-image="props.currentImage"
      @activateSliderFlag="activateSliderFlag"
    />
    <ProductMiniImageList :current-image="currentImage" :images="props.images" @handleMiniImageClick="handleMiniImageClick" />
  </div>
</template>

<script setup lang="ts">
import ProductDetailsMainImage from "./ProductDetailsMainImage.vue";
import ProductMiniImageList from "./ProductMiniImagesList.vue";

const props = defineProps<{
  images: string[];
  currentImage: string;
}>();

const emit = defineEmits<{
  (e: "handleMiniImageClick", src: string, idx: number): void;
  (e: "activateSliderFlag"): void;
}>();

function handleMiniImageClick(src: string, idx: number) {
  emit("handleMiniImageClick", src, idx);
}

function activateSliderFlag() {
  emit("activateSliderFlag");
}
</script>

<style scoped>
.product_left {
  width: 75%;
  border-right: 1px solid #e5e5e5;
}


</style>
