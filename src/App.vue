<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// 回到顶部按钮显示状态
const showBackToTop = ref(false);

// 滚动事件处理
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="container">
    <header>
      <h1>动物森友会目录</h1>
    </header>

    <RouterView />

    <!-- 回到顶部按钮 -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="back-to-top"
      aria-label="回到顶部"
    >
      ↑
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

h1 {
  color: var(--primary-color);
  font-size: 2.5em;
  margin: 0;
}

.back-to-top {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  width: 50px;
  height: 50px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: var(--transition-normal);
  z-index: 1000;
}

.back-to-top:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style>
