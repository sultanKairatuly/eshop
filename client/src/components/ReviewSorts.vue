<template>
  <div class="sort_container">
    <div class="sort_title">{{ $t("reviews.show") }}</div>
    <div class="sorts">
      <div
        class="sort_item"
        v-for="sortingCriteria in sortingCriteries"
        :key="sortingCriteria.value"
        @click="$emit('changeActiveSortingCriteria', sortingCriteria)"
        :class="{
          'sort_item-active':
            props.activeSortingCriteria.name === sortingCriteria.name,
        }"
      >
        {{ sortingCriteria.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { Review, sortingCriteriesType } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";

const { assertUnreachable } = useUserUtilities();
const props = defineProps<{
  activeSortingCriteria: sortingCriteriesType;
  sortingCriteries: sortingCriteriesType[];
  reviews: Review[];
}>();

const emit = defineEmits<{
  (e: "updateSortedReviews", value: sortingCriteriesType["value"]): void;
  (e: "changeActiveSortingCriteria", value: sortingCriteriesType): void;
}>();

watch(
  () => props.activeSortingCriteria,
  (nv) => {
    switch (nv.value) {
      case "all":
        emit("updateSortedReviews", "all");
        break;
      case "old":
        emit("updateSortedReviews", "old");
        break;
      case "new":
        emit("updateSortedReviews", "new");
        break;
      case "positive":
        {
          emit("updateSortedReviews", "positive");
        }
        break;
      case "negative":
        {
          emit("updateSortedReviews", "negative");
        }
        break;
      default:
        assertUnreachable(nv.value);
        break;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
.sort_container {
  padding: 20px 0;
  border: 1px solid #e5e5e5;
  border-right: none;
  border-left: none;
}
.sort_title {
  color: #9e9e9e;
  font-weight: 400;
  display: inline-block;
  margin-right: 20px;
}
.sorts {
  display: inline-flex;
  column-gap: 10px;
}
.sort_item {
  font-size: 20px;
  cursor: pointer;
  padding: 10px 15px;
  border: 1px solid #e5e5e5;
}

.sort_item:hover {
  background-color: #ebf6fb;
  border: 1px solid blue;
}

.sort_item-active {
  background-color: #ebf6fb;
  border: 1px solid blue;
}
</style>
