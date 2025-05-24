import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./assets/styles/index.scss"; // 全局样式
import { setupDirectives } from "./utils/directive";

const app = createApp(App);

// 注册ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 注册自定义指令
setupDirectives(app);

app
  .use(pinia)
  .use(router)
  .use(ElementPlus, { size: "default", zIndex: 3000 })
  .mount("#app");
