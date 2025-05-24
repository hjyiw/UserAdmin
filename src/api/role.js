// 角色管理相关API

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
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
    menuIds: [1, 2, 3, 4],
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
    menuIds: [1, 2, 3, 5],
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
    menuIds: [1, 2, 3, 4, 5, 6],
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
    menuIds: [1, 2, 3, 7],
    permissions: ["system:market:list", "system:market:query"],
  },
  {
    roleId: 6,
    roleName: "财务人员",
    roleKey: "finance",
    roleSort: 6,
    status: "0",
    createTime: "2023-01-06 12:00:00",
    remark: "财务人员",
    menuIds: [1, 2, 3, 8],
    permissions: ["system:finance:list", "system:finance:query"],
  },
  {
    roleId: 7,
    roleName: "人事专员",
    roleKey: "hr",
    roleSort: 7,
    status: "0",
    createTime: "2023-01-07 12:00:00",
    remark: "人事专员",
    menuIds: [1, 2, 3, 9],
    permissions: ["system:hr:list", "system:hr:query"],
  },
  {
    roleId: 8,
    roleName: "运维人员",
    roleKey: "ops",
    roleSort: 8,
    status: "1", // 停用
    createTime: "2023-01-08 12:00:00",
    remark: "运维人员",
    menuIds: [1, 2, 3, 10],
    permissions: ["system:ops:list", "system:ops:query"],
  },
  {
    roleId: 9,
    roleName: "安全人员",
    roleKey: "security",
    roleSort: 9,
    status: "0",
    createTime: "2023-01-09 12:00:00",
    remark: "安全人员",
    menuIds: [1, 2, 3, 11],
    permissions: ["system:security:list", "system:security:query"],
  },
  {
    roleId: 10,
    roleName: "产品经理",
    roleKey: "product",
    roleSort: 10,
    status: "0",
    createTime: "2023-01-10 12:00:00",
    remark: "产品经理",
    menuIds: [1, 2, 3, 12],
    permissions: ["system:product:list", "system:product:query"],
  },
];

/**
 * 获取角色列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回角色列表数据
 */
export function listRoles(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { pageNum, pageSize, roleName, roleKey, status } = params || {};

      // 过滤数据
      let filteredData = [...mockRoleData];

      // 按角色名称筛选
      if (roleName) {
        filteredData = filteredData.filter((item) =>
          item.roleName.toLowerCase().includes(roleName.toLowerCase())
        );
      }

      // 按角色标识筛选
      if (roleKey) {
        filteredData = filteredData.filter((item) =>
          item.roleKey.toLowerCase().includes(roleKey.toLowerCase())
        );
      }

      // 按状态筛选
      if (status !== undefined && status !== "") {
        filteredData = filteredData.filter((item) => item.status === status);
      }

      // 计算总数
      const total = filteredData.length;

      // 如果有分页参数，则进行分页
      if (pageNum !== undefined && pageSize !== undefined) {
        // 分页
        const startIndex = (pageNum - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, total);
        filteredData = filteredData.slice(startIndex, endIndex);
      }

      resolve({
        code: 200,
        data:
          params && params.pageNum
            ? {
                total,
                list: filteredData,
              }
            : filteredData,
        msg: "查询成功",
      });
    }, 300); // 模拟网络延迟
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
          { menuId: 4, menuName: "菜单管理", parentId: 1 },
          { menuId: 5, menuName: "部门管理", parentId: 1 },
          { menuId: 6, menuName: "岗位管理", parentId: 1 },
          { menuId: 7, menuName: "字典管理", parentId: 1 },
          { menuId: 8, menuName: "参数设置", parentId: 1 },
          { menuId: 9, menuName: "通知公告", parentId: 1 },
          { menuId: 10, menuName: "日志管理", parentId: 1 },
          { menuId: 11, menuName: "在线用户", parentId: 1 },
          { menuId: 12, menuName: "定时任务", parentId: 1 },
        ],
        msg: "获取成功",
      });
    }, 300);
  });
}
