<template>
  <div class="mini_images">
    <ProductMiniImage
      v-for="(miniImage, idx) in props.images"
      :key="miniImage"
      :mini-image="miniImage"
      :idx="idx"
      :current-image="props.currentImage"
      @handleMiniImageClick="handleMiniImageClick"
    />
  </div>
</template>

<script setup lang="ts">
import ProductMiniImage from "./ProductMiniImage.vue";

const props = defineProps<{
  images: string[];
  currentImage: string;
}>();

const emit = defineEmits<{
  (e: "handleMiniImageClick", src: string, idx: number): void;
}>();

function handleMiniImageClick(src: string, idx: number) {
  emit("handleMiniImageClick", src, idx);
}
</script>

<style scoped>
.mini_images {
  display: flex;
  column-gap: 5px;
  justify-content: center;
  padding-bottom: 20px;
}
</style>
