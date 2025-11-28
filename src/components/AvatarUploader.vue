<script lang="ts" setup>
import { ref } from "vue";
import AvatarCropperModal from "@/components/AvatarCropperModal.vue";

const avatar = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const isDragOver = ref(false);
const selectedFile = ref<File | null>(null);

// ---- Ошибки ----
const errorMessage = ref<string>("");     // для текста под полем
const toastMessage = ref<string>("");     // для toast
let toastTimer: number | null = null;

// ---- Файл-валидация ----
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/svg+xml"];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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
    toastMessage.value = "";
  }, 3000);
}

function clearError() {
  errorMessage.value = "";
}

function validateFile(file: File): boolean {
  clearError();

  if (!ALLOWED_TYPES.includes(file.type)) {
    showError("Недопустимый формат. Разрешено: JPG, PNG, WEBP, JPG, SVG.");
    return false;
  }

  if (file.size > MAX_SIZE_BYTES) {
    showError(`Файл слишком большой. Максимум ${MAX_SIZE_MB} MB.`);
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
    input.value = "";
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
    <div v-if="toastMessage" class="toast">
      {{ toastMessage }}
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />

    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'disabled': avatar }"
      @click="openFileDialog"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >

      <template v-if="!avatar">
        <div class="placeholder">
          <span class="icon">📷</span>
          <p>Загрузите аватар или перетащите файл</p>
        </div>
      </template>

      <template v-else>
        <div class="avatar-wrapper">
          <img :src="avatar" class="avatar-image" />

          <button class="delete-btn" @click="removeAvatar">
            ✕
          </button>
        </div>
      </template>
    </div>

    <!-- Ошибка под полем -->
    <p v-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </p>

    <!-- Модалка -->
    <AvatarCropperModal
      v-if="selectedFile"
      :file="selectedFile"
      @done="onCropComplete"
      @cancel="selectedFile = null"
    />
  </div>
</template>

<style scoped>
/* ---------- Upload Area ---------- */
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  text-align: center;
  position: relative;
  transition: 0.25s;
}

.upload-area.disabled {
  border-style: solid;
  cursor: default;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #e0ecff;
}

.placeholder {
  color: #666;
}

.icon {
  font-size: 48px;
}

/* ---------- Avatar ---------- */
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-image {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
}

/* ---------- Delete button ---------- */
.delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  border: none;
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 13px;
  line-height: 26px;
  text-align: center;
  padding: 0;
  box-shadow: 0 0 4px rgba(0,0,0,0.25);
  transition: 0.2s;
}

.delete-btn:hover {
  background: #d9363e;
}

/* ---------- Error text ---------- */
.error-text {
  margin-top: 8px;
  color: #d9363e;
  font-size: 14px;
  text-align: left;
}

/* ---------- Toast ---------- */
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
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  animation: fadeInOut 0.3s ease;
  max-width: 240px;
}

/* Анимация появления */
@keyframes fadeInOut {
  from { opacity: 0; transform: translateY(-110%); }
  to { opacity: 1; transform: translateY(-100%); }
}
</style>
