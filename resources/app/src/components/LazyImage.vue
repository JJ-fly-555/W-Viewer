<template>
  <div ref="containerRef" class="lazy-image-container">
    <div v-if="!loaded && !error" class="lazy-image-placeholder">
      <div class="loading-spinner"></div>
    </div>
    <img
      v-show="loaded && imageSrc"
      :src="imageSrc"
      :alt="alt"
      class="lazy-image"
      :class="{ 'lazy-image-loaded': loaded }"
      @load="handleLoad"
      @error="handleError"
    />
    <div v-if="error" class="lazy-image-error">
      <span>加载失败</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { filesystem } from "@neutralinojs/lib";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
});

// 缓存不存在的文件路径，避免重复检查
const missingFiles = new Set();
// 缓存已成功加载的图片，避免重复加载
const loadedImages = new Map();

const containerRef = ref(null);
const imageSrc = ref("");
const loaded = ref(false);
const error = ref(false);
const isLoading = ref(false);
let observer = null;
let currentSrc = "";
let loadTimer = null;

const handleLoad = () => {
  loaded.value = true;
  error.value = false;
  isLoading.value = false;
};

const handleError = () => {
  // 静默处理，避免大量报错
  error.value = true;
  loaded.value = false;
  isLoading.value = false;
};

const arrayBufferToBase64 = (buffer) => {
  const chunkSize = 8192;
  let result = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;

  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    result += String.fromCharCode.apply(null, chunk);
  }

  return btoa(result);
};

const loadImage = async () => {
  if (isLoading.value || loaded.value) {
    return;
  }

  // 检查是否是本地文件
  const isLocalFile =
    props.src &&
    (props.src.startsWith("G:/") ||
      props.src.startsWith("C:/") ||
      props.src.startsWith("/") ||
      props.src.startsWith("file://"));

  // 如果是本地文件，检查缓存
  if (isLocalFile) {
    const filePath = props.src.replace("file://", "");

    // 如果已经知道文件不存在，直接返回错误
    if (missingFiles.has(filePath)) {
      error.value = true;
      return;
    }

    // 如果已经加载过，直接使用缓存
    if (loadedImages.has(filePath)) {
      imageSrc.value = loadedImages.get(filePath);
      loaded.value = true;
      return;
    }
  }

  // 重置错误状态，允许重试
  error.value = false;
  isLoading.value = true;
  currentSrc = props.src;

  try {
    if (isLocalFile) {
      const filePath = props.src.replace("file://", "");

      const fileData = await filesystem.readBinaryFile(filePath);

      if (!fileData || fileData.length === 0) {
        throw new Error("Empty file data");
      }

      const base64 = arrayBufferToBase64(fileData);

      let mimeType = "image/jpeg";
      const lowerSrc = props.src.toLowerCase();
      if (lowerSrc.endsWith(".png")) {
        mimeType = "image/png";
      } else if (lowerSrc.endsWith(".gif")) {
        mimeType = "image/gif";
      } else if (lowerSrc.endsWith(".webp")) {
        mimeType = "image/webp";
      } else if (lowerSrc.endsWith(".bmp")) {
        mimeType = "image/bmp";
      } else if (lowerSrc.endsWith(".jpg") || lowerSrc.endsWith(".jpeg")) {
        mimeType = "image/jpeg";
      }

      const dataUrl = `data:${mimeType};base64,${base64}`;

      if (currentSrc === props.src) {
        imageSrc.value = dataUrl;
        loadedImages.set(filePath, dataUrl);
      } else {
        isLoading.value = false;
      }
    } else {
      if (currentSrc === props.src) {
        imageSrc.value = props.src;
      } else {
        isLoading.value = false;
      }
    }
  } catch (e) {
    // 只在开发环境输出错误日志
    if (import.meta.env.DEV) {
      console.error("Failed to load image:", props.src, "-", e.message);
    }
    // 记录不存在的文件
    if (isLocalFile) {
      const filePath = props.src.replace("file://", "");
      missingFiles.add(filePath);
    }
    if (currentSrc === props.src) {
      error.value = true;
    }
    isLoading.value = false;
  }
};

const scheduleLoad = () => {
  // 清除之前的加载定时器
  if (loadTimer) {
    clearTimeout(loadTimer);
    loadTimer = null;
  }

  // 延迟加载，避免快速滚动时频繁触发
  loadTimer = setTimeout(() => {
    loadImage();
  }, 150);
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scheduleLoad();
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "100px",
      threshold: 0.1,
    },
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  if (import.meta.env.DEV) {
    scheduleLoad();
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  if (loadTimer) {
    clearTimeout(loadTimer);
    loadTimer = null;
  }
});

watch(
  () => props.src,
  (newSrc, oldSrc) => {
    if (newSrc !== oldSrc) {
      // 清除之前的加载定时器
      if (loadTimer) {
        clearTimeout(loadTimer);
        loadTimer = null;
      }

      loaded.value = false;
      error.value = false;
      imageSrc.value = "";
      isLoading.value = false;
      currentSrc = "";

      // 重新观察并加载
      if (observer && containerRef.value) {
        observer.observe(containerRef.value);
      } else if (import.meta.env.DEV) {
        scheduleLoad();
      }
    }
  },
);
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lazy-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 3s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lazy-image {
  /* width: 100%; */
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.lazy-image-loaded {
  opacity: 1;
}

.lazy-image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
</style>
