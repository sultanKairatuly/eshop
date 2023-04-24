<template>
  <div class="header_bottom">
    <div class="header_bottom_content">
      <div
        class="catalog"
        :key="catalog"
        v-for="(catalog, index) in catalogs"
        @click="$router.push('/catalogs/gadgets')"
        :class="{
          'left-bordered': index === 0,
        }"
      >
        {{ catalog }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const catalogs = [
  "Телефоны и гаджеты",
  "ТВ, Аудио, Видео",
  "Компьютеры",
  "Продукты питания",
  "Красота и здоровье",
];
</script>

<style scoped>
.header_bottom {
  width: 100%;
  border-top: 2px solid #e5e5e5;
  border-bottom: 2px solid #e5e5e5;
  background-color: #fbfbfb;
}
.header_bottom_content {
  margin: 0 auto;
  width: 80%;
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  row-gap: 0;
}
.catalog {
  text-transform: uppercase;
  border-right: 1px solid #e5e5e5;
  color: #319ad8;
  font-weight: 600;
  text-align: center;
  padding: 15px;
  width: 25%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.left-bordered {
  border-left: 1px solid #e5e5e5;
}
</style>
