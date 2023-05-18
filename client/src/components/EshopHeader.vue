<template>
  <div class="header">
    <EshopHeaderTop />
    <EshopHeaderMiddle
      :model-value="productSearch"
      :history="history"
      :isHistory="isHistory"
      @update:model-value="(event) => (productSearch = event)"
      @searchProduct="searchProduct"
      @clearHistory="clearHistory"
      @goToHistory="goToHistory"
      @changeHistoryFlag="changeHistoryFlag"
    />
    <EshopHeaderBottom />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, reactive } from "vue";
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
const history: string[] = reactive(
  JSON.parse(sessionStorage.getItem("history") as string) || []
);
const isHistory = ref<boolean>(false);

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    emit("findProducts", productSearch.value);
    history.push(productSearch.value);
    sessionStorage.setItem("history", JSON.stringify(history));
  }
});

watch(productSearch, (nv) => {
  if (nv.length === 0) {
    emit("clearSearch");
  }
});

async function searchProduct() {
  emit("findProducts", productSearch.value);
  history.push(productSearch.value);
  sessionStorage.setItem("history", JSON.stringify(history));
  isHistory.value = false;
}

function clearHistory() {
  history.splice(0);
  sessionStorage.setItem("history", JSON.stringify(history));
  isHistory.value = false;
}

function goToHistory(value: string) {
  const result = history.find((item) => item === value);
  if (result) productSearch.value = result;
  emit("findProducts", productSearch.value);
  isHistory.value = false;
}

function changeHistoryFlag(value: boolean) {
  isHistory.value = value;
}

const windowClickCallback = (e: Event) => {
  if (
    e.target instanceof HTMLElement &&
    !e.target.classList.contains("search_input")
  ) {
    isHistory.value = false;
  }
};

window.addEventListener("click", windowClickCallback);
window.removeEventListener("click", windowClickCallback);
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  row-gap: 0;
}
</style>
