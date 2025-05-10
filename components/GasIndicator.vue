<template lang="pug">
.gas-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .title ГАЗ
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
.gas-indicator {
  position: absolute;
  width: 102px;
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
    background: #fff;
    padding: 2px 4px;
    color: #000;
    width: 44px;
    text-align: right;
  }

}
</style> 