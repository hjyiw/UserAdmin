// 部门管理相关API
import { useUserStore } from "@/store";
import { DATA_SCOPE_TYPES } from "@/utils/permission";

// 模拟部门数据
const mockDeptData = [
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

// 扁平化部门数据，用于查询
let flatDeptData = [];

/**
 * 将树形结构的部门数据扁平化
 * @param {Array} depts - 部门数据
 * @returns {Array} - 扁平化后的部门数据
 */
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
flatDeptData = flattenDeptData(mockDeptData);

/**
 * 获取部门列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回部门列表数据
 */
export function listDepartment(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { deptName, status } = params || {};
      const userStore = useUserStore();

      // 深拷贝原始数据
      let result = JSON.parse(JSON.stringify(mockDeptData));

      // 如果有查询条件，则进行过滤
      if (deptName || (status !== undefined && status !== "")) {
        // 使用扁平化数据进行过滤
        let filtered = flatDeptData;

        if (deptName) {
          filtered = filtered.filter((dept) =>
            dept.deptName.toLowerCase().includes(deptName.toLowerCase())
          );
        }

        if (status !== undefined && status !== "") {
          filtered = filtered.filter((dept) => dept.status === status);
        }

        // 重建树形结构
        result = buildDeptTree(filtered);
      }

      // 应用数据权限过滤
      if (!userStore.roles.includes("admin")) {
        const dataScope =
          userStore.permissions?.dataScope || DATA_SCOPE_TYPES.SELF;
        const userDeptId = userStore.userInfo?.deptId;

        if (dataScope === DATA_SCOPE_TYPES.DEPT) {
          // 本部门数据权限
          result = filterDeptByDeptId(result, userDeptId);
        } else if (dataScope === DATA_SCOPE_TYPES.DEPT_AND_CHILD) {
          // 本部门及以下数据权限
          result = filterDeptByDeptIdAndChild(result, userDeptId);
        } else if (dataScope === DATA_SCOPE_TYPES.CUSTOM) {
          // 自定义数据权限
          const deptIds = userStore.userInfo?.deptIds || [];
          result = filterDeptByDeptIds(result, deptIds);
        } else if (dataScope === DATA_SCOPE_TYPES.SELF) {
          // 仅本人数据权限 - 对于部门管理，通常没有"本人"的概念，这里可以限制为空
          result = [];
        }
        // DATA_SCOPE_TYPES.ALL 不需要过滤
      }

      resolve({
        code: 200,
        data: result,
        msg: "查询成功",
      });
    }, 300);
  });
}

/**
 * 根据部门ID获取部门信息
 * @param {number} deptId - 部门ID
 * @returns {Promise} - 返回部门信息
 */
export function getDepartment(deptId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dept = flatDeptData.find((item) => item.deptId === deptId);

      if (dept) {
        resolve({
          code: 200,
          data: dept,
          msg: "获取成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 300);
  });
}

/**
 * 创建部门
 * @param {Object} deptData - 部门数据
 * @returns {Promise} - 返回创建结果
 */
export function createDepartment(deptData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成新的部门ID
      const newDeptId =
        Math.max(...flatDeptData.map((dept) => dept.deptId)) + 1;

      // 构建新部门对象
      const newDept = {
        deptId: newDeptId,
        deptName: deptData.deptName,
        parentId: deptData.parentId || 0,
        orderNum: deptData.orderNum || 1,
        leader: deptData.leader || "",
        phone: deptData.phone || "",
        email: deptData.email || "",
        status: deptData.status || "0",
        createTime: new Date().toLocaleString(),
      };

      // 将新部门添加到扁平化数据中
      flatDeptData.push(newDept);

      // 如果是顶级部门，直接添加到mockDeptData
      if (newDept.parentId === 0) {
        mockDeptData.push(newDept);
      } else {
        // 否则，找到父部门并添加到其children中
        addChildDept(mockDeptData, newDept);
      }

      resolve({
        code: 200,
        data: newDept,
        msg: "创建成功",
      });
    }, 500);
  });
}

/**
 * 更新部门信息
 * @param {Object} deptData - 部门数据
 * @returns {Promise} - 返回更新结果
 */
export function updateDepartment(deptData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = flatDeptData.findIndex(
        (item) => item.deptId === deptData.deptId
      );

      if (index !== -1) {
        // 更新扁平化数据中的部门信息
        flatDeptData[index] = { ...flatDeptData[index], ...deptData };

        // 更新树形结构中的部门信息
        updateDeptInTree(mockDeptData, deptData);

        resolve({
          code: 200,
          data: flatDeptData[index],
          msg: "更新成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 500);
  });
}

/**
 * 删除部门
 * @param {number} deptId - 部门ID
 * @returns {Promise} - 返回删除结果
 */
export function deleteDepartment(deptId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查是否有子部门
      const hasChildren = flatDeptData.some((item) => item.parentId === deptId);

      if (hasChildren) {
        reject({
          code: 400,
          message: "存在下级部门，不允许删除",
        });
        return;
      }

      // 从扁平化数据中删除
      const index = flatDeptData.findIndex((item) => item.deptId === deptId);

      if (index !== -1) {
        flatDeptData.splice(index, 1);

        // 从树形结构中删除
        deleteDeptFromTree(mockDeptData, deptId);

        resolve({
          code: 200,
          data: null,
          msg: "删除成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 500);
  });
}

/**
 * 更新部门状态
 * @param {number} deptId - 部门ID
 * @param {string} status - 部门状态
 * @returns {Promise} - 返回操作结果
 */
export function changeDepartmentStatus(deptId, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dept = flatDeptData.find((item) => item.deptId === deptId);

      if (dept) {
        dept.status = status;

        // 更新树形结构中的状态
        updateDeptInTree(mockDeptData, { deptId, status });

        resolve({
          code: 200,
          data: null,
          msg: "状态修改成功",
        });
      } else {
        reject({
          code: 404,
          message: "部门不存在",
        });
      }
    }, 300);
  });
}

