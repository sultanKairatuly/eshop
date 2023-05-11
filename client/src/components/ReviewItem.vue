<template>
  <div class="review">
    <div class="inner_left">
      <div class="rate">
        <div
          class="rate_item rate-positive"
          :style="{
            width: `${props.review.rate * 21}px`,
            'background-position': `${-107 + props.review.rate * 21}px -51px`,
          }"
        ></div>
        <div
          class="rate_item rate-negative"
          :style="{
            width: `${(5 - props.review.rate) * 21}px`,
            'background-position': `${
              -107 + (5 - props.review.rate) * 21
            }px -29px`,
          }"
        ></div>
      </div>

      <div class="author">{{ props.review.author }}</div>
      <div class="date">
        {{ new Date(props.review.createdAt).toLocaleDateString() }}
      </div>
    </div>
    <div class="inner_right">
      <div class="message">
        <span style="font-weight: 500">Комментарий: </span>
        {{ props.review.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Review } from "../../types/types";

const props = defineProps<{
  review: Review;
}>();
</script>

<style scoped>
.review {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 0;
}

.inner_left {
  width: 25%;
}

.inner_right {
  width: 75%;
}

.rate {
  display: flex;
}
.rate_item {
  height: 25px;
  background-image: url(../assets/rates.svg);
  background-repeat: no-repeat;
  background-size: 110px;
}

.author {
  font-size: 20px;
  font-weight: 400;
  margin: 5px 0;
}
.date {
  color: #cccccc;
  font-size: 18px;
}
</style>
