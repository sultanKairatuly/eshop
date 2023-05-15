<template>
  <div class="cart_container">
    <div class="cart_content">
      <CartHeader :cartItems="userStore.user.cart.length" />
    </div>
    <div class="cart_items">
      <div class="cart_item" v-for="item in userStore.user.cart">
        <div class="cart_item-left"></div>
        <div class="cart_item-right">{{ item.model }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CartHeader from "../components/CartHeader.vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
</script>

<style scoped>
.cart_container {
  min-height: 100vh;
}

.cart_content {
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
}
</style>
