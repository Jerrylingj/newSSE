<script lang="ts" setup>
import { useUserStore } from '@/store/userStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const route = useRoute()
const IsMain = computed(() => {
  return /^\/shop\/?$/.test(route.fullPath)
})
const { userInfo } = useUserStore()
</script>

<template>
  <div class="container">
    <!-- 侧边栏部分 -->
    <div class="sidebar">
      <!-- 用户信息部分 -->
      <div class="user-info">
        <div class="avatar-container">
          <img :src="userInfo.avatarURL" alt="用户头像" class="avatar">
        </div>
        <div class="user-id">
          {{ userInfo.name }}
        </div>
      </div>

      <!-- 导航按钮部分 -->
      <div class="navigation-buttons">
        <RouterLink to="/shop/myproducts" class="nav-button" v-if="IsMain">
          我的商品
        </RouterLink>
        <RouterLink to="/shop" class="nav-button" v-else>
          返回首页
        </RouterLink>
        <RouterLink to="/chat" class="nav-button">
          私信通知
        </RouterLink>
        <RouterLink to="/shop/sale" class="nav-button">
          发布商品
        </RouterLink>
        <RouterLink to="/" class="nav-button">
          返回主页
        </RouterLink>
      </div>
    </div>

  </div>
</template>

<style scoped>
.sidebar {
  width: 120px;
  background-color: #f8f9fa;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #dee2e6;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 10%;
  overflow: hidden;
  margin-bottom: 15px;
  border: 3px solid #81b3e9;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-id {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.navigation-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.nav-button {
  width: 80%;
  height: 50px;
  margin: 10px 10%;
  border: none;
  border-radius: 8px;
  background-color: #e9ecef;
  color: #212529;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  padding: 0 15px;
}

.nav-button:hover {
  background-color: #dee2e6;
}

.notification-badge {
  position: absolute;
  right: 15px;
  background-color: #dc3545;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  height: fit-content;
}

.main-content {
  flex: 1;
  padding: 20px;
}

@media (min-width: 1000px) {
  .sidebar {
    width: 170px;
    background-color: #f8f9fa;
    padding: 20px 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
}
</style>
