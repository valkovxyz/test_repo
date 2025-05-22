<template lang="pug">
.aim-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .title ПРИЦЕЛ
  .value(:class="`aim-${isActive ? 'active' : 'inactive'}`") {{ isActive ? 'УВІМКН' : 'ВИМКН' }}
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
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
.aim-indicator {
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

    &.aim-active {
      background-color: #00ffff;
      color: #000;
    }

    &.aim-inactive {
      background-color: #444;
      color: #fff;
    }
  }
}
</style> 
