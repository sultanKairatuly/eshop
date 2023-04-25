<template>
  <div
    class="filter"
    v-for="(item, index) in dropdownFilter"
    :style="{
      paddingLeft: setPadding(returnNumberType(item.id)),
    }"
  >
    <div class="value">
      <i
        class="fa-solid arrow"
        :class="{
          'fa-arrow-right': !item.opened && item.children.length,
          'fa-arrow-down': item.opened && item.children.length,
          dot: !item.children.length,
        }"
        @click="item.opened = !item.opened"
      ></i>
      <div
        class="name"
        @click.stop="emit('treeLinkClicked', item)"
        :class="{
          active: activeId === item.id,
        }"
      >
        {{ item.value }}
      </div>
    </div>

    <div class="children" v-if="item.children.length && item.opened">
      <DropdownFilter
        :active-id="props.activeId"
        :dropdown-filter="item.children"
        @treeLinkClicked="emit('treeLinkClicked', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserUtilities } from "../composables/utilities";
import type { DropdownFilterType } from "../../types/types";

const { findTreeLinkAndDepth, isHasDepth } = useUserUtilities();
const props = defineProps<{
  dropdownFilter: DropdownFilterType[];
  activeId?: string;
}>();

function returnNumberType(value: string) {
  let result = findTreeLinkAndDepth(value, props.dropdownFilter);
  if (isHasDepth(result)) {
    return result.depth;
  } else {
    return result;
  }
}

const emit = defineEmits<{
  (e: "treeLinkClicked", value: DropdownFilterType): void;
}>();

function setPadding(index: number): string {
  return index * 10 + 10 * index + "px";
}
</script>

<style scoped>
.value {
  display: flex;
  margin-top: 10px;
  column-gap: 10px;
  align-items: center;
}

.arrow {
  font-size: 20px;
  cursor: pointer;
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #0089d8;
  cursor: pointer;
}

.name:hover {
  color: #000;
}
.children {
}

.active {
  text-decoration: underline;
  color: #000;
}

.space {
  margin-top: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border: 0.5px solid black;
  border-radius: 50%;
}
</style>
