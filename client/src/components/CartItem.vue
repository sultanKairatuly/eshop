<template>
  <div class="cart">
    <EshopLoader :opacity="true" v-if="loading" />
    <div class="cart_item-left">
      <img
        class="product_image"
        :src="getImageUrl(props.product.images[0])"
        alt="product image"
      />
    </div>
    <div class="cart_item-right">
      <div class="product_data">
        <div class="model cart_item-right-item">
          <span style="font-weight: 500">Модель:</span>
          {{ props.product.model }}
        </div>
        <div class="price cart_item-right-item">
          <span style="font-weight: 500">{{ $t('product.price') }}:</span> {{ props.product.price }}
        </div>
      </div>
      <div class="amounts">
        <i
          class="fa-solid fa-minus"
          @click="decrementProductAmount"
          v-if="props.product.amount > 1"
        ></i>
        <i class="fa-solid fa-trash" v-else @click="removeFromCart"></i>
        <div class="amount">{{ props.product.amount }}</div>
        <i class="fa-solid fa-plus" @click="incrementProductAmount"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Product } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import { useUserStore } from "../stores/user";
import { ref } from "vue";
import EshopLoader from "./EshopLoader.vue";

const props = defineProps<{
  product: Product & { amount: number };
}>();
const userStore = useUserStore();
const { getImageUrl } = useUserUtilities();
const loading = ref<boolean>(false);

async function removeFromCart() {
  loading.value = true;
  await userStore.removeFromCart(props.product);
  loading.value = false;
}

function incrementProductAmount() {
  if (props.product.amount < 5) userStore.incrementProductAmount(props.product);
}

function decrementProductAmount() {
  userStore.decrementProductAmount(props.product);
}
</script>

<style scoped>
.cart {
  padding: 20px 0;
  border-top: 1px solid #e5e5e5;
  display: flex;
  position: relative;
}

.cart_item-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-left: 20px;
}

.cart_item-right-item {
  font-size: 20px;
  margin-top: 10px;
}
.product_image {
  width: 200px;
  height: 300px;
  object-fit: contain;
}

.amounts {
  display: flex;
  column-gap: 5px;
  align-items: center;
}

.amount {
  font-size: 20px;
}

.fa-solid {
  padding: 8px;
  background-color: #f14635;
  color: #fff;
  font-size: 17px;
  border-radius: 3px;
  cursor: pointer;
}

.fa-solid:hover {
  background-color: #da4032;
}
</style>
