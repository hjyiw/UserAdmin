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
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="部门状态"
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
      <el-table
        :data="deptList"
        style="width: 100%"
        v-loading="loading"
        row-key="deptId"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="部门名称" prop="deptName" />
        <el-table-column label="排序" prop="orderNum" width="100" />
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
            <el-button type="primary" link @click="handleAdd(scope.row)"
              >新增</el-button
            >
            <el-button type="primary" link @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" link @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 加载状态
const loading = ref(false);
// 部门列表数据
const deptList = ref([]);

// 查询参数
const queryParams = reactive({
  deptName: "",
  status: "",
});

// 获取部门列表
const getDeptList = () => {
  loading.value = true;
  // 这里应该调用API获取部门列表
  // 模拟数据
  setTimeout(() => {
    deptList.value = [
      {
        deptId: 1,
        deptName: "总公司",
        orderNum: 1,
        status: "0",
        createTime: "2023-01-01 12:00:00",
        children: [
          {
            deptId: 2,
            deptName: "研发部门",
            orderNum: 1,
            status: "0",
            createTime: "2023-01-02 12:00:00",
          },
          {
            deptId: 3,
            deptName: "测试部门",
            orderNum: 2,
            status: "0",
            createTime: "2023-01-03 12:00:00",
          },
          {
            deptId: 4,
            deptName: "运维部门",
            orderNum: 3,
            status: "1",
            createTime: "2023-01-04 12:00:00",
          },
        ],
      },
    ];
    loading.value = false;
  }, 500);
};

// 搜索按钮操作
const handleQuery = () => {
  getDeptList();
};

// 重置按钮操作
const resetQuery = () => {
  queryParams.deptName = "";
  queryParams.status = "";
  handleQuery();
};

// 新增部门按钮操作
const handleAdd = (row) => {
  if (row) {
    ElMessage.success(`新增 ${row.deptName} 的子部门`);
  } else {
    ElMessage.success("新增顶级部门");
  }
};

// 修改部门按钮操作
const handleEdit = (row) => {
  ElMessage.success(`修改部门：${row.deptName}`);
};

// 删除部门按钮操作
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除部门 ${row.deptName} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage.success(`删除部门：${row.deptName}`);
    })
    .catch(() => {});
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
