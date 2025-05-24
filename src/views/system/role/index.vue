<template>
  <div class="role-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入角色标识"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            style="width: 120px"
          >
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleQuery">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        :data="roleList"
        style="width: 100%"
        v-loading="loading"
        border
        stripe
        highlight-current-row
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="角色编号"
          prop="roleId"
          width="80"
          align="center"
        />
        <el-table-column
          label="角色名称"
          prop="roleName"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="角色标识"
          prop="roleKey"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="排序"
          prop="roleSort"
          width="80"
          align="center"
        />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'0'"
              :inactive-value="'1'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="备注"
          prop="remark"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" align="center" width="250">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon> 修改
            </el-button>
            <el-button type="success" link @click="handlePermission(scope.row)">
              <el-icon><Key /></el-icon> 权限分配
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(scope.row)"
              :disabled="scope.row.roleKey === 'admin'"
            >
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :small="false"
        />
      </div>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input
            v-model="roleForm.roleKey"
            placeholder="请输入角色标识"
            :disabled="
              roleForm.roleId !== undefined && roleForm.roleKey === 'admin'
            "
          />
        </el-form-item>
        <el-form-item label="角色排序" prop="roleSort">
          <el-input-number v-model="roleForm.roleSort" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleForm.remark"
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :loading="submitLoading"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog
      title="权限分配"
      v-model="permissionVisible"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="permissionFormRef"
        :model="permissionForm"
        label-width="100px"
      >
        <el-form-item label="角色名称">
          <span>{{ permissionForm.roleName }}</span>
        </el-form-item>
        <el-form-item label="权限菜单">
          <el-tree
            ref="menuTreeRef"
            :data="menuOptions"
            show-checkbox
            node-key="menuId"
            :props="{ label: 'menuName', children: 'children' }"
            :default-checked-keys="permissionForm.menuIds"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitPermission"
            :loading="submitLoading"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, Edit, Delete, Key } from "@element-plus/icons-vue";
import {
  listRoles,
  changeRoleStatus,
  getRoleInfo,
  createRole,
  updateRole,
  deleteRole,
  listMenus,
} from "@/api/role";

// 加载状态
const loading = ref(false);
// 提交状态
const submitLoading = ref(false);
// 角色列表数据
const roleList = ref([]);
// 总条数
const total = ref(0);
// 查询表单引用
const queryFormRef = ref(null);
// 角色表单引用
const roleFormRef = ref(null);
// 权限表单引用
const permissionFormRef = ref(null);
// 菜单树引用
const menuTreeRef = ref(null);
// 对话框可见性
const dialogVisible = ref(false);
// 对话框标题
const dialogTitle = ref("");
// 权限对话框可见性
const permissionVisible = ref(false);
// 菜单选项
const menuOptions = ref([]);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: "",
  roleKey: "",
  status: "",
});

// 角色表单数据
const roleForm = reactive({
  roleId: undefined,
  roleName: "",
  roleKey: "",
  roleSort: 1,
  status: "0",
  remark: "",
  menuIds: [],
});

// 权限表单数据
const permissionForm = reactive({
  roleId: undefined,
  roleName: "",
  menuIds: [],
});

// 角色表单验证规则
const roleRules = {
  roleName: [
    { required: true, message: "角色名称不能为空", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "角色名称长度必须在2-20个字符之间",
      trigger: "blur",
    },
  ],
  roleKey: [
    { required: true, message: "角色标识不能为空", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "角色标识只能包含字母、数字和下划线",
      trigger: "blur",
    },
  ],
  roleSort: [{ required: true, message: "角色排序不能为空", trigger: "blur" }],
};

