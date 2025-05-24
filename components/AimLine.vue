<template lang="pug">
.aim-line-container(v-if="isActive")
  .aim-line-wrapper(:style="wrapperStyle")
    svg.aim-svg(width="720" height="720")
      line(
        x1="360"
        y1="360"
        :x2="360"
        :y2="360 + actualLength"
        stroke="#00ffff"
        stroke-width="4"
        stroke-dasharray="0,15,12,6"
        v-if="actualLength > 0"
      )
      rect(
        :x="360 - squareSize / 2"
        :y="calculatedSquarePosition - squareSize / 2"
        :width="squareSize"
        :height="squareSize"
        fill="none"
        stroke="#00ffff"
        stroke-width="4"
        :transform="`rotate(45, 360, ${calculatedSquarePosition})`"
      )
      g(:transform="`translate(${360 + reticleOffsetXPx}, ${calculatedSquarePosition + reticleOffsetYPx})`")
        // Горизонтальные линии
        line(
          x1="-29"
          y1="0"
          x2="-12"
          y2="0"
          stroke="#00ffff"
          stroke-width="4"
        )
        line(
          x1="12"
          y1="0"
          x2="29"
          y2="0"
          stroke="#00ffff"
          stroke-width="4"
        )
        line(
          x1="0"
          y1="-29"
          x2="0"
          y2="-12"
          stroke="#00ffff"
          stroke-width="4"
        )
        line(
          x1="0"
          y1="12"
          x2="0"
          y2="29"
          stroke="#00ffff"
          stroke-width="4"
        )
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  length: {
    type: Number,
    default: 0
  },
  angle: {
    type: Number,
    default: 0
  },
  centerX: {
    type: Number,
    default: 360
  },
  centerY: {
    type: Number,
    default: 122
  },
  squareSize: {
    type: Number,
    default: 124
  },
  squarePosition: {
    type: Number,
    default: 100
  },
  reticleOffsetX: {
    type: Number,
    default: 0
  },
  reticleOffsetY: {
    type: Number,
    default: 0
  }
})

const clampedAngle = computed(() => 
  Math.max(-90, Math.min(90, props.angle))
)

const actualLength = computed(() => 
  Math.min(360, Math.max(0, props.length))
)

const calculatedSquarePosition = computed(() => {
  const basePosition = 360 + (actualLength.value * (props.squarePosition / 100))
  return basePosition
})

const reticleOffsetXPx = computed(() => {
  return (props.reticleOffsetX / 100) * 20
})

const reticleOffsetYPx = computed(() => {
  return (props.reticleOffsetY / 100) * 20
})

const wrapperStyle = computed(() => {
  return {
    transform: `translate(-50%, -50%) rotate(${clampedAngle.value}deg)`,
    left: `${props.centerX}px`,
    top: `${props.centerY}px`
  }
})
</script>

<style lang="scss" scoped>
.aim-line-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: $mix-blend-value;
  
  .aim-line-wrapper {
    position: absolute;
    overflow: visible;
    transform-origin: center center;
  }
  
  .aim-svg {
    overflow: visible;
  }
}
</style> 