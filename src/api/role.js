// 角色管理相关API
import request from "@/utils/request";
// 模拟角色列表数据
const mockRoleData = [
  {
    roleId: 1,
    roleName: "管理员",
    roleKey: "admin",
    roleSort: 1,
    status: "0", // 0-正常，1-停用
    createTime: "2023-01-01 12:00:00",
    remark: "超级管理员",
    menuIds: [1, 2, 3, 4],
    permissions: ["*:*:*"], // 所有权限
  },
  {
    roleId: 2,
    roleName: "测试人员",
    roleKey: "test",
    roleSort: 2,
    status: "0",
    createTime: "2023-01-02 12:00:00",
    remark: "测试人员",
    menuIds: [1, 3, 4],
    permissions: ["system:test:list", "system:test:query"],
  },
  {
    roleId: 3,
    roleName: "开发人员",
    roleKey: "dev",
    roleSort: 3,
    status: "0",
    createTime: "2023-01-03 12:00:00",
    remark: "开发人员",
    menuIds: [1, 2],
    permissions: [
      "system:dev:list",
      "system:dev:query",
      "system:dev:add",
      "system:dev:edit",
    ],
  },
  {
    roleId: 4,
    roleName: "项目经理",
    roleKey: "pm",
    roleSort: 4,
    status: "0",
    createTime: "2023-01-04 12:00:00",
    remark: "项目经理",
    menuIds: [2],
    permissions: [
      "system:pm:list",
      "system:pm:query",
      "system:pm:add",
      "system:pm:edit",
      "system:pm:remove",
    ],
  },
  {
    roleId: 5,
    roleName: "市场人员",
    roleKey: "market",
    roleSort: 5,
    status: "0",
    createTime: "2023-01-05 12:00:00",
    remark: "市场人员",
    menuIds: [1, 2, 3],
    permissions: ["system:market:list", "system:market:query"],
  },
];

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
    setTimeout(() => {
      const role = mockRoleData.find((item) => item.roleId === roleId);
      if (role) {
        resolve({
          code: 200,
          data: role,
          msg: "获取成功",
        });
      } else {
        reject({
          code: 404,
          message: "角色不存在",
        });
      }
    }, 300);
  });
}

/**
 * 创建角色
 * @param {Object} roleData - 角色数据
 * @returns {Promise} - 返回创建结果
 */
export function createRole(roleData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟创建角色，生成新的角色ID
      const newRoleId = mockRoleData.length + 1;

      // 构建新角色对象
      const newRole = {
        roleId: newRoleId,
        roleName: roleData.roleName,
        roleKey: roleData.roleKey,
        roleSort: roleData.roleSort || newRoleId,
        status: roleData.status || "0",
        createTime: new Date().toLocaleString(),
        remark: roleData.remark || "",
        menuIds: roleData.menuIds || [],
        permissions: roleData.permissions || [],
      };

      // 将新角色添加到模拟数据中
      mockRoleData.push(newRole);

      resolve({
        code: 200,
        data: newRole,
        msg: "创建成功",
      });
    }, 500);
  });
}

/**
 * 更新角色信息
 * @param {Object} roleData - 角色数据
 * @returns {Promise} - 返回更新结果
 */
export function updateRole(roleData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRoleData.findIndex(
        (item) => item.roleId === roleData.roleId
      );

      if (index !== -1) {
        // 更新角色信息
        mockRoleData[index] = {
          ...mockRoleData[index],
          ...roleData,
        };

        resolve({
          code: 200,
          data: mockRoleData[index],
          msg: "更新成功",
        });
      } else {
        reject({
          code: 404,
          message: "角色不存在",
        });
      }
    }, 500);
  });
}

/**
 * 删除角色
 * @param {number} roleId - 角色ID
 * @returns {Promise} - 返回删除结果
 */
export function deleteRole(roleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRoleData.findIndex((item) => item.roleId === roleId);

      if (index !== -1) {
        // 检查是否为管理员角色
        if (mockRoleData[index].roleKey === "admin") {
          reject({
            code: 403,
            message: "管理员角色不能删除",
          });
          return;
        }

        mockRoleData.splice(index, 1);
        resolve({
          code: 200,
          data: null,
          msg: "删除成功",
        });
      } else {
        reject({
          code: 404,
          message: "角色不存在",
        });
      }
    }, 500);
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
    setTimeout(() => {
      const roleIndex = mockRoleData.findIndex(
        (item) => item.roleId === roleId
      );

      if (roleIndex !== -1) {
        // 更新角色状态
        mockRoleData[roleIndex].status = status;

        // 如果角色被停用，同步更新用户角色状态
        if (status === "1") {
          // 导入用户数据，避免循环依赖
          import("./mockData").then(({ mockUserData }) => {
            // 查找使用此角色的用户
            mockUserData.forEach((user) => {
              if (user.roleIds.includes(roleId)) {
                // 从用户角色列表中移除被停用的角色
                const roleIndex = user.roleIds.indexOf(roleId);
                if (roleIndex > -1) {
                  // 不直接移除角色ID，而是标记为停用状态
                  // 这样在角色重新启用时，可以恢复用户的角色
                  user.disabledRoleIds = user.disabledRoleIds || [];
                  if (!user.disabledRoleIds.includes(roleId)) {
                    user.disabledRoleIds.push(roleId);
                  }

                  // 更新用户的角色名称列表
                  const roleName = mockRoleData.find(
                    (r) => r.roleId === roleId
                  )?.roleName;
                  if (roleName && user.roles.includes(roleName)) {
                    user.roles = user.roles.filter((r) => r !== roleName);
                  }
                }
              }
            });
          });
        } else if (status === "0") {
          // 如果角色被启用，恢复用户角色状态
          import("./mockData").then(({ mockUserData }) => {
            // 查找有此角色但被停用的用户
            mockUserData.forEach((user) => {
              if (
                user.disabledRoleIds &&
                user.disabledRoleIds.includes(roleId)
              ) {
                // 从停用列表中移除
                user.disabledRoleIds = user.disabledRoleIds.filter(
                  (id) => id !== roleId
                );

                // 更新用户的角色名称列表
                const roleName = mockRoleData.find(
                  (r) => r.roleId === roleId
                )?.roleName;
                if (roleName && !user.roles.includes(roleName)) {
                  user.roles.push(roleName);
                }
              }
            });
          });
        }

        resolve({
          code: 200,
          data: null,
          msg: "状态修改成功",
        });
      } else {
        reject({
          code: 404,
          message: "角色不存在",
        });
      }
    }, 300);
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
