<template>
  <div v-if="props.reviews.length > 0">
    <ReviewItem v-for="review in props.reviews" :review="review" />
  </div>
  <NoMessage v-else>{{ $t("reviews.none") }}</NoMessage>
</template>

<script setup lang="ts">
import { Review } from "../../types/types";
import ReviewItem from "./ReviewItem.vue";

const props = withDefaults(
  defineProps<{
    reviews: Review[];
  }>(),
  {
    reviews: () => [] as Review[],
  }
);
</script>

<style scoped></style>
