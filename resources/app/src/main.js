import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { init } from "@neutralinojs/lib";

init();
createApp(App).mount("#app");
