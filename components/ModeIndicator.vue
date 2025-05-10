<template lang="pug">
.mode-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .title РЕЖИМ
  .value(:class="`mode-${mode.toLowerCase()}`") {{ mode }}
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: true
  },
  posX: {
    type: Number,
    default: 0
  },
  posY: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="scss" scoped>
.mode-indicator {
  position: absolute;
  width: 148px;
  height: 32px;
  background-color: #000;
  color: #fff;
  font-family: 'ARS-M-VCR', monospace;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  box-sizing: border-box;

  .title {
    text-transform: uppercase;
  }

  .value {
    padding: 2px 8px;
    text-transform: uppercase;
    
    &.mode-stab {
      background-color: #008000;
      color: #000;
    }
    
    &.mode-gps {
      background-color: #00f;
    }
    
    &.mode-auto {
      background-color: #f00;
    }
  }
}
</style> 