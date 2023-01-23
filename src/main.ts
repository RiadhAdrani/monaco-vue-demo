import "./style.css";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import MonacoVue from "./Monaco.vue";
import AppVue from "./App.vue";
import LayoutVue from "./Layout.vue";
import CKEVue from "./CKE.vue";
import { editor, languages } from "monaco-editor";
import prettier from "prettier";
import typescriptParser from "prettier/parser-typescript";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

const routes = [
  { path: "/", component: AppVue },
  { path: "/cke", component: CKEVue },
  { path: "/monaco", component: MonacoVue },
];

// initializing workers
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

// create new theme
editor.defineTheme("UTheme", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword.ts", foreground: "#0099E5", fontStyle: "bold" },
    { token: "string.ts", foreground: "#34BF49" },
    { token: "identifier.ts", foreground: "#FAAE2B", fontStyle: "italic" },
    { token: "delimiter.bracket.ts", foreground: "#696AF5", fontStyle: "bold" },
    { token: "number.ts", foreground: "#FF4C4C" },
  ],
  colors: {
    "editor.background": "#2B2A2A",
  },
});

// register formatting preference for lang = "typescript"
languages.registerDocumentFormattingEditProvider("typescript", {
  async provideDocumentFormattingEdits(model) {
    const text = prettier.format(model.getValue(), {
      parser: "typescript",
      plugins: [typescriptParser],
    });
    const range = model.getFullModelRange();

    return [{ range, text }];
  },
});

const router = createRouter({ history: createWebHashHistory(), routes });
const app = createApp(LayoutVue);

app.use(router);
app.mount("#app");
