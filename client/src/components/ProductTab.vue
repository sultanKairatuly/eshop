<template>
  <div
    class="tab"
    :class="{
      active_tab: props.currentComponent === props.tab.component,
    }"
    @click="$emit('changeTab', props.tab.component)"
  >
    {{ props.tab.name }}
  </div>
</template>

<script setup lang="ts">
import { Component } from "vue";
import type { Tab } from "../../types/types";

const props = defineProps<{
  tab: Tab;
  currentComponent: Component;
}>();
</script>

<style scoped>
.tab {
  color: #008eda;
  font-size: 24px;
  padding: 25px 30px;
  cursor: pointer;
}

.active_tab {
  border: 1px solid #dcdcdc;
  background-color: #e6e6e6;
  color: #000;
  border-bottom: none;
}
</style>
