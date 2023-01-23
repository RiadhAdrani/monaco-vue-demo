<script setup lang="ts">
import { editor, languages } from "monaco-editor";
import { onMounted, onBeforeUnmount, ref } from "vue";
import prettier from "prettier";
import typescriptParser from "prettier/parser-typescript";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

const lang = "typescript";
const root = ref<HTMLElement>(undefined as unknown as HTMLElement);

onMounted(() => {
  // initializing workers
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === "json") {
        return new jsonWorker();
      }
      if (label === "css" || label === "scss" || label === "less") {
        return new cssWorker();
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return new htmlWorker();
      }
      if (label === lang || label === "javascript") {
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

  // create editor
  var monaco = editor.create(root.value, {
    value: "function hello() {\n  alert('Hello Monaco!');\n}\n\nhello();",
    language: lang,
    theme: "UTheme",
    fontFamily: "ui-monospace",
    fontSize: 20,
    automaticLayout: true,
  })!;

  // register formatting preference for lang = "typescript"
  languages.registerDocumentFormattingEditProvider(lang, {
    async provideDocumentFormattingEdits(model) {
      const text = prettier.format(model.getValue(), { parser: lang, plugins: [typescriptParser] });
      const range = model.getFullModelRange();

      return [{ range, text }];
    },
  });

  // add save with ctrl+s
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      monaco.getAction("editor.action.formatDocument").run();
    }
  });
});

onBeforeUnmount(() => {
  editor.getModels().forEach((model) => {
    model.dispose();
  });
});
</script>

<template>
  <div class="monaco-page">
    <div class="monaco-root" ref="root" />
  </div>
</template>

<style scoped>
.monaco-page {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.monaco-root {
  flex: 1;
}
</style>
