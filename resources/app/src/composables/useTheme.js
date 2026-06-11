import { ref, watch } from "vue";

const isDark = ref(false);

// 初始化主题（从本地存储读取）
if (localStorage.getItem("theme") === "dark") {
  isDark.value = true;
  document.documentElement.classList.add("dark");
}

// 监听主题变化
watch(isDark, (value) => {
  if (value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// 切换主题
export function toggleTheme() {
  isDark.value = !isDark.value;
}

// 获取当前主题状态
export function useTheme() {
  return {
    isDark,
    toggleTheme,
  };
}
