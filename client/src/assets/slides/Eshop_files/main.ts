import { createApp } from "/node_modules/.vite/deps/vue.js?v=11c9f195";
import App from "/src/App.vue?t=1684337005015";
import router from "/src/router/index.ts?t=1684337005015";
import { createPinia } from "/node_modules/.vite/deps/pinia.js?v=276506a7";
import EshopLoader from "/src/components/EshopLoader.vue";
import NoMessage from "/src/UIcomponents/NoMessage.vue";
const pinia = createPinia();
const app = createApp(App);
app.component("EshopLoader", EshopLoader);
app.component("NoMessage", NoMessage);
app.use(router).use(pinia).mount("#app");

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQXBwIH0gZnJvbSBcInZ1ZVwiO1xyXG5pbXBvcnQgQXBwIGZyb20gXCIuL0FwcC52dWVcIjtcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi9yb3V0ZXIvaW5kZXhcIjtcclxuaW1wb3J0IHsgY3JlYXRlUGluaWEgfSBmcm9tIFwicGluaWFcIjtcclxuaW1wb3J0IEVzaG9wTG9hZGVyIGZyb20gXCIuL2NvbXBvbmVudHMvRXNob3BMb2FkZXIudnVlXCI7XHJcbmltcG9ydCBOb01lc3NhZ2UgZnJvbSAnLi9VSWNvbXBvbmVudHMvTm9NZXNzYWdlLnZ1ZSdcclxuXHJcbmNvbnN0IHBpbmlhID0gY3JlYXRlUGluaWEoKTtcclxuY29uc3QgYXBwID0gY3JlYXRlQXBwKEFwcCk7XHJcblxyXG5hcHAuY29tcG9uZW50KFwiRXNob3BMb2FkZXJcIiwgRXNob3BMb2FkZXIpO1xyXG5hcHAuY29tcG9uZW50KFwiTm9NZXNzYWdlXCIsIE5vTWVzc2FnZSk7XHJcbmFwcC51c2Uocm91dGVyKS51c2UocGluaWEpLm1vdW50KFwiI2FwcFwiKTtcclxuIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLGlCQUFpQjtBQUMxQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsbUJBQW1CO0FBQzVCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sZUFBZTtBQUV0QixNQUFNLFFBQVEsWUFBWTtBQUMxQixNQUFNLE1BQU0sVUFBVSxHQUFHO0FBRXpCLElBQUksVUFBVSxlQUFlLFdBQVc7QUFDeEMsSUFBSSxVQUFVLGFBQWEsU0FBUztBQUNwQyxJQUFJLElBQUksTUFBTSxFQUFFLElBQUksS0FBSyxFQUFFLE1BQU0sTUFBTTsiLCJuYW1lcyI6W119