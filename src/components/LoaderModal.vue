<template>
  <div class="page-loader">
    <div class="loading">
      <div class="loading__spinner"></div>
      <div class="loading__text">Loading...</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.page-loader {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: rgba(white, 0.2);
  backdrop-filter: blur(0.5rem);
  z-index: 1000;
}
// Loading Spinner
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $border-color;
    border-top: 3px solid $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  &__text {
    color: $text-secondary;
    font-size: $font-size-md;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
