<script setup lang="ts">
import { editor } from "monaco-editor";
import { onMounted, onBeforeUnmount, ref } from "vue";

const lang = "typescript";
const root = ref<HTMLElement>(undefined as unknown as HTMLElement);

onMounted(() => {
  // create editor
  var monaco = editor.create(root.value, {
    value: "function hello() {\n  alert('Hello Monaco!');\n}\n\nhello();",
    language: lang,
    theme: "UTheme",
    fontFamily: "ui-monospace",
    fontSize: 20,
    automaticLayout: true,
  })!;

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
