<template>
  <div class="input_container">
    <input
      class="input"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="updateModelValue"
    />
    <i
      class="icon"
      @click="emit('iconClicked')"
      :class="{
        [props.icon]: true,
      }"
    ></i>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    type?: string;
    placeholder?: string;
    icon?: string;
  }>(),
  {
    placeholder: "Введите текст",
    type: "text",
    icon: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "iconClicked"): void;
}>();

function updateModelValue(e: Event) {
  const target: HTMLInputElement = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<style scoped>
.input_container {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  width: 400px;
  align-items: flex-end;
}
.input {
  padding: 5px 10px;
  border: 1px solid #e5e5e5;
  outline: none;
  width: 100%;
  font-size: 18px;
}

.input:focus {
  border: 1px solid #cf4e3b;
}

.icon {
  color: #aaaaaa;
  font-size: 15px;
  cursor: pointer;
}
</style>
