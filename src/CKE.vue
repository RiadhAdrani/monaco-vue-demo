<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted, VNodeRef } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const editor = ref<ClassicEditor>(null as unknown as ClassicEditor);
const el = ref<VNodeRef>(null as unknown as VNodeRef);

onMounted(() => {
  ClassicEditor.create(el.value, {
    codeBlock: {
      indentSequence: "",
      languages: [{ language: "js", label: "JavaScript" }],
    },
  }).then((ckeditor) => {
    editor.value = ckeditor;
  });
});

onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>

<template>
  <div class="ckeditor" ref="el" />
</template>
