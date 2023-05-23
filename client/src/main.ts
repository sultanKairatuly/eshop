import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import EshopLoader from "./components/EshopLoader.vue";
import NoMessage from './UIcomponents/NoMessage.vue'
import { createI18n } from 'vue-i18n'
import messages from '../translation.json'
import { useUserStore } from "./stores/user";


const pinia = createPinia();
const app = createApp(App);

app.component("EshopLoader", EshopLoader);
app.component("NoMessage", NoMessage);
app.use(router).use(pinia)

const userStore = useUserStore()
const i18n = createI18n({
    locale: userStore.activeLocale,
    messages,
    legacy: false
})
app.use(i18n).mount("#app");
