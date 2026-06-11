<template>
  <div ref="containerRef" class="virtual-list-container">
    <div class="virtual-list-scroll-area" @scroll="handleScroll">
      <!-- 占位容器，用于产生正确的滚动条 -->
      <div
        class="virtual-list-placeholder"
        :style="{ height: totalHeight + 'px' }"
      ></div>

      <!-- 实际渲染的内容 -->
      <div
        class="virtual-list-content"
        :style="{ transform: `translateY(${scrollOffset}px)` }"
      >
        <div
          v-for="item in visibleItems"
          :key="item.workshopid"
          class="virtual-list-item"
        >
          <Item :data="item" :index="item.originalIndex" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import Item from "../content/compoents/item.vue";

const props = defineProps({
  wallpaperList: {
    type: Array,
    default: () => [],
  },
  // itemHeight 现在是估算值，实际高度由CSS决定
  itemHeight: {
    type: Number,
    default: 280,
  },
  bufferRows: {
    type: Number,
    default: 2,
  },
});

const containerRef = ref(null);
const scrollTop = ref(0);
const containerHeight = ref(600);
const containerWidth = ref(1024);

// 动态列数 - 根据容器宽度计算
const columns = computed(() => {
  // 基准：1024px = 4列
  const baseWidth = 1024;
  const baseCols = 4;

  const calculated = Math.round((containerWidth.value / baseWidth) * baseCols);
  return Math.max(2, Math.min(12, calculated));
});

// 计算总行数
const totalRows = computed(() => {
  return Math.ceil(props.wallpaperList.length / columns.value);
});

// 计算总高度（包含所有行）
const totalHeight = computed(() => {
  return totalRows.value * props.itemHeight;
});

// 计算可见区域的起始行
const startRow = computed(() => {
  const start =
    Math.floor(scrollTop.value / props.itemHeight) - props.bufferRows;
  return Math.max(0, start);
});

// 计算可见区域的结束行
const endRow = computed(() => {
  const visibleRows = Math.ceil(containerHeight.value / props.itemHeight);
  return Math.min(
    startRow.value + visibleRows + props.bufferRows * 2,
    totalRows.value,
  );
});

// 可见项目
const visibleItems = computed(() => {
  const startIndex = startRow.value * columns.value;
  const endIndex = Math.min(
    endRow.value * columns.value,
    props.wallpaperList.length,
  );
  return props.wallpaperList.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    originalIndex: startIndex + index,
  }));
});

// 滚动偏移量（让内容跟随滚动条移动）
const scrollOffset = computed(() => {
  console.log(props.itemHeight);
  return startRow.value * props.itemHeight;
  // return 0;
});

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop;
  console.log(startRow.value, endRow.value);
};

const updateContainerDimensions = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
    containerWidth.value = containerRef.value.clientWidth;
    console.log(
      "Container dimensions updated:",
      containerWidth.value,
      "x",
      containerHeight.value,
    );
    console.log(
      "Columns:",
      columns.value,
      "Total rows:",
      totalRows.value,
      "Total height:",
      totalHeight.value,
    );
  }
};

onMounted(() => {
  nextTick(() => {
    updateContainerDimensions();
  });
  window.addEventListener("resize", updateContainerDimensions);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateContainerDimensions);
});

// 监听列数变化，确保高度重新计算
watch(columns, () => {
  console.log("Columns changed to:", columns.value);
});
</script>

<style scoped>
.virtual-list-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.virtual-list-scroll-area {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  /* 自定义滚动条 */
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

/* WebKit 自定义滚动条 */
.virtual-list-scroll-area::-webkit-scrollbar {
  width: 8px;
}

.virtual-list-scroll-area::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 4px;
}

.virtual-list-scroll-area::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

.virtual-list-scroll-area::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

.virtual-list-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  pointer-events: none;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  transition: transform 0s;
}

/* 基础：1024px 及以上显示 4列 */
.virtual-list-item {
  flex: 0 0 calc((100% - 24px) / 4);
  box-sizing: border-box;
}

/* 768px - 1023px：3列 */
@media (max-width: 1023px) {
  .virtual-list-item {
    flex: 0 0 calc((100% - 16px) / 3);
  }
}

/* 512px - 767px：2列 */
@media (max-width: 767px) {
  .virtual-list-item {
    flex: 0 0 calc((100% - 8px) / 2);
  }
}

/* <512px：1列 */
@media (max-width: 511px) {
  .virtual-list-item {
    flex: 0 0 100%;
  }
}

/* 1280px - 1535px：5列 */
@media (min-width: 1280px) and (max-width: 1535px) {
  .virtual-list-item {
    flex: 0 0 calc((100% - 32px) / 5);
  }
}

/* 1536px - 1791px：6列 */
@media (min-width: 1536px) and (max-width: 1791px) {
  .virtual-list-item {
    flex: 0 0 calc((100% - 40px) / 6);
  }
}

/* 1792px - 2047px：7列 */
@media (min-width: 1792px) and (max-width: 2047px) {
  .virtual-list-item {
    flex: 0 0 calc((100% - 48px) / 7);
  }
}

/* >2048px：8列 */
@media (min-width: 2048px) {
  .virtual-list-item {
    flex: 0 0 calc((100% - 56px) / 8);
  }
}
</style>
