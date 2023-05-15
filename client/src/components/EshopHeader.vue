<template>
  <div class="header">
    <EshopHeaderTop />
    <EshopHeaderMiddle
      :model-value="productSearch"
      @update:model-value="(event) => (productSearch = event)"
      @searchProduct="searchProduct"
    />
    <EshopHeaderBottom />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import EshopHeaderTop from "./EshopHeaderTop.vue";
import EshopHeaderMiddle from "./EshopHeaderMiddle.vue";
import EshopHeaderBottom from "./EshopHeaderBottom.vue";

onUnmounted(() => {
  document.removeEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      emit("findProducts", productSearch.value);
    }
  });
});

const emit = defineEmits<{
  (e: "findProducts", value: string): void;
  (e: "clearSearch"): void;
}>();
const productSearch = ref<string>("");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    emit("findProducts", productSearch.value);
  }
});

watch(productSearch, (nv) => {
  if (nv.length === 0) {
    emit("clearSearch");
  }
});

async function searchProduct() {
  emit("findProducts", productSearch.value);
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  row-gap: 0;
}
</style>
