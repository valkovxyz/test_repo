<template lang="pug">
.target-crosshair(:style="positionStyle")
  .crosshair-container
    .corner.top-left
    .corner.top-right
    .corner.bottom-left
    .corner.bottom-right
</template>

<script setup>
import { computed } from 'vue'

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
  }
})

const positionStyle = computed(() => {
  const x = props.posX * props.screenWidth
  const y = props.posY * props.screenHeight
  
  return {
    left: `${x}px`,
    top: `${y}px`
  }
})
</script>

<style lang="scss" scoped>
.target-crosshair {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  z-index: 5;
  pointer-events: none;
  
  .crosshair-container {
    width: 100%;
    height: 100%;
    position: relative;
    
    .corner {
      position: absolute;
      width: 12px;
      height: 12px;
      border-color: #0ff;
      border-style: solid;
      border-width: 0;
      
      &.top-left {
        top: 0;
        left: 0;
        border-top-width: 2px;
        border-left-width: 2px;
      }
      
      &.top-right {
        top: 0;
        right: 0;
        border-top-width: 2px;
        border-right-width: 2px;
      }
      
      &.bottom-left {
        bottom: 0;
        left: 0;
        border-bottom-width: 2px;
        border-left-width: 2px;
      }
      
      &.bottom-right {
        bottom: 0;
        right: 0;
        border-bottom-width: 2px;
        border-right-width: 2px;
      }
    }
  }
}
</style> 