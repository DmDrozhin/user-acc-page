<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Cropper } from 'vue-advanced-cropper';
  import type { CropperResult } from 'vue-advanced-cropper';
  import 'vue-advanced-cropper/dist/style.css';

  const props = defineProps<{
    file: File;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: string): void;
    (e: 'cancel'): void;
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
      const dataUrl = result.canvas.toDataURL('image/png');
      emit('done', dataUrl);
    }
  }
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-window">
      <div class="modal-overlay__title-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" class="modal-overlay__title-icon" viewBox="0 0 24 24">
          <path
            d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z" />
        </svg>
        <div class="modal-overlay__title">Crop avatar image</div>
        <div class="modal-overlay__delete-btn-wrapper">
          <button class="delete-btn" @click="emit('cancel')" aria-label="Close modal window">✕</button>
        </div>
      </div>
      <div class="cropper-box">
        <cropper ref="cropperRef" v-if="image" :src="image" :stencil-props="{ aspectRatio: 1 }" />
      </div>

      <div class="actions">
        <button class="actions__button cancel" @click="emit('cancel')">Cancel</button>
        <button class="actions__button done" @click="doCrop">Done</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use 'sass:color';
  @use '@/styles/elements.scss' as *;
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: $modal-overlay;
    display: flex;
    align-items: center;
    justify-content: center;
    &__title-wrapper {
      display: flex;
      align-items: center;
      gap: $spacing-tiny;
      margin-bottom: $spacing-base;
    }
    &__title {
      font-size: $font-size-lg;
      font-weight: 400;
    }
    &__title-icon {
      width: 1.5rem;
      height: 1.5rem;
      fill: $primary-color;
      opacity: 0.8;
    }
    &__delete-btn-wrapper {
      flex: 1;
      text-align: right;
    }
  }

  .modal-window {
    width: 100%;
    max-width: 400px;
    background: $surface;
    border-radius: $border-radius;
    padding: $spacing-base;
  }

  .cropper-box {
    width: 100%;
    height: 300px;
    margin-top: 12px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    margin-top: $spacing-base;
    &__button {
      min-width: calc($spacing-lg * 4); // 96px
      padding: $spacing-xs $spacing-base;
      border-radius: $border-radius-sm;
      border: 1px solid transparent;
      transition: $transition;
      &.cancel {
        background-color: $border-color;
        color: $text-primary;
        &:hover {
          background: color.adjust($border-color, $lightness: -5%);
        }
      }
      &.done {
        background-color: $primary-color;
        color: $surface;
        &:hover {
          background: color.adjust($primary-color, $lightness: -5%);
        }
      }
    }
  }
</style>
