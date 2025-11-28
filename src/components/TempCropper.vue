<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import VueCropper from 'vue-cropperjs';
// import 'cropperjs/dist/cropper.css';
import type Cropper from 'cropperjs'; // Тип Cropper из оригинальной библиотеки

// ----------------------------------------------------
// 1. Ссылки и Состояния
// ----------------------------------------------------

// Ссылка на компонент VueCropper для доступа к его методам
const cropperRef = ref<InstanceType<typeof VueCropper> | null>(null);
// Ссылка на input[type="file"]
const fileInputRef = ref<HTMLInputElement | null>(null);

// Исходный URL изображения для отображения в кроппере
const imageSrc = ref<string | null>(null);
// Обрезанное изображение в виде Blob, готовое к загрузке
const croppedImageBlob = ref<Blob | null>(null);

// Конфигурация для Cropper.js (можно расширить)
const cropperOptions = {
  aspectRatio: 1, // Квадратная область обрезки (1:1)
  viewMode: 1,    // Ограничивает область обрезки рамками контейнера
  dragMode: 'move', // Перемещение изображения внутри контейнера
  background: false, // Отключение фоновой сетки
};

// Вычисляемое свойство для URL обрезанного изображения (используется для предпросмотра)
const croppedImageUrl = computed(() => {
  if (croppedImageBlob.value) {
    // Создаем временный URL из Blob
    return URL.createObjectURL(croppedImageBlob.value);
  }
  return '';
});

// ----------------------------------------------------
// 2. Методы
// ----------------------------------------------------

/**
 * Обработчик изменения файла (выбор нового изображения).
 * @param event - Событие изменения input[type="file"].
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && file.type.startsWith('image/')) {
    // Очищаем предыдущее обрезанное изображение и URL
    croppedImageBlob.value = null;
    if (imageSrc.value) {
        URL.revokeObjectURL(imageSrc.value); // Освобождаем память от старого URL
    }

    // Создаем URL для выбранного файла
    imageSrc.value = URL.createObjectURL(file);

    // Перезагружаем кроппер, чтобы применить новый источник
    nextTick(() => {
        // Мы можем вызвать метод `replace` из библиотеки `cropperjs` через ссылку `cropperRef`
        // Но в данном случае, поскольку мы меняем `imageSrc`, компонент `VueCropper`
        // сам обновится. Если нужно сбросить зум/позицию, можно вызвать:
        // cropperRef.value?.getCropper().reset();
    });
  } else {
    imageSrc.value = null;
    croppedImageBlob.value = null;
    alert('Пожалуйста, выберите действительный файл изображения.');
  }
};

/**
 * Обрезает изображение и сохраняет его как Blob.
 */
const cropImage = () => {
  const cropperInstance = cropperRef.value?.getCropper() as Cropper | undefined;

  if (cropperInstance) {
    // Получаем обрезанный холст с заданными параметрами
    cropperInstance.getCroppedCanvas({
      width: 256,   // Ширина обрезанного изображения
      height: 256,  // Высота обрезанного изображения
    }).toBlob((blob) => {
      if (blob) {
        // Сохраняем Blob, который готов к загрузке
        croppedImageBlob.value = blob;
      } else {
        alert('Не удалось создать Blob изображения.');
      }
    }, 'image/jpeg', 0.9); // Формат: JPEG, Качество: 90%
  }
};

/**
 * Эмуляция загрузки обрезанного изображения на сервер.
 */
const uploadImage = () => {
  if (croppedImageBlob.value) {
    // В реальном приложении здесь будет код для отправки на сервер, например, через FormData

    // 1. Создание FormData
    const formData = new FormData();
    formData.append('profile_image', croppedImageBlob.value, 'profile.jpg');

    // 2. Отправка (например, с помощью fetch/axios)
    // fetch('/api/upload-image', {
    //   method: 'POST',
    //   body: formData,
    // })
    // .then(response => {
    //   if (response.ok) {
    //     alert('Изображение успешно загружено!');
    //     // Можно очистить или сбросить компонент после успешной загрузки
    //   } else {
    //     alert('Ошибка загрузки!');
    //   }
    // });

    // Эмуляция успешной загрузки
    console.log('Blob to upload:', croppedImageBlob.value);
    console.log('Размер:', (croppedImageBlob.value.size / 1024).toFixed(2), 'KB');
    alert('Изображение готово к отправке на сервер! (См. консоль)');
  } else {
    alert('Сначала обрежьте изображение.');
  }
};

// ----------------------------------------------------
// 3. Очистка (для предотвращения утечек памяти)
// ----------------------------------------------------

// Рекомендуется освобождать URL, созданные с помощью URL.createObjectURL
import { onBeforeUnmount } from 'vue';

onBeforeUnmount(() => {
  if (imageSrc.value) {
    URL.revokeObjectURL(imageSrc.value);
  }
  if (croppedImageUrl.value) {
    // Важно: `croppedImageUrl` использует вычисляемое свойство, которое
    // создает временный URL каждый раз, когда читается.
    // Лучше отзывать его после каждой "загрузки" или при unmount.
    // Для этого примера делаем только при unmount.
    URL.revokeObjectURL(croppedImageUrl.value);
  }
});

</script>
<template>
  <div>
    <h2>Загрузка и Обрезка Изображения Пользователя</h2>

    <input
      type="file"
      accept="image/*"
      @change="handleFileChange"
      ref="fileInputRef"
    />

    <div v-if="imageSrc">
      <hr>
      <h3>Обрезка</h3>
      <div class="cropper-container">
        <VueCropper
          ref="cropperRef"
          :src="imageSrc"
          alt="Изображение для обрезки"
          :options="cropperOptions"
        />
      </div>

      <button @click="cropImage" :disabled="!cropperRef">
        Обрезать и Подготовить к Загрузке
      </button>

      <div v-if="croppedImageBlob">
        <hr>
        <h3>Предпросмотр Обрезанного</h3>
        <img
          :src="croppedImageUrl"
          alt="Обрезанное изображение"
          class="cropped-preview"
        />
        <p>Изображение готово к загрузке.</p>
        <button @click="uploadImage">
          Загрузить на Сервер (Эмуляция)
        </button>
      </div>
    </div>

    <p v-else>Выберите изображение для начала.</p>

  </div>
</template>

<style scoped>
.cropper-container {
  max-width: 500px; /* Ограничиваем размер контейнера для кроппера */
  height: 500px;
  margin: 20px 0;
}

/* * Важно: Импортированному стилю 'cropperjs/dist/cropper.css'
 * может потребоваться контейнер с заданными размерами (width/height),
 * как в .cropper-container.
 */

.cropped-preview {
  display: block;
  max-width: 256px;
  max-height: 256px;
  margin: 10px 0;
  border: 1px solid #ccc;
}

button {
  margin-right: 10px;
  padding: 8px 15px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
