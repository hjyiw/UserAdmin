// 模拟数据文件 - 存储部门和用户的初始数据
// 模拟部门数据
export const mockDeptData = [
  {
    deptId: 1,
    deptName: "总公司",
    parentId: 0,
    orderNum: 1,
    leader: "张三",
    phone: "13800138000",
    email: "zhangsan@example.com",
    status: "0", // 0-正常，1-停用
    createTime: "2023-01-01 12:00:00",
    children: [
      {
        deptId: 2,
        deptName: "研发部门",
        parentId: 1,
        orderNum: 1,
        leader: "李四",
        phone: "13800138001",
        email: "lisi@example.com",
        status: "0",
        createTime: "2023-01-02 12:00:00",
        children: [
          {
            deptId: 5,
            deptName: "前端组",
            parentId: 2,
            orderNum: 1,
            leader: "王五",
            phone: "13800138004",
            email: "wangwu@example.com",
            status: "0",
            createTime: "2023-01-05 12:00:00",
          },
          {
            deptId: 6,
            deptName: "后端组",
            parentId: 2,
            orderNum: 2,
            leader: "赵六",
            phone: "13800138005",
            email: "zhaoliu@example.com",
            status: "0",
            createTime: "2023-01-06 12:00:00",
          },
        ],
      },
      {
        deptId: 3,
        deptName: "测试部门",
        parentId: 1,
        orderNum: 2,
        leader: "钱七",
        phone: "13800138002",
        email: "qianqi@example.com",
        status: "0",
        createTime: "2023-01-03 12:00:00",
      },
      {
        deptId: 4,
        deptName: "运维部门",
        parentId: 1,
        orderNum: 3,
        leader: "孙八",
        phone: "13800138003",
        email: "sunba@example.com",
        status: "1", // 停用
        createTime: "2023-01-04 12:00:00",
      },
    ],
  },
  {
    deptId: 7,
    deptName: "市场部门",
    parentId: 0,
    orderNum: 2,
    leader: "周九",
    phone: "13800138006",
    email: "zhoujiu@example.com",
    status: "0",
    createTime: "2023-01-07 12:00:00",
  },
  {
    deptId: 8,
    deptName: "财务部门",
    parentId: 0,
    orderNum: 3,
    leader: "吴十",
    phone: "13800138007",
    email: "wushi@example.com",
    status: "0",
    createTime: "2023-01-08 12:00:00",
  },
];

// 将树形结构的部门数据扁平化
function flattenDeptData(depts) {
  const result = [];

  function flatten(items) {
    items.forEach((item) => {
      const { children, ...rest } = item;
      result.push(rest);
      if (children && children.length > 0) {
        flatten(children);
      }
    });
  }

  flatten(depts);
  return result;
}

// 初始化扁平化数据
export const flatDeptData = flattenDeptData(mockDeptData);

// 获取部门名称映射
export const deptNameMap = flatDeptData.reduce((map, dept) => {
  map[dept.deptId] = dept.deptName;
  return map;
}, {});

// 获取有效的部门ID列表
export const validDeptIds = flatDeptData.map((dept) => dept.deptId);

// 模拟用户列表数据
export const mockUserData = [
  {
    userId: 1,
    username: "admin",
    nickname: "管理员",
    deptId: 1,
    deptName: "总公司",
    deptPath: "0,1",
    phone: "13800138000",
    email: "admin@example.com",
    status: "0",
    createTime: "2023-01-01 12:00:00",
    createBy: 1,
    roleIds: [1], // 管理员角色
    roles: ["管理员"],
  },
  {
    userId: 2,
    username: "test",
    nickname: "测试用户",
    deptId: 2,
    deptName: "研发部门",
    deptPath: "0,1,2",
    phone: "13800138001",
    email: "test@example.com",
    status: "0",
    createTime: "2023-01-02 12:00:00",
    createBy: 1,
    roleIds: [2],
    roles: ["测试人员"],
  },
  {
    userId: 3,
    username: "dev",
    nickname: "开发用户",
    deptId: 5,
    deptName: "前端组",
    deptPath: "0,1,2,5",
    phone: "13800138002",
    email: "dev@example.com",
    status: "1",
    createTime: "2023-01-03 12:00:00",
    createBy: 1,
    roleIds: [3],
    roles: ["开发人员"],
  },
];
