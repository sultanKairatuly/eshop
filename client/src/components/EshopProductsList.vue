<template>
  <div class="products" v-if="props.products.length > 0">
    <TransitionGroup name="products" class="products_content" tag="div">
      <EshopProduct
        v-for="product in props.products"
        :key="product.id"
        :product="product"
        @productClicked="productClicked"
      />
    </TransitionGroup>
  </div>
  <div class="products" v-else>
    <EshopNotFoundProduct />
  </div>
</template>

<script setup lang="ts">
import { Product } from "../../types/types";
import EshopProduct from "./EshopProduct.vue";
import EshopNotFoundProduct from "./EshopNotFoundProduct.vue";

const props = defineProps<{
  products: Product[];
}>();

const emit = defineEmits<{
  (e: "productClicked", value: string): void;
}>();

function productClicked(model: string) {
  emit("productClicked", model);
}
</script>

<style scoped>
.products_content {
  display: flex;
  flex-wrap: wrap;
}

.products {
  width: 100%;
}

.products-move, /* apply transition to moving elements */
.products-enter-active,
.products-leave-active {
  transition: all 0.5s ease;
}

.products-enter-from,
.products-leave-to {
  opacity: 0;
}

.title {
  color: #999999;
  font-size: 30px;
  margin: 50px 0;
  text-align: center;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.products-leave-active {
  position: absolute;
}
</style>
