<template>
  <div class="title-bar-container">
    <div class="title-bar" @mousedown="handleDragStart">
      <div class="title">
        <div class="logo">
          <img :src="Logo" alt="" width="22px" height="22px" />
        </div>

        <div class="menu-controls">
          <button class="control-btn file" @click="handleFile" title="选择文件">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M3 8L9.00319 2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8ZM10 4V9H5V20H19V4H10Z">
              </path>
            </svg>
          </button>
          <button class="control-btn refresh" @click="handleRefresh" title="刷新列表">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 4C9.4095 4 7.10606 5.23053 5.64274 7.14274L8 9.5H2V3.5L4.21863 5.71863C6.05061 3.452 8.85558 2 12 2 17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4ZM4 12C4 16.4183 7.58172 20 12 20 14.5905 20 16.894 18.7695 18.3573 16.8573L16 14.5 22 14.5V20.5L19.7814 18.2814C17.9494 20.548 15.1444 22 12 22 6.47715 22 2 17.5228 2 12H4Z">
              </path>
            </svg>
          </button>
          <button class="control-btn toggle-theme" @click="toggleTheme" title="切换主题">
            <svg v-if="!isDark" class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 21.9967C6.47715 21.9967 2 17.5196 2 11.9967C2 6.47386 6.47715 1.9967 12 1.9967C17.5228 1.9967 22 6.47386 22 11.9967C22 17.5196 17.5228 21.9967 12 21.9967ZM5.32889 16.422C6.76378 18.5675 9.20868 19.9803 11.9836 19.9803C16.4018 19.9803 19.9836 16.3985 19.9836 11.9803C19.9836 9.2053 18.5707 6.76034 16.4251 5.32547C17.2705 8.35324 16.5025 11.7369 14.1213 14.1181C11.7401 16.4993 8.3566 17.2672 5.32889 16.422Z">
              </path>
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 21.9967C6.47715 21.9967 2 17.5196 2 11.9967C2 6.47386 6.47715 1.9967 12 1.9967C17.5228 1.9967 22 6.47386 22 11.9967C22 17.5196 17.5228 21.9967 12 21.9967ZM12 19.9967C16.4183 19.9967 20 16.415 20 11.9967C20 7.57843 16.4183 3.9967 12 3.9967C7.58172 3.9967 4 7.57843 4 11.9967C4 16.415 7.58172 19.9967 12 19.9967ZM7.00035 15.316C9.07995 15.1646 11.117 14.2939 12.7071 12.7038C14.2972 11.1137 15.1679 9.07666 15.3193 6.99706C15.6454 7.21408 15.955 7.46642 16.2426 7.75406C18.5858 10.0972 18.5858 13.8962 16.2426 16.2393C13.8995 18.5825 10.1005 18.5825 7.75736 16.2393C7.46971 15.9517 7.21738 15.6421 7.00035 15.316Z">
              </path>
            </svg>
          </button>
          <button :class="{ pushpin: isPinned, 'control-btn': true }" @click="handlePushpin" title="固定窗口">
            <svg v-if="!isPinned" class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18 3V5H17V11L19 14V16H13V23H11V16H5V14L7 11V5H6V3H18ZM9 5V11.6056L7.4037 14H16.5963L15 11.6056V5H9Z">
              </path>
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 3V5H17V11L19 14V16H13V23H11V16H5V14L7 11V5H6V3H18Z"></path>
            </svg>
          </button>
          <button :class="{ active: isFiltering, 'control-btn': true, filter: true }" @click="handleFilter"
            title="条件筛选">
            <svg v-if="!isFiltering" class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 4V6H20L15 13.5V22H9V13.5L4 6H3V4H21ZM6.4037 6L11 12.8944V20H13V12.8944L17.5963 6H6.4037Z">
              </path>
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 4V6H20L14 15V22H10V15L4 6H3V4H21Z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="window-controls">
        <button class="control-btn minimize" @click="handleMinimize">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 11H5V13H19V11Z"></path>
          </svg>
        </button>
        <button class="control-btn maximize" @click="handleMaximize">
          <svg v-if="isMaximized" class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 7H22V9H16V3H18V7ZM8 9H2V7H6V3H8V9ZM18 17V21H16V15H22V17H18ZM8 15V21H6V17H2V15H8Z"></path>
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 3V5H4V9H2V3H8ZM2 21V15H4V19H8V21H2ZM22 21H16V19H20V15H22V21ZM22 9H20V5H16V3H22V9Z"></path>
          </svg>
        </button>
        <button class="control-btn close" @click="handleClose">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z">
            </path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 筛选菜单 -->
    <Transition name="dropdown">
      <div v-show="isFiltering" class="filter-menu" @click.stop>
        <div class="filter-menu-content">
          <!-- 排序区域 -->
          <div class="sort-section">
            <h4 class="filter-title">排序</h4>
            <div class="sort-select-wrapper">
              <select v-model="sortBy" class="sort-select">
                <option v-for="sort in sortOptions" :key="sort.value" :value="sort.value" class="sort-select-option">
                  {{ sort.label }}
                </option>
              </select>
              <div class="sort-select-arrow">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
            </div>
            <div class="sort-direction">
              <button class="direction-btn" @click="handleChangeSort" :title="sortOrder === 'desc' ? '降序' : '升序'"
                :class="{ change: sortOrder === 'desc' }">
                <svg class="icon" viewBox="7 7 10 10" fill="currentColor">
                  <path d="M7 14l5-5 5 5H7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 分隔线 -->
          <div class="menu-divider"></div>

          <!-- 筛选区域 -->
          <div class="filter-content">
            <div class="filter-section">
              <h4 class="filter-title">类型筛选</h4>
              <div class="filter-options">
                <label v-for="type in filterTypes" :key="type.value" class="filter-option">
                  <input type="checkbox" v-model="selectedTypes" :value="type.value" />
                  <span>{{ type.label }}</span>
                </label>
              </div>
            </div>

            <div class="filter-section">
              <h4 class="filter-title">评级筛选</h4>
              <div class="filter-options">
                <label v-for="ageCategory in filterAgeCategories" :key="ageCategory.value" class="filter-option">
                  <input type="checkbox" v-model="selectedAgeCategories" :value="ageCategory.value" />
                  <span>{{ ageCategory.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <button class="filter-btn reset" @click="resetFilters">重置</button>
          <button class="filter-btn apply" @click="applyFilters">应用</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { window, app, os, filesystem, storage } from "@neutralinojs/lib";
import { useTheme } from "../composables/useTheme";
import Logo from "../../../icons/appIcon.png";
import { ref, onMounted } from "vue";

const { isDark, toggleTheme } = useTheme();

const props = defineProps({
  refresh: {
    type: Function,
    default: () => { },
  },
});

const handleDragStart = async (e) => {
  if (e.button !== 0) return;
  const target = e.target;
  if (
    target.classList.contains("control-btn") ||
    target.closest(".window-controls") ||
    target.closest(".menu-controls")
  ) {
    return;
  }
  await window.beginDrag();
};

const handleMinimize = async () => {
  await window.minimize();
};

const isMaximized = ref(false);
const handleMaximize = async () => {
  if (await window.isMaximized()) {
    await window.unmaximize();
  } else {
    await window.maximize();
  }
  isMaximized.value = await window.isMaximized();
};

const handleClose = async () => {
  app.exit(0);
};

const isPinned = ref(false);
const handlePushpin = async () => {
  isPinned.value = !isPinned.value;
  // TODO: 实现置顶功能
  await window.setAlwaysOnTop(isPinned.value);
};

const handleFile = async () => {
  // // TODO: 实现文件功能
  let filePath = (
    await os.showOpenDialog("请选取  workshopcache.json", {
      filters: [{ name: "JSON文件", extensions: ["JSON"] }],
    })
  )[0];
  await storage.setData("filePath", JSON.stringify(filePath));
};
onMounted(async () => {
  await handleRefresh();
  selectedTypes.value = JSON.parse(
    (await storage.getData("filters_types")) || "[]",
  );
  selectedAgeCategories.value = JSON.parse(
    (await storage.getData("filters_ageCategories")) || "[]",
  );
  sortBy.value = (await storage.getData("sort_by")) || "subscriptiondate";
  sortOrder.value = (await storage.getData("sort_order")) || "desc";
  applyFilters();
});
const handleRefresh = async () => {
  // TODO: 实现刷新功能
  props.refresh();
};

const isFiltering = ref(false);
const handleFilter = () => {
  isFiltering.value = !isFiltering.value;
};

// 筛选类型选项
const filterTypes = [
  { label: "视频", value: "video" },
  { label: "场景", value: "scene" },
  { label: "应用", value: "application" },
  { label: "网页", value: "web" },
];

// 筛选年龄分类选项
const filterAgeCategories = [
  { label: "G", value: "Everyone" },
  { label: "R13", value: "Questionable" },
  { label: "R18", value: "Mature" },
];

// 排序选项
const sortOptions = [
  { label: "订阅日期", value: "subscriptiondate" },
  { label: "文件大小", value: "filesize" },
];

// 选中的类型
const selectedTypes = ref(["video", "scene", "application", "web"]);
// 选中的年龄分类
const selectedAgeCategories = ref(["Everyone", "Questionable", "Mature"]);

// 排序字段和方向
const sortBy = ref("subscriptiondate");
const sortOrder = ref("desc"); // 默认降序
// 切换排序方向
const handleChangeSort = () => {
  sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
};

// 重置筛选
const resetFilters = () => {
  selectedTypes.value = ["video", "scene", "application", "web"];
  selectedAgeCategories.value = ["Everyone", "Questionable", "Mature"];
  sortBy.value = "subscriptiondate";
  sortOrder.value = "desc";
};

// 应用筛选
const applyFilters = async () => {
  // 发送筛选事件给父组件
  emit("applyFilters", {
    types: selectedTypes.value || [],
    ageCategories: selectedAgeCategories.value || [],
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  });
  isFiltering.value = false;
  await storage.setData(
    "filters_types",
    JSON.stringify(selectedTypes.value || []),
  );
  await storage.setData(
    "filters_ageCategories",
    JSON.stringify(selectedAgeCategories.value || []),
  );
  await storage.setData("sort_by", sortBy.value);
  await storage.setData("sort_order", sortOrder.value);
};

const emit = defineEmits(["applyFilters"]);

// 对外暴露方法，供父组件调用以关闭筛选菜单
defineExpose({
  closeFilter: () => {
    isFiltering.value = false;
  },
});
</script>

<style scoped>
.title-bar-container {
  position: relative;
  width: 100%;
}

.title-bar {
  height: 32px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 12px;
  width: 100%;
  user-select: none;
  cursor: default;
}

.title {
  font-size: 14px;
  color: var(--text-primary);
  cursor: default;
  display: flex;
  gap: 3px;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }
}

.window-controls,
.menu-controls {
  display: flex;
  gap: 3px;
}

.control-btn {
  width: 34px;
  height: 26px;
  border-radius: 6px;
  border: none;
  cursor: default;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text-primary);

  .icon {
    width: 14px;
    height: 14px;
    font-size: 16px;
  }
}

