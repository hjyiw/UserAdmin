<template>
  <div class="user-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="用户名/昵称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="queryParams.email"
            placeholder="请输入邮箱"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            style="width: 120px"
          >
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-select
            v-model="queryParams.deptId"
            placeholder="请选择部门"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="dept in deptOptions"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            />
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
        :data="userList"
        style="width: 100%"
        v-loading="loading"
        border
        stripe
        highlight-current-row
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="用户编号"
          prop="userId"
          width="80"
          align="center"
        />
        <el-table-column
          label="用户名称"
          prop="username"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="用户昵称"
          prop="nickname"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="部门"
          prop="deptName"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="手机号码"
          prop="phone"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="邮箱"
          prop="email"
          :show-overflow-tooltip="true"
          min-width="150"
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
        <el-table-column label="操作" align="center" width="250">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon> 修改
            </el-button>
            <el-button type="success" link @click="handleRoleAssign(scope.row)">
              <el-icon><Connection /></el-icon> 分配角色
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Edit,
  Delete,
  Connection,
} from "@element-plus/icons-vue";
import { listUsers, changeUserStatus, listDepartments } from "@/api/user";

// 加载状态
const loading = ref(false);
// 用户列表数据
const userList = ref([]);
// 总条数
const total = ref(0);
// 部门选项
const deptOptions = ref([]);
// 查询表单引用
const queryFormRef = ref(null);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: "",
  phone: "",
  email: "",
  status: "",
  deptId: undefined,
});

// 获取用户列表
const getUserList = async () => {
  loading.value = true;
  try {
    const res = await listUsers(queryParams);
    userList.value = res.data.list;
    total.value = res.data.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 获取部门列表
const getDeptList = async () => {
  try {
    const res = await listDepartments();
    deptOptions.value = res.data;
  } catch (error) {
    console.error("获取部门列表失败:", error);
  }
};

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNum = 1;
  getUserList();
};

// 重置按钮操作
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 每页条数改变
const handleSizeChange = (val) => {
  queryParams.pageSize = val;
  getUserList();
};

// 当前页改变
const handleCurrentChange = (val) => {
  queryParams.pageNum = val;
  getUserList();
};

// 处理用户状态变更
const handleStatusChange = async (row) => {
  try {
    await changeUserStatus(row.userId, row.status);
    ElMessage.success(`${row.username} 状态修改成功`);
  } catch (error) {
    // 状态改变失败，恢复原状态
    row.status = row.status === "0" ? "1" : "0";
    ElMessage.error("状态修改失败");
  }
};

// 新增用户按钮操作
const handleAdd = () => {
  ElMessage.success("新增用户功能待实现");
};

// 修改用户按钮操作
const handleEdit = (row) => {
  ElMessage.success(`修改用户：${row.username}`);
};

// 分配角色按钮操作
const handleRoleAssign = (row) => {
  ElMessage.success(`分配角色：${row.username}`);
};

// 删除用户按钮操作
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除用户 ${row.username} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage.success(`删除用户：${row.username}`);
    })
    .catch(() => {});
};

onMounted(() => {
  getUserList();
  getDeptList();
});
</script>

<style lang="scss" scoped>
.user-container {
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
