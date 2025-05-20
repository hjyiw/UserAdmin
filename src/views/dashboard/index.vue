<template>
  <div class="dashboard-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统信息</span>
        </div>
      </template>
      <div class="dashboard-info">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="info-card">
              <template #header>
                <div class="card-header">
                  <el-icon><User /></el-icon>
                  <span>用户总数</span>
                </div>
              </template>
              <div class="card-content">
                <span class="num">{{ userCount }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="info-card">
              <template #header>
                <div class="card-header">
                  <el-icon><UserFilled /></el-icon>
                  <span>角色总数</span>
                </div>
              </template>
              <div class="card-content">
                <span class="num">{{ roleCount }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="info-card">
              <template #header>
                <div class="card-header">
                  <el-icon><OfficeBuilding /></el-icon>
                  <span>部门总数</span>
                </div>
              </template>
              <div class="card-content">
                <span class="num">{{ deptCount }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>系统公告</span>
        </div>
      </template>
      <div class="notice-list">
        <el-timeline>
          <el-timeline-item
            v-for="(notice, index) in notices"
            :key="index"
            :timestamp="notice.time"
            :type="notice.type"
          >
            {{ notice.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 模拟数据
const userCount = ref(108);
const roleCount = ref(5);
const deptCount = ref(12);

const notices = ref([
  {
    content: "系统正式上线",
    time: "2023-10-01",
    type: "success",
  },
  {
    content: "新增用户管理功能",
    time: "2023-09-15",
    type: "primary",
  },
  {
    content: "系统维护通知",
    time: "2023-09-01",
    type: "warning",
  },
  {
    content: "系统测试阶段",
    time: "2023-08-15",
    type: "info",
  },
]);
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .card-header {
    display: flex;
    align-items: center;

    .el-icon {
      margin-right: 10px;
    }
  }

  .dashboard-info {
    .info-card {
      .card-content {
        text-align: center;
        padding: 20px 0;

        .num {
          font-size: 36px;
          font-weight: bold;
          color: #409eff;
        }
      }
    }
  }

  .notice-list {
    padding: 10px;
  }
}
</style>
