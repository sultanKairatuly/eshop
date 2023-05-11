<template>
  <div class="reviews_container">
    <h1 class="title">Отзывы о {{ props.product.model }}</h1>
    <ReviewSorts
      :reviews="reviews"
      :activeSortingCriteria="activerSortingCriteria"
      :sorting-criteries="sortingCriteries"
      @changeActiveSortingCriteria="changeActiveSortingCriteria"
      @updateSortedReviews="updateSortedReviews"
    />
    <div class="reviews">
      <ReviewList :reviews="sortedReviews" />
      <ReviewAdd @updateReviews="updateReviews" :product="props.product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { Product, sortingCriteriesType, Review } from "../../types/types";
import ReviewSorts from "./ReviewSorts.vue";
import ReviewList from "./ReviewList.vue";
import ReviewAdd from "./ReviewsAdd.vue";

const props = defineProps<{
  product: Product;
}>();
const reviews: Review[] = reactive(props.product.reviews);

const sortingCriteries: sortingCriteriesType[] = [
  { name: "Все", value: "all" },
  { name: "Новые", value: "new" },
  { name: "Старые", value: "old" },
  { name: "Положительные", value: "positive" },
  { name: "Отрицательные", value: "negative" },
];
const activerSortingCriteria = ref<sortingCriteriesType>(sortingCriteries[0]);
const sortingCriteria = ref<sortingCriteriesType["value"]>("all");
const sortedReviews = computed<Review[] | undefined>(() => {
  if (sortingCriteria.value === "all") {
    return [...reviews];
  } else if (sortingCriteria.value === "new") {
    const month = 2592000000;
    const actualDate = Date.now() - month;
    return reviews.filter((review) => review.createdAt - month <= actualDate);
  } else if (sortingCriteria.value === "old") {
    const month = 2592000000;
    const actualDate = Date.now() - month;
    return reviews.filter((review) => review.createdAt - month >= actualDate);
  } else if (sortingCriteria.value === "positive")
    return reviews.filter((review) => review.rate >= 4);
  else if (sortingCriteria.value === "negative")
    return reviews.filter((review) => review.rate <= 3);
  else {
    console.log("not passed");
    return [];
  }
});

function changeActiveSortingCriteria(value: sortingCriteriesType) {
  activerSortingCriteria.value = value;
}

function updateSortedReviews(value: sortingCriteriesType["value"]) {
  sortingCriteria.value = value;
}

function updateReviews(review: Review) {
  reviews.push(review);
}
</script>

<style scoped>
.reviews_container {
  min-height: 500px;
}
.title {
  font-size: 35px;
  margin-bottom: 20px;
}

.reviews {
  display: flex;
  flex-direction: column;
}
</style>
