/**
 * 自定义指令
 */
import permissionDirectives from "../directives/permission";

/**
 * 注册所有自定义指令
 * @param {Object} app - Vue应用实例
 */
export function setupDirectives(app) {
  // 注册权限指令
  app.directive("permission", permissionDirectives.permission);
  app.directive("any-permission", permissionDirectives.anyPermission);
  app.directive("all-permissions", permissionDirectives.allPermissions);
  app.directive("permission-disabled", permissionDirectives.permissionDisabled);
}
