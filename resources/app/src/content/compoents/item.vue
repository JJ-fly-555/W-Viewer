<template>
  <div class="item-card" @dblclick="handleDoubleClick(data.type, data.file)">
    <div class="item-image-wrapper" @dragstart.prevent @selectstart.prevent>
      <LazyImage :src="data.preview" :alt="data.name" />
    </div>
    <div class="item-info">
      <div
        class="item-name-wrapper"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
      >
        <div
          ref="textRef"
          class="item-name"
          :class="{
            'is-scrolling': isScrolling && !isPaused,
            'is-paused': isPaused,
          }"
        >
          {{ data.title }}
        </div>
      </div>
      <div class="item-meta">
        <span class="item-type">{{ formatType(data.type) }}</span>
        <span class="item-date">{{ formatDate(data.subscriptiondate) }}</span>
        <span class="item-size">{{ data.filesizelabel }}</span>
      </div>
    </div>
    <div class="item-options" @dblclick.stop>
      <button class="option-btn" @click="handleOpen(data.type, data.file)">
        打开
      </button>
      <button class="option-btn" @click="handleFolder(data.file)">
        文件夹
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from "vue";
import LazyImage from "../../components/LazyImage.vue";
import { os } from "@neutralinojs/lib";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const textRef = ref(null);
const isScrolling = ref(false);
const isPaused = ref(false);
const isHovering = ref(false);
const isLongPressing = ref(false);
let scrollTimer = null;
let pauseTimer = null;
let longPressTimer = null;

const checkTextOverflow = () => {
  if (textRef.value) {
    return textRef.value.scrollWidth > textRef.value.clientWidth;
  }
  return false;
};

const startScroll = () => {
  if (!checkTextOverflow()) return;

  if (textRef.value) {
    textRef.value.style.transition = "transform 0s linear";
    textRef.value.style.transform = "translateX(0)";

    nextTick(() => {
      const textWidth = textRef.value.scrollWidth;
      const containerWidth = textRef.value.clientWidth;
      const distance = textWidth - containerWidth;

      if (distance > 0) {
        textRef.value.style.transition = `transform ${distance * 0.05}s linear`;
        textRef.value.style.transform = `translateX(-${distance}px)`;
      }
    });
  }
};

const resetText = () => {
  if (textRef.value) {
    textRef.value.style.transition = "transform 0.3s ease";
    textRef.value.style.transform = "translateX(0)";
  }
};

const handleMouseEnter = () => {
  isHovering.value = true;

  // 清除之前的定时器
  if (pauseTimer) {
    clearTimeout(pauseTimer);
    pauseTimer = null;
  }

  // 开始滚动
  scrollTimer = setTimeout(() => {
    if (isHovering.value) {
      isScrolling.value = true;
      isPaused.value = false;
      startScroll();
    }
  }, 500);
};

const handleMouseLeave = () => {
  isHovering.value = false;

  // 清除滚动定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer);
    scrollTimer = null;
  }

  // 0.5s 后恢复默认状态
  pauseTimer = setTimeout(() => {
    isScrolling.value = false;
    isPaused.value = false;
    resetText();
  }, 500);
};

const handleMouseDown = () => {
  isPaused.value = true;
};

const handleMouseUp = () => {
  isPaused.value = false;

  // 继续滚动
  if (isHovering.value && isScrolling.value) {
    startScroll();
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateStr;
  }
};

const formatType = (type) => {
  if (!type) return "";
  type = type.toLowerCase();
  switch (type) {
    case "scene":
      type = "场景";
      break;
    case "video":
      type = "视频";
      break;
    case "application":
      type = "应用";
      break;
    case "web":
      type = "网页";
      break;
  }
  return type;
};

const handleOpen = (t, f) => {
  t = t.toLowerCase();
  if (t !== "video") return "pause";
  os.open(f);
};

const handleFolder = (f) => {
  const lastSlashIndex = f.lastIndexOf("/");
  const dirPath = f.substring(0, lastSlashIndex + 1);
  os.open(dirPath);
};

const handleDoubleClick = (type, file) => {
  console.log(111);
  if (handleOpen(type, file) !== "pause") return;
  handleFolder(file);
};

onUnmounted(() => {
  if (scrollTimer) clearTimeout(scrollTimer);
  if (pauseTimer) clearTimeout(pauseTimer);
  if (longPressTimer) clearTimeout(longPressTimer);
});
</script>

<style scoped>
.item-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.item-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--bg-primary);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  user-drag: none;
}

.item-image-wrapper.is-long-pressing {
  cursor: default;
}

.item-image-wrapper :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.item-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.item-name-wrapper {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  margin-bottom: 8px;
}

.item-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
  display: inline-block;
  white-space: nowrap;
  will-change: transform;
  /* 使用父容器传递的 item 宽度 */
  width: 210px;
}

.item-name.is-scrolling {
  /* 滚动时有动画效果 */
}

.item-name.is-paused {
  /* 暂停时保持当前位置 */
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.item-type,
.item-date,
.item-size {
  background: var(--bg-primary);
  padding: 2px 6px;
  border-radius: 4px;
}

.item-options {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-top: 1px solid var(--border-color);
}

.option-btn {
  flex: 1;
  padding: 6px 8px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-btn:hover {
  background: var(--bg-hover);
}

.option-btn svg {
  width: 16px;
  height: 16px;
}

.option-btn.pinned {
  color: #007bff;
}
</style>
