<template>
  <div class="cart_items">
    <CartItem
      :data-id="`${product.price}|${product.images[0]}`"
      ref="cartItem"
      :product="product"
      :key="product.id"
      v-for="product in user.cart"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user";
import CartItem from "./CartItem.vue";
import type { ComponentPublicInstance } from "vue";
import { Product } from "../../types/types";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const cartItem = ref<ComponentPublicInstance[] | null>(null);
const callback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const [price, image] = (entry.target as HTMLElement).dataset.id?.split(
        "|"
      ) as string[];
      userStore.user.cart.forEach(
        (product: Product & { amount: number; checked: boolean }, idx: number) => {
          if (product.price === price && product.images[0] === image) {
            userStore.user.cart[idx] = {
              ...product,
              checked: true,
            };
          }
        }
      );
      observer.unobserve(entry.target);
    }
  });
};
const observer = new IntersectionObserver(callback, {
  threshold: 1.0,
});

onMounted(() => {
  cartItem.value?.forEach((element) => {
    observer.observe(element.$el);
  });
});
</script>

<style scoped>
.cart_items {
  display: flex;
  flex-direction: column;
}
</style>
