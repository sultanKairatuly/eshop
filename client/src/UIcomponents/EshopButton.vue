<template>
  <button class="btn"><slot></slot></button>
</template>

<script setup lang="ts"></script>

<style scoped>
.btn {
  background-color: #f14635;
  color: #fff;
  font-size: 18px;
  border: none;
  cursor: pointer;
  padding: 15px 30px;
}

.btn:hover {
  background-color: #da4134;
}
</style>
