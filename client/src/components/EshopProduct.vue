<template>
  <div class="product">
    <div class="extra_info">
      <img
        class="extra_info_item"
        src="../assets/12-0-0.svg"
        alt="installment image"
      />
      <img
        class="extra_info_item"
        src="../assets/bonus.svg"
        alt="bonuses image"
      />
    </div>

    <img
      class="product_image"
      :src="getImageUrl(props.product.images[0])"
      alt="product image"
      @click="
        emit('productClicked', {
          model: props.product.model,
          category: props.product.category,
        })
      "
    />
    <div class="image_separator"></div>
    <div
      class="product_name"
      @click="
        emit('productClicked', {
          model: props.product.model,
          category: props.product.category,
        })
      "
    >
      {{ props.product.model }}
    </div>
    <div class="bills">
      <div class="price">
        <div class="price_title">{{ $t("product.price") }}</div>
        <div class="price_value">
          {{ props.product.price }}
        </div>
      </div>
      <div class="installment">
        <div class="installment_title">{{ $t("product.installment") }}</div>
        <div class="installment_value">
          {{ getInstallment(props.product) }}
        </div>
        <span class="mode">x12</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
const { getImageUrl, getInstallment } = useUserUtilities();

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: "productClicked", value: { model: string; category: string }): void;
}>();
</script>

<style scoped>
.product {
  position: relative;
  width: 33.333%;
  padding: 15px;
  border: 1px solid #e5e5e5;
  background: #fff;
  padding: 21px 14px;
  height: 450px;
}
.product_image {
  width: 100%;
  height: 210px;
  cursor: pointer;
  margin: 0 auto;
  object-fit: contain;
}
.product_name {
  color: #0098de;
  text-align: center;
  cursor: pointer;
  margin: 15px 0;
  font-size: 20px;
}

.product_name:hover {
  text-decoration: underline;
}

.image_separator {
  height: 1px;
  background-color: #e5e5e5;
  margin: 20px auto;
  width: 100%;
}

.bills {
  display: flex;
  justify-content: center;
}
.price {
  border-right: 1px solid #e5e5e5;
  padding-right: 15px;
}
.price_title {
  color: #999999;
  font-size: 19px;
}
.price_value {
  font-size: 21px;
  margin-top: 15px;
  font-weight: 500;
}
.installment {
  margin-left: 15px;
}
.installment_title {
  color: #999999;
  font-size: 19px;
}
.installment_value {
  font-size: 18px;
  font-weight: 500;
  background-color: #ffd300;
  display: inline-block;
  margin-right: 5px;
  margin-top: 15px;
}
.mode {
  color: #999999;
  font-size: 16px;
}

.extra_info {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  position: absolute;
  top: 15px;
  left: 10px;
}

.extra_info_item {
  width: 85px;
  height: 45px;
  object-fit: cover;
}
</style>
