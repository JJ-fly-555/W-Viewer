<template>
  <div class="content" @click="handleContentClick">
    <VirtualList :wallpaperList="wallpaperFilterList" :item-height="390" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import VirtualList from "../components/VirtualList.vue";
import { window, app, os, filesystem, storage } from "@neutralinojs/lib";
import Message from "../utils/message";

const emit = defineEmits(["refresh", "contentClick"]);

const handleContentClick = () => {
  emit("contentClick");
};
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      types: [],
      ageCategories: [],
    }),
  },
});
const wallpaper = ref([]);
const handleRefresh = async () => {
  try {
    Message.show("刷新中...", { duration: 0 });
    const filePath = JSON.parse(await storage.getData("filePath"));
    wallpaper.value = JSON.parse(
      await filesystem.readFile(filePath),
    ).wallpapers;
    console.log(wallpaperList.value);

    Message.show(`已成功加载${wallpaper.value.length}个项目`);
  } catch (e) {
    Message.show("刷新失败，请检查文件路径");
    console.error(e);
  }
};

const wallpaperList = computed(() => {
  if (!wallpaper.value.length) return [];
  wallpaper.value.forEach((item, index) => {
    const lastDotIndex = item.preview.lastIndexOf(".");
    const result =
      lastDotIndex !== -1 ? item.preview.slice(lastDotIndex + 1) : null;
    const lastSlashIndex = item.file.lastIndexOf("/");
    const dirPath = item.file.substring(0, lastSlashIndex + 1);
    item.preview = dirPath + "preview." + result;

    let tag = "";
    if (item.tags.indexOf("Customizable") !== -1) tag = "Customizable";
    if (item.tags.indexOf("Everyone") !== -1) tag = "Everyone";
    if (item.tags.indexOf("Mature") !== -1) tag = "Mature";

    item.tags = tag;
  });
  return wallpaper.value;
});

const wallpaperFilterList = computed(() => {
  if (!wallpaperList.value.length) return [];
  let res = wallpaperList.value.filter((item) => {
    // console.log()
    if (
      props.filters.types?.length &&
      !props.filters.types.includes(item.type.toLowerCase())
    ) {
      return false;
    }
    if (
      props.filters.ageCategories?.length &&
      !props.filters.ageCategories.includes(item.tags)
    ) {
      return false;
    }
    return true;
  });
  res = res.sort((a, b) => {
    if (props.filters.sortOrder === "desc") {
      return b[props.filters.sortBy] - a[props.filters.sortBy];
    }
    return a[props.filters.sortBy] - b[props.filters.sortBy];
  });

  return res;
});
// 监听 refresh 事件
defineExpose({
  handleRefresh,
});

</script>

<style scoped>
.content {
  flex: 1;
  overflow: hidden;
  color: var(--text-primary);

  height: 100%;
}
</style>
