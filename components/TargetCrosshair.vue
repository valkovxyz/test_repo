<template lang="pug">
.target-crosshair(:style="positionStyle")
  .crosshair-container(:class="{ 'mode-1': crosshairMode === 1, 'mode-2': crosshairMode === 2, 'mode-3': crosshairMode === 3, 'mode-4': crosshairMode === 4, 'mode-5': crosshairMode === 5 }")
    .corner.tl(v-if="crosshairMode !== 4 && crosshairMode !== 5")
      svg(width="12.5" height="12.5" viewBox="0 0 12.5 12.5")
        path(d="M0 0V12.5H4V4H12.5V0H0Z" fill="#00FFEA" stroke="#00FFEA" stroke-width="1")
    .corner.tr(v-if="crosshairMode !== 4 && crosshairMode !== 5")
      svg(width="12.5" height="12.5" viewBox="0 0 12.5 12.5")
        path(d="M12.5 0H0V4H8.5V12.5H12.5V0Z" fill="#00FFEA" stroke="#00FFEA" stroke-width="1")
    .corner.bl(v-if="crosshairMode !== 4 && crosshairMode !== 5")
      svg(width="12.5" height="12.5" viewBox="0 0 12.5 12.5")
        path(d="M0 0V12.5H12.5V8.5H4V0H0Z" fill="#00FFEA" stroke="#00FFEA" stroke-width="1")
    .corner.br(v-if="crosshairMode !== 4 && crosshairMode !== 5")
      svg(width="12.5" height="12.5" viewBox="0 0 12.5 12.5")
        path(d="M12.5 0H8.5V8.5H0V12.5H12.5V0Z" fill="#00FFEA" stroke="#00FFEA" stroke-width="1")
    .center-square(v-if="crosshairMode !== 4 && crosshairMode !== 5")

    .mode-4-container(v-if="crosshairMode === 4")
      .dashed-line(v-if="isLineVisible" :style="dashedLineStyle")

      .crosshair-number #1


      .crosshair-percentage {{ localTargetPercentage }}%

      svg.square-svg(width="50" height="50" viewBox="0 0 50 50")
        rect(x="0" y="0" width="50" height="50" fill="none" stroke="#00FFEA" stroke-width="8")

    .mode-5-container(v-if="crosshairMode === 5")
      .dashed-line(v-if="isLineVisible" :style="attackDashedLineStyle")

      .crosshair-number.attack-number #1

      .crosshair-percentage.attack-percentage {{ localTargetPercentage }}%

      .double-border-container
        svg.outer-border(width="58" height="58" viewBox="0 0 58 58")
          rect(x="2" y="2" width="54" height="54" fill="none" stroke="#DE0202" stroke-width="4")
        svg.inner-square(width="50" height="50" viewBox="0 0 50 50")
          rect(x="0" y="0" width="50" height="50" fill="none" stroke="#000000" stroke-width="8")
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  posX: {
    type: Number, 
    default: 0.5
  },
  posY: {
    type: Number,
    default: 0.5
  },
  screenWidth: {
    type: Number,
    default: 720
  },
  screenHeight: {
    type: Number,
    default: 480
  },
  crosshairMode: {
    type: Number,
    default: 1
  },
  isHorizonMode: {
    type: Boolean,
    default: false
  },
  faiOffset: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  faiCenterX: {
    type: Number,
    default: 360
  },
  faiCenterY: {
    type: Number,
    default: 120
  },
  targetPercentage: {
    type: Number,
    default: 56
  }
})

const emit = defineEmits(['update:targetPercentage'])

const localTargetPercentage = computed({
  get: () => props.targetPercentage,
  set: (value) => emit('update:targetPercentage', value)
})

const positionStyle = computed(() => {
  let x = props.posX * props.screenWidth
  let y = props.posY * props.screenHeight

  if (props.isHorizonMode) {
    y -= 48
  }

  return {
    left: `${x}px`,
    top: `${y}px`
  }
})

const crosshairAbsX = computed(() => props.posX * props.screenWidth)
const crosshairAbsY = computed(() => {
  let y = props.posY * props.screenHeight

  if (props.crosshairMode === 4 || props.crosshairMode === 5) {
    if (props.isHorizonMode) {
      y -= 48
    }
  } else {
    if (props.isHorizonMode) {
      y -= 48
    }
  }

  return y
})

const faiCenterPosX = computed(() => props.faiCenterX)
const faiCenterPosY = computed(() => {

  return props.isHorizonMode ? props.faiCenterY - 48 : props.faiCenterY
})


