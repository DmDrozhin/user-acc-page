<script setup lang="ts">
  import { ref } from 'vue';
  import VueCropper from 'vue-cropperjs';
  import '@/styles/cropper.css';

  interface Props {
    modelValue?: string | null;
    maxSizeMB?: number; // Максимальный размер файла в МБ
  }

  const props = withDefaults(defineProps<Props>(), {
    maxSizeMB: 5 // Default = 5MB limit
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void;
    (e: 'cropped', file: Blob): void;
  }>();

  const imageUrl = ref<string | null>(props.modelValue ?? null);

  interface CropperLike {
    getCroppedCanvas(options?: {
      width?: number;
      height?: number;
      fillColor?: string;
      destroy?(): void;
      replace?(url: string): void;
      imageSmoothingEnabled?: boolean;
      imageSmoothingQuality?: 'low' | 'medium' | 'high';
    }): HTMLCanvasElement;
  }
  interface VueCropperInstance {
    cropper: CropperLike;
  }
  const cropperRef = ref<VueCropperInstance | null>(null);

  const isDragActive = ref(false);
  const errorMessage = ref<string | null>(null);

  /**
   * Проверка размера файла
   */
  function validateFileSize(file: File): boolean {
    const maxBytes = props.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      errorMessage.value = `Файл слишком большой. Максимальный размер: ${props.maxSizeMB} MB`;
      return false;
    }
    errorMessage.value = null;
    return true;
  }

  /**
   * Общий метод загрузки файла
   */
  function loadFile(file: File) {
    if (!validateFileSize(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Загрузка через обычный input
   */
  function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    loadFile(file);
  }

  /**
   * Drag events
   */
  function onDragOver() {
    isDragActive.value = true;
  }

  function onDragLeave() {
    isDragActive.value = false;
  }

  /**
   * Drop event
   */
  function onDrop(event: DragEvent) {
    isDragActive.value = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    loadFile(file);
  }

  /**
   * Обрезка изображения
   */
  function cropImage() {
    const cropper = cropperRef.value?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    // canvas может быть null в теории, но для cropperjs он возвращает HTMLElement
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return;

      emit('cropped', blob);

      const base64 = canvas.toDataURL('image/png');
      emit('update:modelValue', base64);
    }, 'image/png');
  }
</script>

<template>
  <div class="avatar-cropper">
    <!-- DRAG & DROP AREA -->
    <div
      class="drop-area"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'drop-area--active': isDragActive }">
      <p v-if="!imageUrl">Перетащите файл сюда или кликните для загрузки</p>

      <input type="file" accept="image/*" class="file-input" @change="onFileChange" />
    </div>

    <!-- ERROR MESSAGE -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- CROPPER -->
    <div v-if="imageUrl" class="cropper-container">
      <VueCropper
        ref="cropperRef"
        :src="imageUrl"
        :aspect-ratio="1"
        :view-mode="1"
        drag-mode="move"
        autoCropArea="1"
        background="false"
        responsive="true"
        style="height: 300px; width: 300px" />
    </div>

    <!-- CROP BUTTON -->
    <button v-if="imageUrl" @click="cropImage">Обрезать и сохранить</button>
  </div>
</template>

<style scoped>
  .avatar-cropper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* DRAG & DROP ZONE */
  .drop-area {
    border: 2px dashed #aaa;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    position: relative;
    border-radius: 10px;
    transition: 0.2s;
  }

  .drop-area--active {
    border-color: #409eff;
    background: #eef7ff;
  }

  .file-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  /* ERROR */
  .error {
    color: #ff4d4f;
    font-size: 14px;
  }

  /* CROPPER */
  .cropper-container {
    border: 1px solid #ddd;
    overflow: hidden;
    max-width: 300px;
  }
</style>
