<template lang="pug">
.target-zoom-panel(:class="{ 'active': isActive }")
  .zoom-title ВИБІР ЦІЛІ
  .zoom-view
    canvas(
      ref="zoomCanvas"
      width="420"
      height="180"
    )

    .crosshair-container
      .crosshair-line.top
      .crosshair-line.right
      .crosshair-line.bottom
      .crosshair-line.left
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  targetPosX: {
    type: Number,
    default: 0.5
  },
  targetPosY: {
    type: Number,
    default: 0.5
  },
  isHorizonMode: {
    type: Boolean,
    default: false
  },
  imageSrc: {
    type: String,
    default: '/images/background.png'
  },
  mainScreenWidth: {
    type: Number,
    required: true
  },
  mainScreenHeight: {
    type: Number,
    required: true
  }
})

const zoomCanvas = ref(null)
const backgroundImage = ref(null)
let animationFrameId = null
const zoomFactor = ref(2.5)

onMounted(() => {
  loadBackgroundImage(props.imageSrc)
})

watch(() => props.imageSrc, (newSrc) => {
  loadBackgroundImage(newSrc)
})

const loadBackgroundImage = (src) => {
  backgroundImage.value = new Image()
  backgroundImage.value.src = src
  backgroundImage.value.onload = () => {
    renderZoomImage()
  }
  backgroundImage.value.onerror = (e) => {
    console.error('Error loading background image:', e)
    setTimeout(() => loadBackgroundImage(src), 1000)
  }
}

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

watch(
  [
    () => props.targetPosX, 
    () => props.targetPosY, 
    () => props.isActive, 
    () => props.isHorizonMode
  ], 
  () => {
    renderZoomImage()
  }
)

const renderZoomImage = () => {
  if (!zoomCanvas.value || !backgroundImage.value) return
  if (!props.isActive && animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    return
  }

  const canvas = zoomCanvas.value
  const ctx = canvas.getContext('2d')
  
  const currentZoomFactor = zoomFactor.value
  
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const imgNaturalWidth = backgroundImage.value.width
  const imgNaturalHeight = backgroundImage.value.height
  

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  
  try {
    const horizonPixelShift = props.isHorizonMode ? -(props.mainScreenHeight * 0.1) : 0;

    const mainCrosshairScreenX = props.targetPosX * props.mainScreenWidth;
    const mainCrosshairScreenY = props.targetPosY * props.mainScreenHeight;

    const pointX_in_bgContainer = mainCrosshairScreenX;
    const pointY_in_bgContainer = mainCrosshairScreenY - horizonPixelShift;

    const imgRenderScale = Math.max(
      props.mainScreenWidth / imgNaturalWidth,
      props.mainScreenHeight / imgNaturalHeight
    );
    const fittedBgWidth = imgNaturalWidth * imgRenderScale;
    const fittedBgHeight = imgNaturalHeight * imgRenderScale;

    const cropOffsetX_for_cover = (props.mainScreenWidth - fittedBgWidth) / 2;
    const cropOffsetY_for_cover = (props.mainScreenHeight - fittedBgHeight) / 2;
    const targetX_on_natural_image = (pointX_in_bgContainer - cropOffsetX_for_cover) / imgRenderScale;
    const targetY_on_natural_image = (pointY_in_bgContainer - cropOffsetY_for_cover) / imgRenderScale;

    const sourceWidth = Math.round(canvasWidth / currentZoomFactor)
    const sourceHeight = Math.round(canvasHeight / currentZoomFactor)
    
    const targetX = Math.round(targetX_on_natural_image)
    const targetY = Math.round(targetY_on_natural_image)

    const sourceX = Math.max(0, Math.min(imgNaturalWidth - sourceWidth, targetX - sourceWidth / 2))
    const sourceY = Math.max(0, Math.min(imgNaturalHeight - sourceHeight, targetY - sourceHeight / 2))
    
    // Рисуем вырезанную и увеличенную область
    ctx.drawImage(
      backgroundImage.value,
      sourceX, sourceY,
      sourceWidth, sourceHeight,
      0, 0, canvasWidth, canvasHeight
    )
    
  } catch (error) {
    console.error('Error rendering zoom image:', error)
  }
  
  if (props.isActive) {
    animationFrameId = requestAnimationFrame(renderZoomImage)
  }
}

const updateImage = (newSrc) => {
  loadBackgroundImage(newSrc)
}



defineExpose({
  updateImage
})
</script>

<style lang="scss" scoped>
.target-zoom-panel {
  position: absolute;
  bottom: -220px;
  left: 0;
  width: 720px;
  height: 220px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 4;
  transition: bottom 0.3s ease;
  
  &.active {
    bottom: 0;
  }
  
  .zoom-title {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #ffcc00;
    color: #000;
    font-weight: bold;
    padding: 5px 10px;
    font-family: 'ARS-M-VCR', monospace;
    z-index: 10;
  }
  
  .zoom-view {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px;
    height: 180px;
    background-color: #000;
    overflow: hidden;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(70, 70, 70, 0.5);
    
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .crosshair-container {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      transform: translate(-50%, -50%);
      z-index: 5;
      pointer-events: none;
      
      .crosshair-line {
        position: absolute;
        background-color: #0ff;
        width: 14px;
        height: 2px;
        
        &.top {
          top: 10%;
          left: 50%;
          transform: translateX(-50%) rotate(90deg);
          transform-origin: center;
        }
        
        &.right {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
        
        &.bottom {
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%) rotate(90deg);
          transform-origin: center;
        }
        
        &.left {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }
}

// Для будущей реализации возможности поворота прицела
// мы можем добавить в .crosshair-container класс capture-mode 
// примерно такой CSS:
// 
// .crosshair-container.capture-mode {
//   transform: translate(-50%, -50%) rotate(45deg);
//   .crosshair-line {
//     width: 15px; // увеличиваем длину линий
//   }
// }
</style> 