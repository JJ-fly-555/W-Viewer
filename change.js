const fs = require("fs");
const path = require("path");

// 源文件路径
const sourcePath =
  "G:\\SteamLibrary\\steamapps\\common\\wallpaper_engine\\bin\\workshopcache.json";
// 目标文件路径
const targetPath = path.join(__dirname, "workshopcache.json");

// 先复制源文件到当前目录
if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, targetPath);
  console.log("已从源路径复制 workshopcache.json 到当前目录");
} else {
  console.log("源文件不存在，使用当前目录的 workshopcache.json");
}

// 读取同目录下的 workshopcache.json
const data = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

// 处理 wallpapers 数组中的每个对象
if (data.wallpapers && Array.isArray(data.wallpapers)) {
  data.wallpapers.forEach((item) => {
    if (item.file && item.preview) {
      // 从 file 路径提取目录部分
      // 例如: "G:/SteamLibrary/steamapps/workshop/content/431960/826403033/The Last of Us HDR (mute).mp4"
      // 提取: "G:/SteamLibrary/steamapps/workshop/content/431960/826403033/"
      const lastSlashIndex = item.file.lastIndexOf("/");
      const dirPath = item.file.substring(0, lastSlashIndex + 1);

      // 获取 preview 文件名（可能是 preview.jpg 或 preview.gif）
      const previewFileName = item.preview.endsWith("preview.jpg")
        ? "preview.jpg"
        : item.preview.endsWith("preview.gif")
          ? "preview.gif"
          : "preview.jpg";

      // 替换 preview 为本地路径
      item.preview = dirPath + previewFileName;
    }
  });
}

// 写回文件
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), "utf-8");

console.log("处理完成！共处理 " + data.wallpapers.length + " 个对象");
