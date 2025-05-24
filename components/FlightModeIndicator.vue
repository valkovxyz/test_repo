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
  width: 183px;
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
    margin-right: 4px;
  }

  .value {
    width: 80px;
    text-align: center;
    padding: 2px 8px;
    text-transform: uppercase;
    
    &.mode-stab {
      background-color: #008000;
      color: #000;
    }
    
    &.mode-horizon {
      background-color: #C202FD;
    }
    
    &.mode-auto {
      background-color: #2600FF;
    }
  }
}
</style> 