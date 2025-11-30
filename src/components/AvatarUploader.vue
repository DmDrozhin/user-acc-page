<script lang="ts" setup>
  import { ref } from 'vue';
  import AvatarCropperModal from '@/components/AvatarCropperModal.vue';

  const avatar = ref<string | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);

  const isDragOver = ref(false);
  const selectedFile = ref<File | null>(null);

  // ---- Ошибки ----
  const errorMessage = ref<string>('');
  const toastMessage = ref<string>('');
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
    infoFileFormat: string;
    infoFileSize: string;
  }
  const UPLOAD_MESSAGES: Record<Lang, UploadMessage> = {
    uk: {
      invalidType: `Недопустимий формат. Дозволено: JPG, PNG, WEBP, SVG.`,
      tooLarge: `Файл занадто великий. Максимум ${MAX_SIZE_MB} MB.`,
      uploadPrompt: 'Завантажте аватар або перетягніть файл',
      infoFileFormat: 'Формат: JPG, PNG, WEBP, SVG',
      infoFileSize: 'Максимальний розмір:'
    },
    en: {
      invalidType: `Invalid format. Allowed: JPG, PNG, WEBP, SVG.`,
      tooLarge: `File is too large. Maximum ${MAX_SIZE_MB} MB.`,
      uploadPrompt: 'Upload an avatar or drag and drop a file',
      infoFileFormat: 'Format: JPG, PNG, WEBP, SVG',
      infoFileSize: 'Maximum size:'
    },
    ru: {
      invalidType: `Недопустимый формат. Разрешено: JPG, PNG, WEBP, SVG.`,
      tooLarge: `Файл слишком большой. Максимум ${MAX_SIZE_MB} MB.`,
      uploadPrompt: 'Загрузите аватар или перетащите файл',
      infoFileFormat: 'Формат: JPG, PNG, WEBP, SVG',
      infoFileSize: 'Максимальный размер:'
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
          <div class="wrapper-base">
            <svg
              class="upload-area__icon"
              :class="{ error: errorMessage }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M17 17V21H19V17H21L18 14L15 17H17M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 14C6.6 14 3 15.8 3 18V20H12.5C12.2 19.2 12 18.4 12 17.5C12 16.3 12.3 15.2 12.9 14.1C12.3 14.1 11.7 14 11 14" />
            </svg>
            <div>{{ UPLOAD_MESSAGES[currentLang]?.uploadPrompt || UPLOAD_MESSAGES['en'].uploadPrompt }}</div>
          </div>
          <hr class="base-divider" />
          <!-- Error message -->
          <div v-if="errorMessage" class="upload-area__message error">{{ errorMessage }}</div>
          <!-- File format and size info message -->
          <template v-else>
            <div class="upload-area__message info">
              {{ UPLOAD_MESSAGES[currentLang]?.infoFileFormat || UPLOAD_MESSAGES['en'].infoFileFormat }}
            </div>
            <div class="upload-area__message info">
              {{ UPLOAD_MESSAGES[currentLang]?.infoFileSize || UPLOAD_MESSAGES['en'].infoFileSize }} {{ MAX_SIZE_MB }} MB
            </div>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="avatar__wrapper">
          <button class="delete-btn avatar" @click="removeAvatar" aria-label="Remove avatar">✕</button>
          <img :src="avatar" class="avatar__image" alt="user avatar" />
        </div>
      </template>
    </div>
    <!-- Modal window -->
    <AvatarCropperModal v-if="selectedFile" :file="selectedFile" @done="onCropComplete" @cancel="selectedFile = null" />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .avatar-uploader {
    width: 215px;
    min-height: 170px;
    &__input {
      display: none;
    }
  }
  .standard-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .upload-area {
    height: 100%;
    align-content: center;
    border: 2px dashed $border-color;
    border-radius: $border-radius;
    padding: $spacing-base;
    transition: $transition;
    text-align: center;
    position: relative;
    transition: 0.25s;
    cursor: pointer;
    &__placeholder {
      font-size: $font-size-md;
      text-wrap-style: balance;
    }
    &__message {
      text-align: left;
      font-size: $font-size-sm;
      &.info {
        color: $text-secondary;
      }
      &.error {
        color: $error-color;
      }
    }
    &__icon {
      flex-shrink: 0;
      width: 3rem;
      fill: $primary-color;
      filter: opacity(0.5);
      &.error {
        fill: $error-color;
      }
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
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        display: grid;
        place-content: center;
        color: $surface;
        line-height: 1;
        transition: $transition;
        background-color: transparent;
        z-index: 5;
      }
      &:has(.delete-btn:hover)::before {
        content: '✕';
        background-color: $modal-overlay;
      }
    }
    &__image {
      display: block;
      $size: calc($spacing-xl * 4); // 64px
      width: $size;
      height: $size;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
    }
  }

  .delete-btn.avatar {
    position: absolute;
    top: -6px;
    right: -6px;
    z-index: 10;
  }

  .toast {
    position: absolute;
    right: 0;
    top: -($spacing-sm);
    transform: translateY(-100%);
    background: $error-color;
    color: $surface;
    padding: 10px 14px;
    border-radius: $border-radius-sm;
    font-size: $font-size-md;
    box-shadow: $box-shadow;
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
