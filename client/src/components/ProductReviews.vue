<template>
  <div class="reviews_container">
    <h1 class="title" v-if="userStore.activeLocale === 'ru'">
      {{ $t("reviews.title") }} {{ props.product.model }}
    </h1>
    <h1 v-else class="title">
      {{ props.product.model }} {{ $t("reviews.title") }}
    </h1>
    <ReviewSorts
      :reviews="props.product.reviews"
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
import { ref, computed } from "vue";
import { Product, sortingCriteriesType, Review } from "../../types/types";
import ReviewSorts from "./ReviewSorts.vue";
import ReviewList from "./ReviewList.vue";
import ReviewAdd from "./ReviewsAdd.vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const { t } = useI18n();
const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: "updateReviews", value: Review): void;
}>();

const sortingCriteries = computed<sortingCriteriesType[]>(() => [
  { name: t("reviews.all"), value: "all" },
  { name: t("reviews.new"), value: "new" },
  { name: t("reviews.old"), value: "old" },
  { name: t("reviews.positive"), value: "positive" },
  { name: t("reviews.negative"), value: "negative" },
]);
const activerSortingCriteria = ref<sortingCriteriesType>(
  sortingCriteries.value[0]
);
const sortingCriteria = ref<sortingCriteriesType["value"]>("all");
const sortedReviews = computed<Review[] | undefined>(() => {
  if (sortingCriteria.value === "all") {
    return [...props.product.reviews];
  } else if (sortingCriteria.value === "new") {
    const month = 2592000000;
    const actualDate = Date.now() - month;
    return props.product.reviews.filter(
      (review: Review) => review.createdAt - month <= actualDate
    );
  } else if (sortingCriteria.value === "old") {
    const month = 2592000000;
    const actualDate = Date.now() - month;
    return props.product.reviews.filter(
      (review: Review) => review.createdAt - month >= actualDate
    );
  } else if (sortingCriteria.value === "positive")
    return props.product.reviews.filter((review: Review) => review.rate >= 4);
  else if (sortingCriteria.value === "negative")
    return props.product.reviews.filter((review: Review) => review.rate <= 3);
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
  // reviews.push(review);
  emit("updateReviews", review);
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
