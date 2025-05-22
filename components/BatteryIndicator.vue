<template lang="pug">
.battery-indicator(:style="{ left: `${posX}px`, top: `${posY}px` }")
  .left-content
    .icon
      .battery-outline
        .battery-bars
          .battery-bar(v-for="i in 3" :key="i" :class="{ active: i <= batteryBars }")
    .text БАТ
  .right-content
    .value {{ percentage }}%
    .voltage {{ formattedVoltage }}v
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: {
    type: [Number, String],
    required: true
  },
  voltage: {
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

const formattedVoltage = computed(() => {
  const voltageNum = Number(props.voltage)
  return `${voltageNum.toFixed(1)}`
})

const batteryBars = computed(() => {
  const percent = Number(props.percentage)
  if (percent >= 75) return 3
  if (percent >= 50) return 2
  if (percent >= 25) return 1
  return 0
})

const isCritical = computed(() => {
  return Number(props.percentage) <= 20
})

const batteryColor = computed(() => {
  const level = Number(props.percentage)
  if (level <= 20) return '#f00'
  if (level <= 40) return '#ff0'
  return '#0f0'
})
</script>

<style lang="scss" scoped>
.battery-indicator {
  position: absolute;
  min-width: 208px;
  max-width: 208px;
  height: 32px;
  background-color: #000;
  color: #fff;
  font-family: 'ARS-M-VCR', monospace;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left-content {
    display: flex;
    align-items: center;
  }

  .right-content {
    display: flex;
    align-items: center;
  }
  
  .icon {
    width: 32px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #111;
    position: relative;
    
    .battery-outline {
      width: 14px;
      height: 12px;
      border: 1.5px solid #fff;
      position: relative;
      box-sizing: border-box;
      
      .battery-bars {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 0 1px;
        box-sizing: border-box;
        
        .battery-bar {
          width: 2px;
          height: 5px;
          background-color: transparent;
          
          &.active {
            background-color: #fff;
          }
        }
      }
      
      &:after {
        content: '';
        position: absolute;
        width: 2px;
        height: 5px;
        background-color: #fff;
        right: -3px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  
  .text {
    padding: 0 4px;
  }
  
  .value {
    padding: 2px 4px;
    width: 45px;
    text-align: right;
    background-color: #fff;
    color: #000000;
    margin-right: 4px;
  }
  
  .voltage {
    background-color: #00807C;
    padding: 2px 4px;
    margin-right: 4px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
  }
}
</style> 