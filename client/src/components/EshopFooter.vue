<template>
  <footer class="footer">
    <div class="footer_container">
      <div class="inner_left">
        <div class="inner_left-item">© 2012-2023, ТОО «Kaspi Магазин»</div>
        <div class="inner_left-item">
          Все товарные знаки, размещённые на сайте, являются товарными знаками
          правообладателя и используются на сайте исключительно в информационных
          целях
        </div>
      </div>
      <div class="inner_right">
        <img class="contact_image" src="../assets/vk-icon.svg" alt="" />
        <img class="contact_image" src="../assets/facebook-icon.svg" alt="" />
        <img class="contact_image" src="../assets/twitter-icon.svg" alt="" />
        <img class="contact_image" src="../assets/youtube-icon.svg" alt="" />
        <img
          class="contact_image"
          src="../assets/odnoklassniki-icon.svg"
          alt=""
        />
        <img class="contact_image" src="../assets/instagram-icon.svg" alt="" />
        <img class="contact_image" src="../assets/telegram-icon.svg" alt="" />
        <img class="contact_image" src="../assets/linked-in-icon.svg" alt="" />
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts"></script>
<style scoped>
.footer {
  background-color: #fbfbfb;
  padding: 30px 20px;
  border-top: 2px solid #e5e5e5;
}

.footer_container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
}

.inner_left-item {
  font-size: 15px;
}

.inner_left {
  width: 50%;
}

.inner_right {
  display: flex;
  column-gap: 10px;
}

.contact_image {
  cursor: pointer;
}
</style>
