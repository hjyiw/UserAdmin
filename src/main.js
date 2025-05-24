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

// 添加全局错误处理器来忽略ResizeObserver警告
const originalConsoleError = window.console.error;
window.console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("ResizeObserver")
  ) {
    // 忽略ResizeObserver相关警告
    return;
  }
  originalConsoleError.apply(console, args);
};
