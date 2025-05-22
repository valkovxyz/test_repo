<template lang="pug">
.skid-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .title СКИД
  .value {{ value }}
</template>

<script setup>
defineProps({
  value: {
    type: [Number, String],
    default: 0
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
.skid-indicator {
  position: absolute;
  width: 110px;
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
    background-color: #00ffff;
    width: 32px;
    text-align: center;
    padding: 2px 4px;
    font-size: 20px;
  }
}
</style> 