// 获取角色列表
const getRoleList = async () => {
  loading.value = true;
  try {
    const res = await listRoles(queryParams);
    roleList.value = res.data.list;
    total.value = res.data.total;
  } catch (error) {
    console.error("获取角色列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 获取菜单列表
const getMenuList = async () => {
  try {
    const res = await listMenus();
    menuOptions.value = buildMenuTree(res.data);
  } catch (error) {
    console.error("获取菜单列表失败:", error);
  }
};

// 构建菜单树
const buildMenuTree = (menus) => {
  const menuMap = {};
  const result = [];

  // 创建映射
  menus.forEach((menu) => {
    menuMap[menu.menuId] = { ...menu, children: [] };
  });

  // 构建树结构
  menus.forEach((menu) => {
    const parentId = menu.parentId;
    if (parentId === 0) {
      // 根节点
      result.push(menuMap[menu.menuId]);
    } else {
      // 子节点
      if (menuMap[parentId]) {
        menuMap[parentId].children.push(menuMap[menu.menuId]);
      }
    }
  });

  return result;
};

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNum = 1;
  getRoleList();
};

// 重置按钮操作
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 每页条数改变
const handleSizeChange = (val) => {
  queryParams.pageSize = val;
  getRoleList();
};

// 当前页改变
const handleCurrentChange = (val) => {
  queryParams.pageNum = val;
  getRoleList();
};

// 处理角色状态变更
const handleStatusChange = async (row) => {
  try {
    await changeRoleStatus(row.roleId, row.status);
    ElMessage.success(`${row.roleName} 状态修改成功`);
  } catch (error) {
    // 状态改变失败，恢复原状态
    row.status = row.status === "0" ? "1" : "0";
    ElMessage.error(error.message || "状态修改失败");
  }
};

// 重置表单
const resetForm = () => {
  roleFormRef.value?.resetFields();
  Object.assign(roleForm, {
    roleId: undefined,
    roleName: "",
    roleKey: "",
    roleSort: 1,
    status: "0",
    remark: "",
    menuIds: [],
  });
};

// 新增角色按钮操作
const handleAdd = () => {
  resetForm();
  dialogTitle.value = "添加角色";
  dialogVisible.value = true;
};

// 修改角色按钮操作
const handleEdit = async (row) => {
  resetForm();
  dialogTitle.value = "修改角色";

  try {
    const res = await getRoleInfo(row.roleId);
    Object.assign(roleForm, res.data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error(error.message || "获取角色信息失败");
  }
};

// 权限分配按钮操作
const handlePermission = async (row) => {
  permissionForm.roleId = row.roleId;
  permissionForm.roleName = row.roleName;
  permissionForm.menuIds = row.menuIds || [];

  // 获取菜单列表
  await getMenuList();

  permissionVisible.value = true;
};

// 提交权限设置
const submitPermission = async () => {
  submitLoading.value = true;
  try {
    // 获取选中的菜单ID
    const menuIds = menuTreeRef.value.getCheckedKeys();

    // 更新角色权限
    await updateRole({
      roleId: permissionForm.roleId,
      menuIds,
    });

    ElMessage.success("权限分配成功");
    permissionVisible.value = false;
    getRoleList(); // 刷新列表
  } catch (error) {
    ElMessage.error(error.message || "权限分配失败");
  } finally {
    submitLoading.value = false;
  }
};

// 删除角色按钮操作
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除角色 ${row.roleName} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteRole(row.roleId);
        ElMessage.success("删除成功");
        getRoleList(); // 刷新列表
      } catch (error) {
        ElMessage.error(error.message || "删除失败");
      }
    })
    .catch(() => {});
};

// 提交表单
const submitForm = () => {
  roleFormRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        if (roleForm.roleId) {
          // 更新角色
          await updateRole(roleForm);
          ElMessage.success("修改成功");
        } else {
          // 创建角色
          await createRole(roleForm);
          ElMessage.success("创建成功");
        }

        dialogVisible.value = false;
        getRoleList(); // 刷新列表
      } catch (error) {
        ElMessage.error(error.message || "操作失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

onMounted(() => {
  getRoleList();
});
</script>

<style lang="scss" scoped>
.role-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-container {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
