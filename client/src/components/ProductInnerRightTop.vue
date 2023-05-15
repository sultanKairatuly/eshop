<template>
  <div class="product_model">{{ props.product.model }}</div>
  <div class="separator"></div>
  <div class="product_price">
    <div class="product_price_item">
      <h4 class="price_title">Цена</h4>
      <div class="price_value">
        {{ props.product.price }}
      </div>
    </div>

    <div class="product_price_item">
      <h4 class="price_title">В рассрочку</h4>
      <div class="installment_value">
        {{ getInstallment(props?.product) }}
      </div>
      <div class="price-info">x 12</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserUtilities } from "../composables/utilities";
import { Product } from "../../types/types";

const { getInstallment } = useUserUtilities();
const props = defineProps<{
  product: Product;
}>();
</script>

<style scoped>
.product_model {
  font-size: 30px;
}
.separator {
  height: 1px;
  margin: 30px 0;
  background-color: #e5e5e5;
}
.product_price {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.product_price_item:first-child {
  padding-right: 12px;
  border-right: 1px solid #e5e5e5;
}

.product_price_item:last-child {
  padding-left: 12px;
}
.price_title {
  color: #9fa19f;
  margin-bottom: 10px;
  font-size: 22px;
}
.price_value {
  font-weight: 500;
  font-size: 23px;
}

.installment_value {
  padding: 3px;
  width: fit-content;
  background-color: #ffd300;
  font-weight: 500;
  font-size: 19px;
  display: inline-block;
}

.price-info {
  color: #999999;
  margin-left: 10px;
  display: inline-block;
  font-size: 18px;
}
</style>