const dashedLineStyle = computed(() => {

  const centerX = 25
  const centerY = 25

  const deltaX = faiCenterPosX.value - crosshairAbsX.value
  const deltaY = faiCenterPosY.value - crosshairAbsY.value
  const fullLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

  const lineOffset = 25 + 8

  const visibleLength = Math.max(0, fullLength - lineOffset)

  return {
    position: 'absolute',
    left: `${centerX}px`,
    top: `${centerY}px`,
    width: `${visibleLength}px`,
    height: '3px',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(90deg, #00FFEA 12px, transparent 12px)',
    backgroundSize: '18px 100%',
    transformOrigin: 'left center',
    transform: `rotate(${angle}deg) translateX(${lineOffset}px)`,
    zIndex: 100
  }
})

const attackDashedLineStyle = computed(() => {

  const centerX = 25
  const centerY = 25

  const deltaX = faiCenterPosX.value - crosshairAbsX.value
  const deltaY = faiCenterPosY.value - crosshairAbsY.value
  const fullLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

  const lineOffset = 25 + 8

  const visibleLength = Math.max(0, fullLength - lineOffset)

  return {
    position: 'absolute',
    left: `${centerX}px`,
    top: `${centerY}px`,
    width: `${visibleLength}px`,
    height: '3px',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(90deg, #00FFEA 12px, transparent 12px)',
    backgroundSize: '18px 100%',
    transformOrigin: 'left center',
    transform: `rotate(${angle}deg) translateX(${lineOffset}px)`,
    zIndex: 1
  }
})

const displayPosition = computed(() => {

  return {
    x: props.posX,
    y: props.posY
  }
})

const isLineVisible = computed(() => {
  const deltaX = faiCenterPosX.value - crosshairAbsX.value
  const deltaY = faiCenterPosY.value - crosshairAbsY.value
  const fullLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  const minVisibleLength = 25 + 20

  return fullLength > minVisibleLength
})

defineExpose({
  displayPosition,
  targetPercentage: localTargetPercentage
})
</script>

<style lang="scss" scoped>
.target-crosshair {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 300;
  pointer-events: none;
  mix-blend-mode: var(--crosshair-blend-mode);

  .crosshair-container {
    position: relative;
    transition: all 0.3s ease-in-out;

    .corner {
      position: absolute;
      width: 12.5px;
      height: 12.5px;

      svg {
        width: 12.5px;
        height: 12.5px;
        display: block;
      }
    }

    .tl {
      top: 0;
      left: 0;
    }

    .tr {
      top: 0;
      right: 0;
    }

    .bl {
      bottom: 0;
      left: 0;
    }

    .br {
      bottom: 0;
      right: 0;
    }

    .center-square {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 4px;
      height: 4px;
      background-color: #00FFEA;
      box-shadow: 0 0 4px #00FFEA;
      mix-blend-mode: color-dodge;
    }

    &.mode-1 {
      width: 50px;
      height: 50px;
    }

    &.mode-2 {
      width: 80px;
      height: 80px;
    }

    &.mode-3 {
      width: 34.5px;
      height: 34.5px;
    }

    &.mode-4 {
      width: 50px;
      height: 50px;

      .mode-4-container {
        position: relative;
        width: 100%;
        height: 100%;

        .dashed-line {
          position: absolute;
          z-index: 5;
        }

        .square-svg {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
        }

        .crosshair-number {
          position: absolute;
          left: -26px;
          top: 0;
          width: 23px;
          height: 16px;
          background-color: #00FFEA;
          color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
          z-index: 15;
        }

        .crosshair-percentage {
          position: absolute;
          left: -34px;
          bottom: 0;
          width: 31px;
          height: 16px;
          background-color: #00FFEA;
          color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
          z-index: 15;
        }
      }
    }

    &.mode-5 {
      width: 50px;
      height: 50px;

      .mode-5-container {
        position: relative;
        width: 100%;
        height: 100%;

        .dashed-line {
          position: absolute;
          z-index: 5;
        }

        .double-border-container {
          position: relative;
          width: 58px;
          height: 58px;
          top: -4px;
          left: -4px;

          .outer-border {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9;
          }

          .inner-square {
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: 10;
          }
        }

        .crosshair-number.attack-number {
          position: absolute;
          left: -29px;
          top: 0;
          width: 23px;
          height: 16px;
          background-color: #DE0202;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
          z-index: 20;
        }

        .crosshair-percentage.attack-percentage {
          position: absolute;
          left: -37px;
          bottom: 0;
          width: 31px;
          height: 16px;
          background-color: #DE0202;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
          z-index: 20;
        }
      }
    }
  }
}
</style> 
