<template lang="pug">
.drop-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .title 
    img.drop-icon(src="/images/drop_icon.svg" alt="drop icon")
    | СКИД
  .value(:class="{ 'zero-value': value == 0 }") {{ value }}
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
.drop-indicator {
  position: absolute;
  width: 122px;
  height: 32px;
  background-color: #2600FF;
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
    display: flex;
    align-items: center;
    gap: 4px;
    
    .drop-icon {
      width: 24px;
      height: 24px;
    }
  }

  .value {
    background-color: #00ffff;
    width: 21px;
    text-align: center;
    padding: 2px;
    font-size: 20px;
    color: #000;
    
    &.zero-value {
      background-color: #000;
      color: #fff;
    }
  }
}
</style> 