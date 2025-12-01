<!-- src/components/MaskedInput.vue -->
<script setup lang="ts">
  import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';

  interface Props {
    modelValue?: string;
    mask: string; // use '#' as digit placeholder, other chars preserved (spaces, hyphens)
    placeholder?: string;
    type?: string;
    maxlength?: number;
    autocomplete?: string;
    id?: string;
    inputmode?: 'text' | 'email' | 'search' | 'tel' | 'url' | 'numeric' | 'none' | 'decimal';
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update:modelValue', 'update:raw', 'blur', 'focus', 'input']);

  const inputRef = ref<HTMLInputElement | null>(null);
  const internal = ref<string>(props.modelValue ?? '');

  // Helper: extract only digits (raw)
  const getRaw = (val: string) => (val || '').replace(/\D/g, '');

  // Apply mask (preserve non-# characters)
  function applyMaskToRaw(raw: string, mask: string) {
    const digits = raw.split('');
    let out = '';
    for (const ch of mask) {
      if (ch === '#') {
        if (digits.length === 0) break;
        out += digits.shift();
      } else {
        out += ch;
      }
    }
    return out;
  }

  // Calculate next caret position after formatting
  function calcNewCaretPos(maskedBefore: string, maskedAfter: string, oldPos: number) {
    // Try to keep caret near end of input segment
    const diff = maskedAfter.length - maskedBefore.length;
    return Math.max(0, oldPos + diff);
  }

  watch(
    () => props.modelValue,
    (v) => {
      const masked = v ?? '';
      if (masked !== internal.value) internal.value = masked;
    }
  );

  watch(
    () => props.mask,
    (newMask) => {
      // When mask changes, reformat current raw to new mask and emit updates
      const raw = getRaw(internal.value);
      const masked = applyMaskToRaw(raw, newMask);
      internal.value = masked;
      emit('update:modelValue', masked);
      emit('update:raw', raw);
    }
  );

  function setSelectionRangeSafe(el: HTMLInputElement, pos: number) {
    try {
      el.setSelectionRange(pos, pos);
    } catch (e) {
      // ignore (some inputs may be not focusable)
      console.warn('Failed to set selection range', e);
    }
  }

  function onInput(e: InputEvent) {
    const el = e.target as HTMLInputElement;
    if (!el) return;
    const oldMasked = internal.value;
    const oldPos = el.selectionStart ?? el.value.length;

    // Compute raw digits and new masked value
    const raw = getRaw(el.value);
    const masked = applyMaskToRaw(raw, props.mask);

    internal.value = masked;
    emit('update:modelValue', masked);
    emit('update:raw', raw);
    emit('input', masked);

    // Restore caret
    // Compute approximate new pos: try to place after the last digit typed
    const newPos = calcNewCaretPos(oldMasked, masked, oldPos);
    setTimeout(() => {
      if (inputRef.value) setSelectionRangeSafe(inputRef.value, Math.min(masked.length, newPos));
    }, 0);
  }

  function onPaste(e: ClipboardEvent) {
    const paste = e.clipboardData?.getData('text') ?? '';
    const raw = getRaw(paste);
    const masked = applyMaskToRaw(raw, props.mask);
    internal.value = masked;
    emit('update:modelValue', masked);
    emit('update:raw', raw);
    e.preventDefault();
    setTimeout(() => inputRef.value?.focus(), 0);
  }

  onMounted(() => {
    // ensure initial formatting
    const raw = getRaw(internal.value);
    internal.value = applyMaskToRaw(raw, props.mask);
  });
</script>

<template>
  <input
    ref="inputRef"
    :id="props.id"
    class="masked-input"
    :value="internal"
    :type="props.type ?? 'text'"
    :placeholder="props.placeholder"
    :autocomplete="props.autocomplete"
    :inputmode="props.inputmode ?? 'numeric'"
    :maxlength="props.maxlength ?? props.mask.length"
    @input="onInput"
    @paste="onPaste"
    @blur="$emit('blur')"
    @focus="$emit('focus')" />
</template>
