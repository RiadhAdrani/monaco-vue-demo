import "./style.css";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import MonacoVue from "./Monaco.vue";
import AppVue from "./App.vue";
import LayoutVue from "./Layout.vue";
import CKEVue from "./CKE.vue";

const routes = [
  { path: "/", component: AppVue },
  { path: "/cke", component: CKEVue },
  { path: "/monaco", component: MonacoVue },
];

const router = createRouter({ history: createWebHashHistory(), routes });
const app = createApp(LayoutVue);

app.use(router);
app.mount("#app");
