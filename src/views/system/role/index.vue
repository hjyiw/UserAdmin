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
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
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
      <el-table :data="roleList" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="roleId" width="100" />
        <el-table-column
          label="角色名称"
          prop="roleName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="权限字符"
          prop="roleKey"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
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
            <el-button type="primary" link @click="handlePermission(scope.row)"
              >分配权限</el-button
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
// 角色列表数据
const roleList = ref([]);
// 总条数
const total = ref(0);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: "",
  roleKey: "",
  status: "",
});

// 获取角色列表
const getRoleList = () => {
  loading.value = true;
  // 这里应该调用API获取角色列表
  // 模拟数据
  setTimeout(() => {
    roleList.value = [
      {
        roleId: 1,
        roleName: "超级管理员",
        roleKey: "admin",
        roleSort: 1,
        status: "0",
        createTime: "2023-01-01 12:00:00",
      },
      {
        roleId: 2,
        roleName: "普通角色",
        roleKey: "common",
        roleSort: 2,
        status: "0",
        createTime: "2023-01-02 12:00:00",
      },
      {
        roleId: 3,
        roleName: "测试角色",
        roleKey: "test",
        roleSort: 3,
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
  getRoleList();
};

// 重置按钮操作
const resetQuery = () => {
  queryParams.roleName = "";
  queryParams.roleKey = "";
  queryParams.status = "";
  handleQuery();
};

// 新增角色按钮操作
const handleAdd = () => {
  ElMessage.success("新增角色功能待实现");
};

// 修改角色按钮操作
const handleEdit = (row) => {
  ElMessage.success(`修改角色：${row.roleName}`);
};

// 分配权限按钮操作
const handlePermission = (row) => {
  ElMessage.success(`分配权限：${row.roleName}`);
};

// 删除角色按钮操作
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除角色 ${row.roleName} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage.success(`删除角色：${row.roleName}`);
    })
    .catch(() => {});
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
