// 用户管理相关API

// 模拟用户列表数据
const mockUserData = [
  {
    userId: 1,
    username: "admin",
    nickname: "管理员",
    deptName: "研发部门",
    deptId: 1,
    phone: "13800138000",
    email: "admin@example.com",
    status: "0",
    createTime: "2023-01-01 12:00:00",
    roleIds: [1],
    roles: ["管理员"],
  },
  {
    userId: 2,
    username: "test",
    nickname: "测试用户",
    deptName: "测试部门",
    deptId: 2,
    phone: "13800138001",
    email: "test@example.com",
    status: "0",
    createTime: "2023-01-02 12:00:00",
    roleIds: [2],
    roles: ["测试人员"],
  },
  {
    userId: 3,
    username: "dev",
    nickname: "开发用户",
    deptName: "研发部门",
    deptId: 1,
    phone: "13800138002",
    email: "dev@example.com",
    status: "1",
    createTime: "2023-01-03 12:00:00",
    roleIds: [3],
    roles: ["开发人员"],
  },
  {
    userId: 4,
    username: "pm",
    nickname: "项目经理",
    deptName: "项目部门",
    deptId: 3,
    phone: "13800138003",
    email: "pm@example.com",
    status: "0",
    createTime: "2023-01-04 12:00:00",
    roleIds: [4],
    roles: ["项目经理"],
  },
  {
    userId: 5,
    username: "marketing",
    nickname: "市场专员",
    deptName: "市场部门",
    deptId: 4,
    phone: "13800138004",
    email: "marketing@example.com",
    status: "0",
    createTime: "2023-01-05 12:00:00",
    roleIds: [5],
    roles: ["市场人员"],
  },
  {
    userId: 6,
    username: "finance",
    nickname: "财务人员",
    deptName: "财务部门",
    deptId: 5,
    phone: "13800138005",
    email: "finance@example.com",
    status: "0",
    createTime: "2023-01-06 12:00:00",
    roleIds: [6],
    roles: ["财务人员"],
  },
  {
    userId: 7,
    username: "hr",
    nickname: "人事专员",
    deptName: "人事部门",
    deptId: 6,
    phone: "13800138006",
    email: "hr@example.com",
    status: "0",
    createTime: "2023-01-07 12:00:00",
    roleIds: [7],
    roles: ["人事专员"],
  },
  {
    userId: 8,
    username: "ops",
    nickname: "运维工程师",
    deptName: "运维部门",
    deptId: 7,
    phone: "13800138007",
    email: "ops@example.com",
    status: "1",
    createTime: "2023-01-08 12:00:00",
    roleIds: [8],
    roles: ["运维人员"],
  },
  {
    userId: 9,
    username: "security",
    nickname: "安全工程师",
    deptName: "安全部门",
    deptId: 8,
    phone: "13800138008",
    email: "security@example.com",
    status: "0",
    createTime: "2023-01-09 12:00:00",
    roleIds: [9],
    roles: ["安全人员"],
  },
  {
    userId: 10,
    username: "product",
    nickname: "产品经理",
    deptName: "产品部门",
    deptId: 9,
    phone: "13800138009",
    email: "product@example.com",
    status: "0",
    createTime: "2023-01-10 12:00:00",
    roleIds: [10],
    roles: ["产品经理"],
  },
];

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回用户列表数据
 */
export function listUsers(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { pageNum, pageSize, username, phone, status, deptId, email } =
        params;

      // 过滤数据
      let filteredData = [...mockUserData];

      // 按用户名筛选
      if (username) {
        filteredData = filteredData.filter(
          (item) =>
            item.username.toLowerCase().includes(username.toLowerCase()) ||
            item.nickname.toLowerCase().includes(username.toLowerCase())
        );
      }

      // 按手机号筛选
      if (phone) {
        filteredData = filteredData.filter((item) =>
          item.phone.includes(phone)
        );
      }

      // 按状态筛选
      if (status !== "" && status !== undefined) {
        filteredData = filteredData.filter((item) => item.status === status);
      }

      // 按部门筛选
      if (deptId) {
        filteredData = filteredData.filter((item) => item.deptId === deptId);
      }

      // 按邮箱筛选
      if (email) {
        filteredData = filteredData.filter((item) =>
          item.email.toLowerCase().includes(email.toLowerCase())
        );
      }

      // 计算总数
      const total = filteredData.length;

      // 分页
      const startIndex = (pageNum - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      const pagedData = filteredData.slice(startIndex, endIndex);

      resolve({
        code: 200,
        data: {
          total,
          list: pagedData,
        },
        msg: "查询成功",
      });
    }, 300); // 模拟网络延迟
  });
}

/**
 * 获取用户详情
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回用户详情
 */
export function getUserInfo(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserData.find((item) => item.userId === userId);
      if (user) {
        resolve({
          code: 200,
          data: user,
          msg: "获取成功",
        });
      } else {
        reject({
          code: 404,
          message: "用户不存在",
        });
      }
    }, 300);
  });
}

/**
 * 更新用户状态
 * @param {number} userId - 用户ID
 * @param {string} status - 用户状态
 * @returns {Promise} - 返回操作结果
 */
export function changeUserStatus(userId, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: null,
        msg: "状态修改成功",
      });
    }, 300);
  });
}

/**
 * 获取部门列表
 * @returns {Promise} - 返回部门列表
 */
export function listDepartments() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { deptId: 1, deptName: "研发部门", parentId: 0 },
          { deptId: 2, deptName: "测试部门", parentId: 0 },
          { deptId: 3, deptName: "项目部门", parentId: 0 },
          { deptId: 4, deptName: "市场部门", parentId: 0 },
          { deptId: 5, deptName: "财务部门", parentId: 0 },
          { deptId: 6, deptName: "人事部门", parentId: 0 },
          { deptId: 7, deptName: "运维部门", parentId: 0 },
          { deptId: 8, deptName: "安全部门", parentId: 0 },
          { deptId: 9, deptName: "产品部门", parentId: 0 },
        ],
        msg: "获取成功",
      });
    }, 300);
  });
}

/**
 * 获取角色列表
 * @returns {Promise} - 返回角色列表
 */
export function listRoles() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { roleId: 1, roleName: "管理员" },
          { roleId: 2, roleName: "测试人员" },
          { roleId: 3, roleName: "开发人员" },
          { roleId: 4, roleName: "项目经理" },
          { roleId: 5, roleName: "市场人员" },
          { roleId: 6, roleName: "财务人员" },
          { roleId: 7, roleName: "人事专员" },
          { roleId: 8, roleName: "运维人员" },
          { roleId: 9, roleName: "安全人员" },
          { roleId: 10, roleName: "产品经理" },
        ],
        msg: "获取成功",
      });
    }, 300);
  });
}
