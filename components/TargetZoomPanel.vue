<template lang="pug">
.target-zoom-panel(:class="{ 'active': isActive }")
  .zoom-indicator
    .title {{ crosshairMode === 1 ? 'ВИБІР ЦІЛІ' : 'ЗАХВАТ...' }}
  .zoom-view
    canvas(
      ref="zoomCanvas"
      width="420"
      height="180"
    )

    .crosshair-container(:class="{ 'mode-1': crosshairMode === 1, 'mode-2': crosshairMode === 2, 'mode-3': crosshairMode === 3 }")
      svg.crosshair-svg(width="44" height="43" :viewBox="crosshairMode === 2 ? '0 0 98 98' : '0 0 44 43'" fill="none" xmlns="http://www.w3.org/2000/svg")
        g(v-if="crosshairMode !== 2")
          path(d="M21.9526 30.9228L21.8828 42.9226" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
          path(d="M22.3852 0.999989L22.3154 12.9998" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
          path(d="M12.9998 22.8703L1 22.8006" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
          path(d="M42.9988 23.0441L30.999 22.9744" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
        g(v-else)
          path(d="M49 64L49 92" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
          path(d="M49 34L49 6" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
          path(d="M34 49L6 49" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
          path(d="M64 49L92 49" stroke="#00FFEA" stroke-width="4" stroke-linejoin="round")
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
  },
  crosshairMode: {
    type: Number,
    default: 1
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
    const horizonPixelShift = props.isHorizonMode ? 48 : 0;

    const mainCrosshairScreenX = props.targetPosX * props.mainScreenWidth;
    const mainCrosshairScreenY = props.targetPosY * props.mainScreenHeight;

    const pointX_in_bgContainer = mainCrosshairScreenX;
    const pointY_in_bgContainer = mainCrosshairScreenY;

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
  background-color: rgb(0, 0, 0);
  z-index: 0;
  transition: bottom 0.3s ease;
  
  &.active {
    bottom: 0;
    z-index: 0;
  }
  
  .zoom-indicator {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 144px;
    height: 24px;
    background-color: #FFDD00;
    color: #000000;
    font-family: 'ARS-M-VCR', monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 4px;
    box-sizing: border-box;
    z-index: 10;
    text-align: center;
    
    .title {
      text-transform: uppercase;
      margin-right: 4px;
      line-height: 0.5;
    }
    
    .value {
      width: 100px;
      text-align: center;
      padding: 2px 8px;
      text-transform: uppercase;
      background-color: #ffcc00;
      color: #000;
    }
  }
  
  .zoom-view {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px;
    height: 220px;
    background-color: #000;
    overflow: hidden;
    padding: 8px;
    box-sizing: border-box;
    
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
      transition: transform 0.3s ease;
      mix-blend-mode: var(--crosshair-blend-mode);
      .crosshair-svg {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease;
      }
      
      &.mode-1 {
        .crosshair-svg {
          transform: rotate(0deg);
        }
      }
      
      &.mode-2 {
        width: 60px;
        height: 60px;
        transform: translate(calc(-50% - 0px), calc(-50% - 0px));
        
        .crosshair-svg {
          transform: rotate(45deg) scale(1.5);
          transition: transform 0.5s ease;
        }
      }
      
      &.mode-3 {
        .crosshair-svg {
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style> 