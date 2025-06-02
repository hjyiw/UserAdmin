// 角色管理相关API
import request from "@/utils/request";

/**
 * 获取角色列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回角色列表数据
 */
export function listRoles(params) {
  return new Promise((resolve) => {
    request
      .get("/role/list", {
        params,
      })
      .then((res) => {
        // 确保返回的是数组格式的角色列表
        if (res.data && res.data.list) {
          // 如果返回的是分页格式，取出list
          resolve(res);
        } else if (Array.isArray(res.data)) {
          // 如果直接返回的是数组，保持不变
          resolve(res);
        } else {
          // 如果是其他格式，转换为数组格式
          resolve({
            ...res,
            data: Array.isArray(res.data) ? res.data : [],
          });
        }
      });
  });
}

/**
 * 获取角色详情
 * @param {number} roleId - 角色ID
 * @returns {Promise} - 返回角色详情
 */
export function getRoleInfo(roleId) {
  return new Promise((resolve, reject) => {
    request
      .get(`/role/${roleId}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 创建角色
 * @param {Object} roleData - 角色数据
 * @returns {Promise} - 返回创建结果
 */
export function createRole(roleData) {
  return new Promise((resolve, reject) => {
    request
      .post("/role", roleData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 更新角色信息
 * @param {Object} roleData - 角色数据
 * @returns {Promise} - 返回更新结果
 */
export function updateRole(roleData) {
  return new Promise((resolve, reject) => {
    request
      .put(`/role/${roleData.roleId}`, roleData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 删除角色
 * @param {number} roleId - 角色ID
 * @returns {Promise} - 返回删除结果
 */
export function deleteRole(roleId) {
  return new Promise((resolve, reject) => {
    request
      .delete(`/role/${roleId}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 更新角色状态
 * @param {number} roleId - 角色ID
 * @param {string} status - 角色状态
 * @returns {Promise} - 返回操作结果
 */
export function changeRoleStatus(roleId, status) {
  return new Promise((resolve, reject) => {
    request
      .put(`/role/${roleId}/status`, { status })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 获取菜单列表
 * @returns {Promise} - 返回菜单列表
 */
export function listMenus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { menuId: 1, menuName: "系统管理", parentId: 0 },
          { menuId: 2, menuName: "用户管理", parentId: 1 },
          { menuId: 3, menuName: "角色管理", parentId: 1 },
          { menuId: 4, menuName: "部门管理", parentId: 1 },
        ],
        msg: "获取成功",
      });
    }, 300);
  });
}

/**
 * 获取所有权限列表
 * @returns {Promise} - 返回权限列表
 */
export function listPermissions() {
  return request.get("/perm/list");
}

/**
 * 获取角色的权限
 * @param {number} roleId - 角色ID
 * @returns {Promise} - 返回角色的权限
 */
export function getRolePermissions(roleId) {
  return request.get("/perm", { roleId });
}

/**
 * 更新角色权限
 * @param {number} roleId - 角色ID
 * @param {string[]} permissions - 权限标识数组
 * @returns {Promise} - 返回操作结果
 */
export function updateRolePermissions(roleId, permissions) {
  return request.put("/perm", { roleId, permissions });
}
