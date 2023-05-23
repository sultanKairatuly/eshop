<template>
  <footer class="footer">
    <div class="products_amount footer-item">
      <span style="font-weight: 500">{{ $t('cart.goods') }}: </span> {{ productsAmount }}
    </div>
    <div class="products_sum footer-item">
      <span style="font-weight: 500">{{ $t('cart.sum') }}: </span> {{ productsSum }}
    </div>
    <EshopButton @click="order">{{ $t('cart.order') }}</EshopButton>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "../stores/user";
import { Product } from "../../types/types";
import { useUserUtilities } from "../composables/utilities";
import EshopButton from "../UIcomponents/EshopButton.vue";

const { getInstallment } = useUserUtilities();
const userStore = useUserStore();

const cart = computed(() => userStore.user.cart);
const productsAmount = computed(() =>
  cart.value.reduce(
    (acc: number, item: Product & { amount: number }) => (acc += item.amount),
    0
  )
);
const productsSum = computed(() => {
  const sumAsNums = cart.value.map((product: Product & { amount: number }) => {
    return parseInt(product.price.replace(/\s/g, "")) * product.amount;
  });
  const totalSum = sumAsNums.reduce((acc: number, i: number) => (acc += i), 0);
  return getInstallment(totalSum.toString());
});

function order() {}
</script>

<style scoped>
.footer {
  padding: 35px 10px;
  border: 1px solid #ebebeb;
}
.products_amount {
}
.footer-item {
  font-size: 22px;
  margin-top: 20px;
}
.products_sum {
  margin-bottom: 20px;
}
</style>
