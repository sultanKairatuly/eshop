<template>
  <div class="breadcrumps">
    <div
      class="breadcrump"
      v-for="(breadcrump, index) in props.breadcrumps"
      :key="breadcrump.id"
      :class="{
        active_breadcrump: breadcrump.id === currentTreeLinkId,
      }"
      @click="emit('breadcrumpClicked', breadcrump.id)"
    >
      {{ breadcrump.value }}
      <i
        class="fa-solid fa-arrow-right breadcrump_arrow"
        v-if="index !== breadcrumps.length - 1"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DropdownFilterType } from "../../types/types";

const props = defineProps<{
  currentTreeLinkId: string;
  breadcrumps: DropdownFilterType[];
}>();

const emit = defineEmits<{
  (e: "breadcrumpClicked", value: string): void;
}>();
</script>

<style scoped>
.breadcrumps {
  font-size: 25px;
  margin: 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.breadcrump {
  color: #188ed6;
  font-size: 20px;
  cursor: pointer;
}

.breadcrump:hover {
  text-decoration: underline;
}

.active_breadcrump {
  color: #9fa19f;
  cursor: default;
}

.active_breadcrump:hover {
  text-decoration: none;
}

.breadcrump_arrow {
  color: #9a9a9a;
  margin: 0 5px;
}
</style>
