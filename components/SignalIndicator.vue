<template lang="pug">
.signal-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .signal-bars
    .bar(v-for="i in 5" :key="i" :class="{ active: i <= signalBars }")
  .title
  | СИГНАЛ
  .value {{ value }}
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
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

const signalBars = computed(() => {
  const numValue = Number(props.value)
  if (numValue >= 90) return 5
  if (numValue >= 70) return 4
  if (numValue >= 50) return 3
  if (numValue >= 30) return 2
  if (numValue >= 10) return 1
  return 0
})
</script>

<style lang="scss" scoped>
.signal-indicator {
  position: absolute;
  width: 158px;
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
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .value {
    background: #fff;
    padding: 2px 2px;
    color: #000;
    width: 43px;
    text-align: right;
  }

  .signal-bars {
    display: flex;
    align-items: flex-end;
    height: 15px;
    
    .bar {
      width: 3px;
      margin-right: 1px;
      background-color: #333;
      
      &:nth-child(1) {
        height: 3px;
      }
      
      &:nth-child(2) {
        height: 6px;
      }
      
      &:nth-child(3) {
        height: 9px;
      }
      
      &:nth-child(4) {
        height: 12px;
      }
      
      &:nth-child(5) {
        height: 15px;
      }
      
      &.active {
        background-color: #fff;
      }
    }
  }

}
</style> 