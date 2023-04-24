import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import EshopLoader from "./components/EshopLoader.vue";

const pinia = createPinia();
const app = createApp(App);

app.component("EshopLoader", EshopLoader);
app.use(router).use(pinia).mount("#app");
