<template lang="pug">
  .flight-attitude-indicator(:style="positionStyle")
    svg(
      width="400px" 
      height="100px" 
      viewBox="-200 -50 400 100" 
      preserveAspectRatio="xMidYMid meet"
    )
      g.stable-horizon(:transform="`rotate(${-externalRollValue}) translate(0, ${-externalPitchValue * 2})`")
        line.horizon-line.far-left(x1="-180" y1="0" x2="-100" y2="0" stroke="#0ff" stroke-width="4")
        line.horizon-line.far-right(x1="100" y1="0" x2="180" y2="0" stroke="#0ff" stroke-width="4")

      g.artificial-horizon(:transform="`rotate(${-internalRollValue}) translate(0, ${-internalPitchValue * 2})`")
        line.horizon-line.left(x1="-90" y1="0" x2="-40" y2="0" stroke="#0ff" stroke-width="4")
        line.horizon-line.right(x1="40" y1="0" x2="90" y2="0" stroke="#0ff" stroke-width="4")

      g.crosshair-container
        circle.center-point(cx="0" cy="0" r="8" fill="none" stroke="#0ff" stroke-width="4")
        line.horizontal-line.left(x1="-28" y1="0" x2="-8" y2="0" stroke="#0ff" stroke-width="4")
        line.horizontal-line.right(x1="8" y1="0" x2="28" y2="0" stroke="#0ff" stroke-width="4")
        line.vertical-line.top(x1="0" y1="-22" x2="0" y2="-8" stroke="#0ff" stroke-width="4")
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    internalRoll: {
      type: [Number, String],
      default: 0
    },
    externalRoll: {
      type: [Number, String],
      default: 0
    },
    internalPitch: {
      type: [Number, String],
      default: 0
    },
    externalPitch: {
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
      default: 1.0
    },
    externalPitchFactor: {
      type: [Number, String],
      default: 1.0
    },
    posX: {
      type: [Number, String],
      default: 116
    },
    posY: {
      type: [Number, String],
      default: 106
    }
  })
  
  const internalRollValue = computed(() => Number(props.internalRoll))
  const externalRollValue = computed(() => Number(props.externalRoll))
  const internalPitchValue = computed(() => Number(props.internalPitch))
  const externalPitchValue = computed(() => Number(props.externalPitch))
  const rollSensValue = computed(() => Number(props.rollSensitivity))
  const pitchSensValue = computed(() => Number(props.pitchSensitivity))
  const extRollFactor = computed(() => Number(props.externalRollFactor))
  const extPitchFactor = computed(() => Number(props.externalPitchFactor))
  
  const positionStyle = computed(() => {
    return {
      left: `${props.posX}px`,
      top: `${props.posY}px`
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
  width: 400px;
  height: 100px;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: $mix-blend-value;

  svg {
    overflow: visible;
    
    g {
      transition: transform 0.3s ease-out;
    }
  }
}
  </style> 