.control-btn:hover {
  background: var(--bg-tertiary);
}

.control-btn.close:hover {
  background: #ff5f57;

  .icon {
    filter: invert(1);
  }
}

.control-btn.pushpin {
  background: var(--bg-tertiary);
}

.control-btn.filter.active {
  background: var(--bg-tertiary);
}

/* 筛选菜单样式 */
.filter-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: fit-content;
}

.filter-menu-content {
  display: flex;
  gap: 20px;
}

.sort-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
  padding-right: 12px;
}

.sort-select-wrapper {
  position: relative;
  display: inline-block;
  /* background: var(); */
  /* border: 1px solid var(--border-color); */
}

.sort-select {
  width: 100%;
  padding: 6px 32px 6px 12px;
  font-size: 13px;
  font-family: inherit;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
}

.sort-select:focus {
  box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.2);
}

.sort-select-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-secondary);

  .icon {
    width: 12px;
    height: 12px;
  }
}

.sort-direction {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.direction-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background: var(--bg-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.direction-btn:hover {
  background: var(--bg-hover);
}

.direction-btn.change {
  transform: rotate(180deg);
}

.direction-btn .icon {
  width: 100%;
  height: 100%;
}

.menu-divider {
  width: 1px;
  background: var(--border-color);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-color);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
}

.filter-option input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.filter-btn {
  padding: 6px 16px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.filter-btn.reset {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.filter-btn.reset:hover {
  background: var(--bg-hover);
}

.filter-btn.apply {
  background: var(--accent-color);
  color: white;
}

.filter-btn.apply:hover {
  opacity: 0.9;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
