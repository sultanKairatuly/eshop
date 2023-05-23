<template>
  <div class="container">
    <EshopLoader v-if="loading" />
    <div class="locked" v-if="!userStore.user.email">
      <i class="fa-solid fa-lock lock"></i>
      <div class="lock_text">{{ $t("reviews.authAlert") }}</div>
    </div>
    <label class="label">{{ $t("reviews.comment") }}</label>
    <input
      :placeholder="$t('reviews.reviewPlaceholder')"
      type="text"
      v-model="reviewMessage"
      class="message_input"
    />
    <label class="label">{{ $t("reviews.rating") }}</label>
    <select class="select" v-model="reviewRate">
      <option class="option" v-for="item in 5" :key="item" :value="item">
        {{ item }}
      </option>
    </select>
    <EshopButton class="btn" @click="postReview">{{
      $t("reviews.add")
    }}</EshopButton>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import type { Ref } from "vue";
import { Review } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "../stores/user";
import EshopButton from "../UIcomponents/EshopButton.vue";
import EshopLoader from "./EshopLoader.vue";

const userStore = useUserStore();

const loading: Ref<boolean> = inject("reviewLoading") as Ref<boolean>;
const emit = defineEmits<{
  (e: "updateReviews", value: Review): void;
}>();

const reviewMessage = ref<string>("");
const reviewRate = ref<string>("5");

function postReview() {
  const review: Review = {
    message: reviewMessage.value,
    author: userStore.user.displayName,
    id: uuidv4(),
    rate: +reviewRate.value,
    createdAt: Date.now(),
  };

  emit("updateReviews", review);
  reviewMessage.value = "";
  reviewRate.value = "5";
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 40px 0;
  padding: 20px;
  position: relative;
}
.message_input {
  outline: none;
  padding: 20px 15px;
  border: none;
  border-bottom: 1px solid #e5e5e5;
  font-size: 20px;
}

.message_input:focus {
  border-bottom: 1px solid #f14635;
}

.select {
  outline: none;
  border: 1px solid #e5e5e5;
  padding: 10px;
  font-size: 18px;
  margin-bottom: 30px;
}

.label {
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 18px;
}

.btn {
  width: fit-content;
}

.locked {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-content: center;
  align-items: center;
  background-color: #0000009d;
  user-select: none;
  z-index: 60;
}

.lock {
  font-size: 50px;
  color: #fff;
}

.lock_text {
  color: #fff;
  margin-top: 15px;
  font-size: 30px;
}
</style>
