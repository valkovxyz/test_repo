<template lang="pug">
.background-container
  .background-image(:style="containerStyle")
    img(
      ref="imageRef"
      :src="imageSrc"
      :style="imageStyle"
    )
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  offsetX: {
    type: Number,
    default: 0
  },
  offsetY: {
    type: Number,
    default: 0
  },
  isHorizonMode: {
    type: Boolean,
    default: false
  },
  imageSrc: {
    type: String,
    default: '/images/background.png'
  }
})

// Добавляем смещение вверх на 10% в режиме HORIZON
const containerStyle = computed(() => {
  const horizonOffset = props.isHorizonMode ? -48 : 0 // 10% от 480px = 48px
  
  return {
    transform: `translate(${props.offsetX}px, ${props.offsetY + horizonOffset}px)`
  }
})

const imageStyle = computed(() => {
  return {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  }
})

const imageRef = ref(null)

// Метод для обновления изображения
const updateImage = (newSrc) => {
  if (imageRef.value) {
    imageRef.value.src = newSrc
  }
}

defineExpose({
  updateImage
})
</script>

<style lang="scss" scoped>
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    transition: transform 0.3s ease;
    pointer-events: none;
  }
}
</style> 