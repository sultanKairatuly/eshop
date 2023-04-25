<template>
  <div class="header_middle">
    <div class="header_middle_content">
      <div class="search_bar">
        <div class="left_side" @click="$router.push('/shop')">Магазин</div>
        <input
          type="text"
          :value="props.modelValue"
          @input="updateModelValue"
          class="search_input"
          placeholder="Поиск товара"
        />
        <div class="search_button">
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
const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function updateModelValue(event: Event) {
  const target: HTMLInputElement = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
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
  max-width: 1200px;
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
.search_input {
  width: 100%;
  outline: none;
  padding: 0 10px;
  background-color: #fbfbfb;
  border: 1px solid #e5e5e5;
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
</style>
