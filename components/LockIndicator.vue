<template lang="pug">
.lock-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .title УТРИМАННЯ
  .value {{ value }}%
</template>

<script setup>
defineProps({
  value: {
    type: [Number, String],
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
.lock-indicator {
  position: absolute;
  width: 181px;
  height: 32px;
  background-color: #000;
  color: #fff;
  font-family: 'ARS-M-VCR', monospace;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  box-sizing: border-box;
  z-index: 5;
  transform: translateX(-50%);

  .title {
    text-transform: uppercase;
  }
  
  .value {
    width: 45px;
    text-align: right;
    padding: 2px 4px;
    background-color: #00ffff;
    color: #000;
  }
}
</style> 