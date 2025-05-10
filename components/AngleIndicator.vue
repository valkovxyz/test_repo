<template lang="pug">
.angle-indicator(
  :class="{ 'roll': type === 'roll', 'pitch': type === 'pitch' }"
  :style="{ left: `${posX}px`, top: `${posY}px` }"
)
  .title {{ title }}
  .value {{ value }}°
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['roll', 'pitch'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
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
.angle-indicator {
  position: absolute;
  width: 116px;
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
    padding: 2px 2px;
    color: #000;
    width: 48px;
    text-align: right;
  }
}
</style> 