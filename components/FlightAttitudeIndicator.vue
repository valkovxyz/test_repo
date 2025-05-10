<template lang="pug">
.flight-attitude-indicator
  .stable-horizon(:style="stableHorizonStyle")
    .horizon-line.far-left
    .horizon-line.far-right

  .artificial-horizon(:style="horizonStyle")
    .horizon-lines
      .horizon-line.left
      .horizon-line.right
  
  .crosshair-container
    .center-point
    .crosshair-lines
      .horizontal-line.left
      .horizontal-line.right
      .vertical-line.top
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  roll: {
    type: [Number, String],
    default: 0
  },
  pitch: {
    type: [Number, String],
    default: 0
  },
  rollSensitivity: {
    type: [Number, String],
    default: 1.0  
  },
  pitchSensitivity: {
    type: [Number, String],
    default: 1.0
  },
  externalRollFactor: {
    type: [Number, String],
    default: 0.3
  },
  externalPitchFactor: {
    type: [Number, String],
    default: 0.3
  }
})

const rollValue = computed(() => Number(props.roll))
const pitchValue = computed(() => Number(props.pitch))
const rollSensValue = computed(() => Number(props.rollSensitivity))
const pitchSensValue = computed(() => Number(props.pitchSensitivity))
const extRollFactor = computed(() => Number(props.externalRollFactor))
const extPitchFactor = computed(() => Number(props.externalPitchFactor))

const horizonStyle = computed(() => {
  return {
    transform: `rotateZ(${-rollValue.value * rollSensValue.value}deg)`,
    marginTop: `${pitchValue.value * pitchSensValue.value * 4}px`
  }
})

const stableHorizonStyle = computed(() => {
  return {
    transform: `rotateZ(${-rollValue.value * rollSensValue.value * extRollFactor.value}deg)`,
    marginTop: `${pitchValue.value * pitchSensValue.value * extPitchFactor.value * 4}px`
  }
})

defineExpose({
  rollSensValue,
  pitchSensValue,
  extRollFactor,
  extPitchFactor
})
</script>

<style lang="scss" scoped>
.flight-attitude-indicator {
  position: absolute;
  top: 106px;
  left: 116px;
  width: calc(100% - 232px);
  height: 32px;
  overflow: visible;
  pointer-events: none;
  z-index: 10;

  .stable-horizon {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: center;
    
    .horizon-line {
      position: absolute;
      top: 50%;
      height: 4px;
      background-color: #0ff;
      
      &.far-left {
        right: 57%;
        width: 50px;
        margin-right: 69px;
      }
      
      &.far-right {
        left: 57%;
        width: 50px;
        margin-left: 69px;
      }
    }
  }

  .artificial-horizon {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: center;
    
    .horizon-lines {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 4px;
      
      .horizon-line {
        position: absolute;
        top: 0;
        height: 4px;
        background-color: #0ff;
        
        &.left {
          right: 57%;
          width: 34px;
          margin-right: 35px;
        }
        
        &.right {
          left: 57%;
          width: 34px;
          margin-left: 35px;
        }
      }
    }
  }

  .crosshair-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .center-point {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 4px solid #0ff;
      box-sizing: border-box;
    }
    
    .crosshair-lines {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      
      .horizontal-line {
        position: absolute;
        top: 50%;
        height: 4px;
        background-color: #0ff;
        
        &.left {
          right: 50%;
          width: 14px;
          margin-right: 8px;
        }
        
        &.right {
          left: 50%;
          width: 14px;
          margin-left: 8px;
        }
      }
      
      .vertical-line {
        position: absolute;
        left: 50%;
        width: 4px;
        background-color: #0ff;
        
        &.top {
          bottom: 50%;
          height: 14px;
          margin-bottom: 8px;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style> 