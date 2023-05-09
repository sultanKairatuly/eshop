<template>
  <div
    class="mini_image"
    @click="handleMiniImageClick(props.miniImage, idx)"
    :class="{
      'mini_image-active': miniImage === props.currentImage,
    }"
  >
    <img :src="getImageUrl(props.miniImage)" alt="" />
  </div>
</template>

<script setup lang="ts">
import { useUserUtilities } from "../composables/utilities";

const { getImageUrl } = useUserUtilities();
const props = defineProps<{
  currentImage: string;
  miniImage: string;
  idx: number;
}>();

const emit = defineEmits<{
  (e: "handleMiniImageClick", src: string, idx: number): void;
}>();

function handleMiniImageClick(src: string, idx: number) {
  emit("handleMiniImageClick", src, idx);
}
</script>

<style scoped>
.mini_image {
  width: 100px;
  height: 75px;
}

.mini_image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
}

.mini_image-active {
  border: 1px solid #3b87ca;
}

</style>
