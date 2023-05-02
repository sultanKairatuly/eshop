<template>
  <div class="root">
    <div class="title">К сожалению, мы ничего не нашли по Вашему запросу.</div>
    <div class="subtitle">
      Попробуйте изменить поисковый запрос и проверить, нет ли опечаток.
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.root {
  display: flex;
  justify-content: flex-center;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 20px;
  width: 100%;
}
.title {
  text-align: left;
  font-size: 35px;
}

.subtitle {
  background-color: gold;
  font-size: 20px;
  padding: 5px;
}
</style>
