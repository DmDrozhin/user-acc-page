<script lang="ts" setup>
import { ref, watch } from "vue";
import { Cropper } from "vue-advanced-cropper";
import type { CropperResult } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const props = defineProps<{
  file: File;
}>();

const emit = defineEmits<{
  (e: "done", data: string): void;
  (e: "cancel"): void;
}>();

const image = ref<string | null>(null);
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);

watch(
  () => props.file,
  (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => (image.value = e.target?.result as string);
    reader.readAsDataURL(file);
  },
  { immediate: true }
);

function doCrop() {
  if (!cropperRef.value) return;

  const result: CropperResult | null = cropperRef.value.getResult();

  if (result?.canvas) {
    const dataUrl = result.canvas.toDataURL("image/png");
    emit("done", dataUrl);
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-window">
      <h3>Редактирование аватарки</h3>

      <div class="cropper-box">
        <cropper
          ref="cropperRef"
          v-if="image"
          :src="image"
          :stencil-props="{ aspectRatio: 1 }"
        />
      </div>

      <div class="actions">
        <button @click="emit('cancel')">Отмена</button>
        <button class="primary" @click="doCrop">Готово</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-window {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 400px;
}

.cropper-box {
  width: 100%;
  height: 300px;
  margin-top: 12px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.primary {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}
</style>
