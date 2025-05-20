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
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号码"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
          >
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户编号" prop="userId" width="100" />
        <el-table-column
          label="用户名称"
          prop="username"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="用户昵称"
          prop="nickname"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="部门"
          prop="deptName"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="手机号码" prop="phone" width="120" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
              {{ scope.row.status === "0" ? "正常" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
        />
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button type="primary" link @click="handleRoleAssign(scope.row)"
              >分配角色</el-button
            >
            <el-button type="danger" link @click="handleDelete(scope.row)"
              >删除</el-button
            >
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
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 加载状态
const loading = ref(false);
// 用户列表数据
const userList = ref([]);
// 总条数
const total = ref(0);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: "",
  phone: "",
  status: "",
});

// 获取用户列表
const getUserList = () => {
  loading.value = true;
  // 这里应该调用API获取用户列表
  // 模拟数据
  setTimeout(() => {
    userList.value = [
      {
        userId: 1,
        username: "admin",
        nickname: "管理员",
        deptName: "研发部门",
        phone: "13800138000",
        status: "0",
        createTime: "2023-01-01 12:00:00",
      },
      {
        userId: 2,
        username: "test",
        nickname: "测试用户",
        deptName: "测试部门",
        phone: "13800138001",
        status: "0",
        createTime: "2023-01-02 12:00:00",
      },
      {
        userId: 3,
        username: "dev",
        nickname: "开发用户",
        deptName: "研发部门",
        phone: "13800138002",
        status: "1",
        createTime: "2023-01-03 12:00:00",
      },
    ];
    total.value = 3;
    loading.value = false;
  }, 500);
};

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNum = 1;
  getUserList();
};

// 重置按钮操作
const resetQuery = () => {
  queryParams.username = "";
  queryParams.phone = "";
  queryParams.status = "";
  handleQuery();
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

onMounted(() => {
  getUserList();
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
