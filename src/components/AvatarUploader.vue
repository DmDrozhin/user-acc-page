<script lang="ts" setup>
  import { ref } from 'vue';
  import AvatarCropperModal from '@/components/AvatarCropperModal.vue';

  const avatar = ref<string | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);

  const isDragOver = ref(false);
  const selectedFile = ref<File | null>(null);

  // ---- Ошибки ----
  const errorMessage = ref<string>(''); // для текста под полем
  const toastMessage = ref<string>(''); // для toast
  let toastTimer: number | null = null;

  // ---- Файл-валидация ----
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
  const MAX_SIZE_MB = 2;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  type Lang = 'uk' | 'en' | 'ru';
  // const currentLang = (navigator.language.slice(0, 2) || 'en') as Lang;
  const currentLang = 'en' as Lang;
  interface UploadMessage {
    invalidType: string;
    tooLarge: string;
    uploadPrompt: string;
  }
  const UPLOAD_MESSAGES: Record<Lang, UploadMessage> = {
    uk: {
      invalidType: `Недопустимий формат. Дозволено: JPG, PNG, WEBP, JPG, SVG.`,
      tooLarge: `Файл занадто великий. Максимум ${MAX_SIZE_MB} MB.`,
      uploadPrompt: 'Завантажте аватар або перетягніть файл'
    },
    en: {
      invalidType: `Invalid format. Allowed: JPG, PNG, WEBP, JPG, SVG.`,
      tooLarge: `File is too large. Maximum ${MAX_SIZE_MB} MB.`,
      uploadPrompt: 'Upload an avatar or drag and drop a file'
    },
    ru: {
      invalidType: `Недопустимый формат. Разрешено: JPG, PNG, WEBP, JPG, SVG.`,
      tooLarge: `Файл слишком большой. Максимум ${MAX_SIZE_MB} MB.`,
      uploadPrompt: 'Загрузите аватар или перетащите файл'
    }
  };

  function showError(msg: string) {
    errorMessage.value = msg;
    showToast(msg);
  }

  function showToast(msg: string) {
    toastMessage.value = msg;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(() => {
      toastMessage.value = '';
    }, 3000);
  }

  function clearError() {
    errorMessage.value = '';
  }

  function validateFile(file: File): boolean {
    clearError();

    if (!ALLOWED_TYPES.includes(file.type)) {
      showError(UPLOAD_MESSAGES[currentLang]?.invalidType || UPLOAD_MESSAGES['en'].invalidType);
      return false;
    }

    if (file.size > MAX_SIZE_BYTES) {
      showError(UPLOAD_MESSAGES[currentLang]?.tooLarge || UPLOAD_MESSAGES['en'].tooLarge);
      return false;
    }

    return true;
  }

  // ---- Файловый диалог ----
  function openFileDialog() {
    if (!avatar.value) {
      fileInput.value?.click();
    }
  }

  // Выбор через input
  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!validateFile(file)) {
      input.value = '';
      return;
    }

    selectedFile.value = file;
  }

  // ---- Drag-and-drop ----
  function onDragOver(e: DragEvent) {
    if (avatar.value) return;
    e.preventDefault();
    isDragOver.value = true;
  }

  function onDragLeave() {
    isDragOver.value = false;
  }

  function onDrop(e: DragEvent) {
    if (avatar.value) return;
    e.preventDefault();
    isDragOver.value = false;

    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    selectedFile.value = file;
  }

  // ---- Приём результата из модалки ----
  function onCropComplete(result: string) {
    avatar.value = result;
    selectedFile.value = null;
    clearError();
  }

  // ---- Удаление аватара ----
  function removeAvatar(e: Event) {
    e.stopPropagation();
    avatar.value = null;
  }
</script>

<template>
  <div class="avatar-uploader">
    <!-- Toast -->
    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>

    <!-- INPUT FILE -->
    <input ref="fileInput" type="file" accept="image/*" class="avatar-uploader__input" @change="onFileChange" />

    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver, disabled: avatar }"
      @click="openFileDialog"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop">
      <template v-if="!avatar">
        <div class="upload-area__placeholder">
          <svg class="upload-area__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M17 17V21H19V17H21L18 14L15 17H17M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 14C6.6 14 3 15.8 3 18V20H12.5C12.2 19.2 12 18.4 12 17.5C12 16.3 12.3 15.2 12.9 14.1C12.3 14.1 11.7 14 11 14" />
          </svg>
          <div>{{ UPLOAD_MESSAGES[currentLang]?.uploadPrompt || UPLOAD_MESSAGES['en'].uploadPrompt }}</div>
        </div>
      </template>

      <template v-else>
        <div class="avatar__wrapper">
          <img :src="avatar" class="avatar__image" alt="user avatar" />
          <button class="delete-btn" @click="removeAvatar" aria-label="Remove avatar">✕</button>
        </div>
      </template>
    </div>
    <!-- Ошибка под полем -->
    <div v-if="errorMessage" class="upload-area__error-message">{{ errorMessage }}</div>

    <!-- Модалка -->
    <AvatarCropperModal v-if="selectedFile" :file="selectedFile" @done="onCropComplete" @cancel="selectedFile = null" />
  </div>
</template>

<style lang="scss" scoped>
  .avatar-uploader {
    min-height: 166px;
    width: fit-content;
    &__input {
      display: none;
    }
  }
  .upload-area {
    border: 1px dashed $border-color;
    border-radius: $border-radius;
    padding: $spacing-base;
    transition: $transition;
    cursor: pointer;
    text-align: center;
    position: relative;
    transition: 0.25s;
    &__placeholder {
      margin-bottom: 0.5rem;
      font-weight: 400;
      color: $text-primary;
      font-size: 0.875rem;
      color: $text-secondary;
      text-wrap-style: balance;
    }
    &__icon {
      width: 3rem;
      fill: $primary-color;
      filter: opacity(0.5);
    }
    &__error-message {
      text-align: center;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: $error-color;
    }
    &.disabled {
      border-style: solid;
      cursor: default;
    }
    &.drag-over {
      border-color: $border-focus;
      background-color: $border-color;
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }
  }

  .avatar {
    &__wrapper {
      position: relative;
      display: inline-block;
    }
    &__image {
      width: 128px;
      height: 128px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .delete-btn {
    $size: 26px;
    background: $surface;
    cursor: pointer;
    position: absolute;
    padding: 0;
    top: -6px;
    right: -6px;
    border: none;
    color: $text-primary;
    font-size: 12px;
    line-height: $size;
    width: $size;
    height: $size;
    border-radius: 50%;
    text-align: center;
    border: 1px solid $border-color;
    transition: $transition;
    &:hover {
      box-shadow: $shadow-md;
    }
    z-index: 10;
  }

  .toast {
    position: absolute;
    right: 0;
    top: -10px;
    transform: translateY(-100%);
    background: #ff4d4f;
    color: white;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 14px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: fadeInOut 0.3s ease;
    max-width: 240px;
  }
  @keyframes fadeInOut {
    from {
      opacity: 0;
      transform: translateY(-110%);
    }
    to {
      opacity: 1;
      transform: translateY(-100%);
    }
  }
</style>
