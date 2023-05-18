<template>
  <div class="header_middle">
    <div class="header_middle_content">
      <div class="search_bar">
        <div class="left_side" @click="$router.push('/shop')">Магазин</div>
        <div class="input_container">
          <input
            type="text"
            :value="props.modelValue"
            @input="updateModelValue"
            class="search_input"
            placeholder="Поиск товара"
            @click="changeHistoryFlag(true)"
          />
          <div class="history" @click.stop v-if="props.isHistory">
            <div class="history_header">
              <div class="history_title">История поиска</div>
              <button class="clear-history-btn" @click="clearHistory">
                Очистить
              </button>
            </div>

            <div
              class="history_item"
              v-for="(item, idx) in history"
              :key="idx + item"
              @click="goToHistory(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <div class="search_button" @click="searchProduct">
          <img
            class="search_icon"
            src="../assets/apple/small-search.png"
            alt="search"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";

onUnmounted(() => {});
const props = withDefaults(
  defineProps<{
    modelValue: string;
    history: string[];
    isHistory: boolean;
  }>(),
  {
    isHistory: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "searchProduct"): void;
  (e: "clearHistory"): void;
  (e: "goToHistory", value: string): void;
  (e: "changeHistoryFlag", value: boolean): void;
}>();

function updateModelValue(event: Event) {
  const target: HTMLInputElement = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

function searchProduct() {
  emit("searchProduct");
}

function clearHistory() {
  emit("clearHistory");
}

function goToHistory(history: string) {
  emit("goToHistory", history);
}

function changeHistoryFlag(value: boolean) {
  emit("changeHistoryFlag", value);
}
</script>

<style scoped>
.header_middle {
  width: 100%;
  background-color: #fbfbfb;
  padding: 30px 0;
}

.header_middle_content {
  display: flex;
  margin: 0 auto;
  width: 80%;
  max-width: 900px;
  text-align: center;
  justify-content: space-between;
}

.search_bar {
  width: 100%;
  display: flex;
}
.left_side {
  color: #4f89d0;
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
}

.input_container {
  width: 100%;
  position: relative;
}
.search_input {
  outline: none;
  padding: 0 10px;
  background-color: #fbfbfb;
  border: 1px solid #e5e5e5;
  width: 100%;
  height: 100%;
  font-size: 20px;
}

.search_input:focus {
  border: 1px solid #0089d0;
}

.search_input::placeholder {
  color: #d2d4d0;
  font-weight: 500;
}

.search_input:hover {
  border: 1px solid #0089d0;
}
.search_button {
  font-size: 20px;
  padding: 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0089d0;
  cursor: pointer;
}
.search_icon {
  width: 20px;
  height: 20px;
}

.history {
  padding: 5px 0;
  background-color: #fff;
  position: absolute;
  top: 40px;
  width: 100%;
  border: 1px solid #e5e5e5;
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 200;
}

.history_item {
  padding: 10px 25px;
  cursor: pointer;
  text-align: left;
  font-size: 20px;
}

.history_item:hover {
  background-color: #41c0ff33;
}

.history_title {
  font-weight: 500;
  font-size: 20px;
  text-align: left;
}
.history_header {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin: 20px 0;
  align-items: center;
}

.clear-history-btn {
  font-size: 18px;
  color: #5289d3;
  cursor: pointer;
  border: none;
  background-color: #fff;
}

.clear-history-btn:hover {
  text-decoration: underline;
}
</style>
