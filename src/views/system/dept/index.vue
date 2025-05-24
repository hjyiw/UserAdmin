<template>
  <div class="dept-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" @click="handleAdd">新增部门</el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="部门状态"
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
        :data="deptList"
        style="width: 100%"
        v-loading="loading"
        row-key="deptId"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="部门名称" prop="deptName" />
        <el-table-column label="负责人" prop="leader" width="100" />
        <el-table-column
          label="排序"
          prop="orderNum"
          width="60"
          align="center"
        />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'0'"
              :inactive-value="'1'"
              @change="handleStatusChange(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'edit' }"
              :disabled="!hasEditPermission(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
        />
        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="handleAdd(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'add' }"
            >
              <el-icon><Plus /></el-icon> 新增
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleEdit(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'edit' }"
            >
              <el-icon><Edit /></el-icon> 修改
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(scope.row)"
              :disabled="hasChildren(scope.row)"
              v-data-perm="{ resource: scope.row, action: 'delete' }"
            >
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 部门表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="deptFormRef"
        :model="deptForm"
        :rules="deptRules"
        label-width="100px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="deptForm.parentId"
            :data="deptOptions"
            :props="{ label: 'label', value: 'value', children: 'children' }"
            value-key="value"
            placeholder="请选择上级部门"
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="deptForm.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="deptForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="deptForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="deptForm.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="deptForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, Edit, Delete, Plus } from "@element-plus/icons-vue";
import {
  listDepartment,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  changeDepartmentStatus,
  listDepartmentSelector,
} from "@/api/department";
import { useUserStore } from "@/store";
import { checkDataPermission } from "@/utils/permission";

// 加载状态
const loading = ref(false);
// 提交状态
const submitLoading = ref(false);
// 部门列表数据
const deptList = ref([]);
// 部门选项数据（用于上级部门选择）
const deptOptions = ref([]);
// 查询表单引用
const queryFormRef = ref(null);
// 部门表单引用
const deptFormRef = ref(null);
// 对话框可见性
const dialogVisible = ref(false);
// 对话框标题
const dialogTitle = ref("");

// 查询参数
const queryParams = reactive({
  deptName: "",
  status: "",
});

// 部门表单数据
const deptForm = reactive({
  deptId: undefined,
  parentId: 0,
  deptName: "",
  leader: "",
  phone: "",
  email: "",
  orderNum: 1,
  status: "0",
});

// 表单验证规则
const deptRules = {
  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
  deptName: [
    { required: true, message: "部门名称不能为空", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "部门名称长度必须在2-20个字符之间",
      trigger: "blur",
    },
  ],
  orderNum: [{ required: true, message: "排序不能为空", trigger: "blur" }],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$|^$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  email: [
    {
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+|^$/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
};

// 获取部门列表
const getDeptList = async () => {
  loading.value = true;
  try {
    const res = await listDepartment(queryParams);
    deptList.value = res.data;
  } catch (error) {
    console.error("获取部门列表失败:", error);
    ElMessage.error("获取部门列表失败");
  } finally {
    loading.value = false;
  }
};

// 获取部门选择器数据
const getDeptOptions = async () => {
  try {
    const res = await listDepartmentSelector();
    // 添加一个"顶级部门"选项
    deptOptions.value = [
      { value: 0, label: "顶级部门", children: [] },
      ...res.data,
    ];
  } catch (error) {
    console.error("获取部门选择器数据失败:", error);
    ElMessage.error("获取部门选择器数据失败");
  }
};

// 搜索按钮操作
const handleQuery = () => {
  getDeptList();
};

// 重置按钮操作
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 判断是否有子部门
const hasChildren = (row) => {
  return row.children && row.children.length > 0;
};

// 处理部门状态变更
const handleStatusChange = async (row) => {
  try {
    await changeDepartmentStatus(row.deptId, row.status);
    ElMessage.success(`${row.deptName} 状态修改成功`);
  } catch (error) {
    // 状态改变失败，恢复原状态
    row.status = row.status === "0" ? "1" : "0";
    ElMessage.error(error.message || "状态修改失败");
  }
};

// 重置表单
const resetForm = () => {
  deptFormRef.value?.resetFields();
  Object.assign(deptForm, {
    deptId: undefined,
    parentId: 0,
    deptName: "",
    leader: "",
    phone: "",
    email: "",
    orderNum: 1,
    status: "0",
  });
};

// 新增部门按钮操作
const handleAdd = (row) => {
  resetForm();
  dialogTitle.value = "添加部门";

  // 获取部门选择器数据
  getDeptOptions();

  // 如果是在某个部门下新增子部门
  if (row) {
    deptForm.parentId = row.deptId;
  }

  nextTick(() => {
    dialogVisible.value = true;
  });
};

// 修改部门按钮操作
const handleEdit = async (row) => {
  resetForm();
  dialogTitle.value = "修改部门";

  // 获取部门选择器数据
  await getDeptOptions();

  try {
    const res = await getDepartment(row.deptId);
    Object.assign(deptForm, res.data);

    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error(error.message || "获取部门信息失败");
  }
};

// 删除部门按钮操作
const handleDelete = (row) => {
  if (hasChildren(row)) {
    ElMessage.warning("存在下级部门，不允许删除");
    return;
  }

  ElMessageBox.confirm(`确认删除部门 ${row.deptName} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteDepartment(row.deptId);
        ElMessage.success("删除成功");
        getDeptList(); // 刷新列表
      } catch (error) {
        ElMessage.error(error.message || "删除失败");
      }
    })
    .catch(() => {});
};

// 提交表单
const submitForm = () => {
  deptFormRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        if (deptForm.deptId) {
          // 更新部门
          await updateDepartment(deptForm);
          ElMessage.success("修改成功");
        } else {
          // 创建部门
          await createDepartment(deptForm);
          ElMessage.success("创建成功");
        }

        dialogVisible.value = false;
        getDeptList(); // 刷新列表
      } catch (error) {
        ElMessage.error(error.message || "操作失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

const userStore = useUserStore();

// 检查是否有编辑权限
const hasEditPermission = (row) => {
  return checkDataPermission(row, "edit");
};

// 检查是否有删除权限
const hasDeletePermission = (row) => {
  return checkDataPermission(row, "delete") && !hasChildren(row);
};

onMounted(() => {
  getDeptList();
});
</script>

<style lang="scss" scoped>
.dept-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
