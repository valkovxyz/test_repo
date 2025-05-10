<template lang="pug">
.flaps-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .title ЗАКР
  .value {{ value }}
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
.flaps-indicator {
  position: absolute;
  width: 90px;
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
    padding: 2px 1px 2px 0;
    color: #000;
    width: 30px;
    text-align: right;
  }
}
</style> 