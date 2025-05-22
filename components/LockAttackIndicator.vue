<template lang="pug">
.lock-attack-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .attack-container АТАКА
</template>

<script setup>
defineProps({
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
.lock-attack-indicator {
  position: absolute;
  width: 78px;
  height: 32px;
  background-color: #000;
  font-family: 'ARS-M-VCR', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transform: translateX(-50%);
  padding: 4px;
  box-sizing: border-box;

  .attack-container {
    width: 100%;
    height: 100%;
    background-color: #DE0202;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
}
</style> 