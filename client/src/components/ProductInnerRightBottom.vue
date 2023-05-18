<template>
  <ProductParametersList
    :product="props.product"
    @changeProductProperty="changeProductProperty"
    @changeCurrentImage="changeCurrentImage"
  />
  <div v-if="containsInCart" class="buy_btn" @click="addToCart">
    Уже в корзине
  </div>
  <div v-else class="buy_btn" @click="addToCart">В корзину</div>
</template>

<script setup lang="ts">
import { Product } from "../../types/types";
import ProductParametersList from "./ProductParametersList.vue";
import { useUserStore } from "../stores/user";
import { computed } from "vue";
import CartEmpty from "./CartEmpty.vue";

const userStore = useUserStore();
const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: "changeProductProperty", property: keyof Product, value: unknown): void;
  (e: "changeCurrentImage", value: string): void;
}>();

const containsInCart = computed(() => {
  const idx = userStore.user.cart.findIndex((item: Product) => {
    if (
      item.model === props.product.model &&
      item.images[0] === props.product.images[0] &&
      item.price === props.product.price
    ) {
      return true;
    }
  });
  return idx !== -1;
});

function changeProductProperty(property: keyof Product, value: unknown) {
  emit("changeProductProperty", property, value);
}

function changeCurrentImage(value: string) {
  emit("changeCurrentImage", value);
}

function addToCart() {
  const amount: number | undefined = userStore.user.cart.find(
    (item: Product & { amount: number, checked: boolean }) =>
      item.price === props.product.price &&
      item.images[0] === props.product.images[0]
  )?.amount;
  if (!amount) userStore.addToCart(props.product);
  else if (amount < 5) userStore.addToCart(props.product);
}
</script>

<style scoped>
.buy_btn {
  background-color: #f14635;
  color: #fff;
  padding: 10px 50px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
}

.buy_btn:hover {
  background-color: #e04131;
}
</style>
