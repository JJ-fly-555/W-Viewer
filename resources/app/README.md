# Neutralino + Vue + Vite (resources/app)

开发：

```bash
cd resources/app
npm install
npm run dev
```

将 Neutralino 指向 Vite 开发服务器：在项目根的 `neutralino.config.json` 中，将 `applicationUrl` 设置为 `http://127.0.0.1:5173`（或你运行的地址），然后回到项目根运行：

```bash
cd ../..
neu run
```

生产构建并替换 Neutralino 资源：

```bash
cd resources/app
npm run build
# 回到项目根并复制 dist 到 resources/app（替换旧文件）
# 注意：请备份原 resources/app 中的必要文件（如 neutralino.js）如果需要
cp -r dist/* ../..
cd ../..
neu build --release
```