/**
 * 获取部门选择器数据（用于下拉选择）
 * @returns {Promise} - 返回部门选择器数据
 */
export function listDepartmentSelector() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 构建部门选择器数据
      const deptOptions = buildDeptOptions(mockDeptData);

      resolve({
        code: 200,
        data: deptOptions,
        msg: "获取成功",
      });
    }, 300);
  });
}

/**
 * 构建部门树形结构
 * @param {Array} depts - 扁平化的部门数据
 * @returns {Array} - 树形结构的部门数据
 */
function buildDeptTree(depts) {
  const deptMap = {};
  const result = [];

  // 创建映射
  depts.forEach((dept) => {
    deptMap[dept.deptId] = { ...dept, children: [] };
  });

  // 构建树结构
  depts.forEach((dept) => {
    const parentId = dept.parentId;
    if (parentId === 0) {
      // 根节点
      result.push(deptMap[dept.deptId]);
    } else {
      // 子节点
      if (deptMap[parentId]) {
        deptMap[parentId].children.push(deptMap[dept.deptId]);
      }
    }
  });

  return result;
}

/**
 * 构建部门选择器数据
 * @param {Array} depts - 部门数据
 * @param {number} level - 层级
 * @returns {Array} - 部门选择器数据
 */
function buildDeptOptions(depts, level = 0) {
  const options = [];

  depts.forEach((dept) => {
    const prefix = level > 0 ? "│".repeat(level) + "└─ " : "";

    options.push({
      value: dept.deptId,
      label: prefix + dept.deptName,
    });

    if (dept.children && dept.children.length > 0) {
      const childOptions = buildDeptOptions(dept.children, level + 1);
      options.push(...childOptions);
    }
  });

  return options;
}

/**
 * 将子部门添加到树形结构中
 * @param {Array} depts - 部门数据
 * @param {Object} childDept - 子部门
 */
function addChildDept(depts, childDept) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].deptId === childDept.parentId) {
      if (!depts[i].children) {
        depts[i].children = [];
      }
      depts[i].children.push(childDept);
      return true;
    }

    if (depts[i].children && depts[i].children.length > 0) {
      if (addChildDept(depts[i].children, childDept)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 更新树形结构中的部门信息
 * @param {Array} depts - 部门数据
 * @param {Object} deptData - 部门更新数据
 */
function updateDeptInTree(depts, deptData) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].deptId === deptData.deptId) {
      depts[i] = { ...depts[i], ...deptData };
      return true;
    }

    if (depts[i].children && depts[i].children.length > 0) {
      if (updateDeptInTree(depts[i].children, deptData)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 从树形结构中删除部门
 * @param {Array} depts - 部门数据
 * @param {number} deptId - 部门ID
 */
function deleteDeptFromTree(depts, deptId) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].deptId === deptId) {
      depts.splice(i, 1);
      return true;
    }

    if (depts[i].children && depts[i].children.length > 0) {
      if (deleteDeptFromTree(depts[i].children, deptId)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 根据部门ID过滤部门树
 * @param {Array} depts - 部门树
 * @param {Number} deptId - 部门ID
 * @returns {Array} - 过滤后的部门树
 */
function filterDeptByDeptId(depts, deptId) {
  return depts.filter((dept) => {
    if (dept.deptId === deptId) {
      return true;
    }
    return false;
  });
}

/**
 * 根据部门ID及其子部门过滤部门树
 * @param {Array} depts - 部门树
 * @param {Number} deptId - 部门ID
 * @returns {Array} - 过滤后的部门树
 */
function filterDeptByDeptIdAndChild(depts, deptId) {
  const result = [];

  // 递归查找指定部门及其子部门
  function findDeptAndChildren(departments, targetDeptId) {
    for (const dept of departments) {
      if (dept.deptId === targetDeptId) {
        // 找到目标部门，添加到结果中
        result.push(JSON.parse(JSON.stringify(dept)));
        return true;
      }

      // 在子部门中查找
      if (dept.children && dept.children.length > 0) {
        const found = findDeptAndChildren(dept.children, targetDeptId);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  findDeptAndChildren(depts, deptId);
  return result;
}

/**
 * 根据多个部门ID过滤部门树
 * @param {Array} depts - 部门树
 * @param {Array} deptIds - 部门ID数组
 * @returns {Array} - 过滤后的部门树
 */
function filterDeptByDeptIds(depts, deptIds) {
  if (!deptIds || deptIds.length === 0) {
    return [];
  }

  const result = [];

  // 递归查找指定部门
  deptIds.forEach((deptId) => {
    const filteredDepts = filterDeptByDeptIdAndChild(depts, deptId);
    result.push(...filteredDepts);
  });

  return result;
}
