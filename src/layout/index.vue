<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container">
      <div class="logo-container">
        <h1 class="logo-title">用户管理系统</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :unique-opened="true"
        :collapse="false"
        router
      >
        <!-- 动态渲染菜单 -->
        <template v-for="(route, index) in routes" :key="index">
          <!-- 没有子路由的菜单项 -->
          <el-menu-item
            v-if="!route.children || route.children.length === 0"
            :index="route.path"
          >
            <el-icon v-if="route.meta && route.meta.icon"
              ><component :is="route.meta.icon"
            /></el-icon>
            <template #title>{{
              route.meta ? route.meta.title : "未命名"
            }}</template>
          </el-menu-item>

          <!-- 只有一个子路由的菜单项 -->
          <el-menu-item
            v-else-if="route.children.length === 1"
            :index="route.path + '/' + route.children[0].path"
          >
            <el-icon
              v-if="route.children[0].meta && route.children[0].meta.icon"
            >
              <component :is="route.children[0].meta.icon" />
            </el-icon>
            <template #title>{{
              route.children[0].meta ? route.children[0].meta.title : "未命名"
            }}</template>
          </el-menu-item>

          <!-- 有多个子路由的菜单项 -->
          <el-sub-menu v-else :index="route.path">
            <template #title>
              <el-icon v-if="route.meta && route.meta.icon"
                ><component :is="route.meta.icon"
              /></el-icon>
              <span>{{ route.meta ? route.meta.title : "未命名" }}</span>
            </template>

            <!-- 渲染子菜单 -->
            <el-menu-item
              v-for="child in getVisibleChildren(route)"
              :key="child.path"
              :index="route.path + '/' + child.path"
            >
              <el-icon v-if="child.meta && child.meta.icon"
                ><component :is="child.meta.icon"
              /></el-icon>
              <template #title>{{
                child.meta ? child.meta.title : "未命名"
              }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>

    <!-- 主区域 -->
    <div class="main-container">
      <!-- 头部 -->
      <div class="header">
        <div class="left-menu">
          <el-icon class="hamburger"><Fold /></el-icon>
        </div>
        <div class="right-menu">
          <el-dropdown>
            <span class="dropdown-link">
              <el-avatar
                size="small"
                :src="
                  userInfo.avatar ||
                  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              />
              <span style="margin-left: 8px">{{
                userInfo.nickname || "用户"
              }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile"
                  >个人中心</el-dropdown-item
                >
                <el-dropdown-item divided @click="handleLogout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { useUserStore, usePermissionStore } from "@/store";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path;
});

// 获取路由
const routes = computed(() => {
  return permissionStore.routes.filter((route) => {
    // 过滤掉隐藏的路由
    return !route.meta || !route.meta.hidden;
  });
});

// 获取可见的子路由
const getVisibleChildren = (route) => {
  if (!route.children) return [];
  return route.children.filter((child) => !child.meta || !child.meta.hidden);
};

// 获取用户信息
const userInfo = computed(() => {
  return userStore.userInfo;
});

// 跳转到个人中心
const goToProfile = () => {
  router.push("/profile");
};

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        // 显示加载状态
        const loadingMessage = ElMessage({
          message: "正在退出...",
          type: "info",
          duration: 0,
        });

        // 调用store中的退出登录方法
        await userStore.logout();

        // 关闭加载提示
        loadingMessage.close();

        // 显示成功提示
        ElMessage.success("退出登录成功");

        // 页面已经在store的logout方法中跳转到登录页
      } catch (error) {
        ElMessage.error("退出登录失败：" + (error.message || "未知错误"));
      }
    })
    .catch(() => {
      // 用户取消退出操作
    });
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;

  .sidebar-container {
    width: 210px;
    height: 100%;
    background-color: #304156;
    transition: width 0.28s;
    overflow-y: auto;

    .logo-container {
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #2b2f3a;

      .logo-title {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
    }

    .el-menu {
      border-right: none;
    }
  }

  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .header {
      height: 50px;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;

      .left-menu {
        .hamburger {
          font-size: 20px;
          cursor: pointer;
        }
      }

      .right-menu {
        .dropdown-link {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
    }

    .app-main {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      background-color: #f0f2f5;
    }
  }
}
</style>
