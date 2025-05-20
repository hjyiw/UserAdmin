// store入口文件
import { createPinia } from "pinia";

// 导出store模块
export { useUserStore } from "./modules/user";
export { usePermissionStore } from "./modules/permission";

// 创建pinia实例
const pinia = createPinia();

export default pinia;
