<template>
  <div class="app-container">
    <!-- <div
      class="resize-handle resize-n"
      @mousedown="(e) => startResize(e, 'n')"
    ></div>
    <div
      class="resize-handle resize-s"
      @mousedown="(e) => startResize(e, 's')"
    ></div>
    <div
      class="resize-handle resize-e"
      @mousedown="(e) => startResize(e, 'e')"
    ></div>
    <div
      class="resize-handle resize-w"
      @mousedown="(e) => startResize(e, 'w')"
    ></div>
    <div
      class="resize-handle resize-ne"
      @mousedown="(e) => startResize(e, 'ne')"
    ></div>
    <div
      class="resize-handle resize-se"
      @mousedown="(e) => startResize(e, 'se')"
    ></div>
    <div
      class="resize-handle resize-sw"
      @mousedown="(e) => startResize(e, 'sw')"
    ></div>
    <div
      class="resize-handle resize-nw"
      @mousedown="(e) => startResize(e, 'nw')"
    ></div> -->

    <div>
      <Title ref="titleRef" :refresh="handleRefresh" @applyFilters="applyFilters" />
    </div>
    <div style="flex: 1">
      <Content ref="contentRef" :filters="filters" @contentClick="onContentClick" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Title from "./title/title.vue";
import Content from "./content/content.vue";

const contentRef = ref(null);
const titleRef = ref(null);

const handleRefresh = async () => {
  // 调用 Content 组件的 handle 方法
  if (contentRef.value) {
    contentRef.value.handleRefresh();
  }
};

const filters = ref({});
const applyFilters = (f) => {
  console.log(f);
  filters.value = f;
};

const onContentClick = () => {
  if (titleRef.value && typeof titleRef.value.closeFilter === "function") {
    titleRef.value.closeFilter();
  }
};
</script>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 100;
  transition: background-color 0.2s;
}

.resize-handle:hover {
  background: rgba(64, 158, 255, 0.3);
}

.resize-n {
  top: 0;
  left: 32px;
  right: 32px;
  height: 8px;
  cursor: n-resize;
}

.resize-s {
  bottom: 0;
  left: 32px;
  right: 32px;
  height: 8px;
  cursor: s-resize;
}

.resize-e {
  right: 0;
  top: 32px;
  bottom: 32px;
  width: 8px;
  cursor: e-resize;
}

.resize-w {
  left: 0;
  top: 32px;
  bottom: 32px;
  width: 8px;
  cursor: w-resize;
}

.resize-ne {
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  cursor: ne-resize;
}

.resize-se {
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  cursor: se-resize;
}

.resize-sw {
  bottom: 0;
  left: 0;
  width: 32px;
  height: 32px;
  cursor: sw-resize;
}

.resize-nw {
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  cursor: nw-resize;
}
</style>
