<template lang="pug">
  .drone-ui
    BackgroundImage(
      ref="backgroundRef"
      :offsetX="backgroundOffset.x"
      :offsetY="backgroundOffset.y"
      :isHorizonMode="isHorizonMode"
      :imageSrc="backgroundImageSrc"
    )
    
    // Прицел виден только в режиме HORIZON
    TargetCrosshair(
      v-if="isHorizonMode"
      :posX="targetPosition.x"
      :posY="targetPosition.y"
      :screenWidth="720"
      :screenHeight="480"
    )
    
    .main-screen
      FlightAttitudeIndicator(
        :roll="roll"
        :pitch="pitch"
        :rollSensitivity="hudSettings.rollSensitivity"
        :pitchSensitivity="hudSettings.pitchSensitivity"
        :externalRollFactor="hudSettings.externalRollFactor"
        :externalPitchFactor="hudSettings.externalPitchFactor"
        :style="horizonModeStyle"
      )

      SpeedAltitudeBlock(
        type="speed"
        title="ШВИДК"
        :value="speed"
        :prevValue="prevSpeed"
        unit="КМГ"
        :posX="10"
        :posY="10"
      )

      SpeedAltitudeBlock(
        type="altitude"
        title="ВИСОТА"
        :value="altitude"
        :prevValue="prevAltitude"
        unit="М"
        :posX="566"
        :posY="10"
      )

      AngleIndicator(
        type="roll"
        title="КРЕН"
        :value="roll"
        :posX="10"
        :posY="106"
      )

      AngleIndicator(
        type="pitch"
        title="ТАНГ"
        :value="pitch"
        :posX="594"
        :posY="106"
      )

      ModeIndicator(
        :mode="mode"
        :posX="10"
        :posY="396"
      )

      GasIndicator(
        :value="gas"
        :posX="10"
        :posY="436"
      )

      FlapsIndicator(
        :value="flaps"
        :posX="120"
        :posY="436"
      )

      SignalIndicator(
        :value="signal"
        :posX="550"
        :posY="396"
      )

      BatteryIndicator(
        :percentage="batteryPercentage"
        :voltage="voltage"
        :posX="501"
        :posY="436"
      )

    TargetZoomPanel(
      ref="zoomPanelRef"
      :isActive="isHorizonMode"
      :targetPosX="targetPosition.x"
      :targetPosY="targetPosition.y"
      :isHorizonMode="isHorizonMode"
      :imageSrc="backgroundImageSrc"
      :mainScreenWidth="720"
      :mainScreenHeight="480"
    )

    DroneSettingsMenu(
      v-model:speed="speed"
      v-model:altitude="altitude"
      v-model:roll="roll"
      v-model:pitch="pitch"
      v-model:mode="mode"
      v-model:gas="gas"
      v-model:flaps="flaps"
      v-model:signal="signal"
      v-model:batteryPercentage="batteryPercentage"
      v-model:voltage="voltage"
      v-model:hudSettings="hudSettings"
    )
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import FlightAttitudeIndicator from '~/components/FlightAttitudeIndicator.vue'
import BackgroundImage from '~/components/BackgroundImage.vue'
import TargetCrosshair from '~/components/TargetCrosshair.vue'
import TargetZoomPanel from '~/components/TargetZoomPanel.vue'

// Путь к фоновому изображению по умолчанию
const backgroundImageSrc = ref('/images/background.png')

const speed = ref(110)
const altitude = ref(100)
const roll = ref(-3)
const pitch = ref(-5)
const mode = ref('STAB')
const gas = ref(95)
const flaps = ref(0)
const signal = ref(88)
const batteryPercentage = ref(72)
const voltage = ref(22.0)

const hudSettings = ref({
  rollSensitivity: 1.0,
  pitchSensitivity: 1.0,
  externalRollFactor: 0.3,
  externalPitchFactor: 0.3
})

const isHorizonMode = computed(() => {
  return mode.value === 'HORIZON'
})

const horizonModeStyle = computed(() => {
  if (isHorizonMode.value) {
    return {
      transform: 'translateY(-96px)'
    }
  }
  return {}
})
const targetPosition = ref({
  x: 0.5,
  y: 0.4
})

const targetMoveStep = ref(0.01)

const updateTargetPosition = (x, y) => {
  targetPosition.value = {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y))
  }
}

const moveTarget = (deltaX, deltaY) => {
  updateTargetPosition(
    targetPosition.value.x + deltaX,
    targetPosition.value.y + deltaY
  )
}

const handleKeyDown = (event) => {
  if (!isHorizonMode.value) return
  
  const step = targetMoveStep.value
  
  switch(event.key) {
    case 'ArrowUp':
      moveTarget(0, -step)
      event.preventDefault()
      break
    case 'ArrowDown':
      moveTarget(0, step)
      event.preventDefault()
      break
    case 'ArrowLeft':
      moveTarget(-step, 0)
      event.preventDefault()
      break
    case 'ArrowRight':
      moveTarget(step, 0)
      event.preventDefault()
      break
    case 'Home':
      updateTargetPosition(0.5, 0.5)
      event.preventDefault()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const prevSpeed = ref(speed.value)
const prevAltitude = ref(altitude.value)

let speedStabilizationTimeout = null
let altitudeStabilizationTimeout = null

const STABILIZATION_DELAY = 250

watch(speed, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    prevSpeed.value = oldValue
    
    clearTimeout(speedStabilizationTimeout)
    speedStabilizationTimeout = setTimeout(() => {
      prevSpeed.value = speed.value
    }, STABILIZATION_DELAY)
  } else {
    if (prevSpeed.value !== speed.value) {
        prevSpeed.value = speed.value;
        clearTimeout(speedStabilizationTimeout);
    }
  }
})

watch(altitude, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    prevAltitude.value = oldValue
    
    clearTimeout(altitudeStabilizationTimeout)
    altitudeStabilizationTimeout = setTimeout(() => {
      prevAltitude.value = altitude.value
    }, STABILIZATION_DELAY)
  } else {
    if (prevAltitude.value !== altitude.value) {
        prevAltitude.value = altitude.value;
        clearTimeout(altitudeStabilizationTimeout);
    }
  }
})

const backgroundRef = ref(null)
const zoomPanelRef = ref(null)
const backgroundOffset = ref({ x: 0, y: 0 })

const updateBackgroundImage = (newSrc) => {
  backgroundImageSrc.value = newSrc
  
  if (backgroundRef.value) {
    backgroundRef.value.updateImage(newSrc)
  }
  
  if (zoomPanelRef.value) {
    zoomPanelRef.value.updateImage(newSrc)
  }
}

const updateBackgroundPosition = (x, y) => {
  backgroundOffset.value = { x, y }
}

watch(mode, (newMode) => {
  if (newMode === 'HORIZON') {
    if (targetPosition.value.x === 0.5 && targetPosition.value.y === 0.5) {
      updateTargetPosition(0.5, 0.4)
    }
  }
})

defineExpose({
  updateBackgroundPosition,
  updateTargetPosition,
  updateBackgroundImage,
  moveTarget,
  setTargetMoveStep: (step) => {
    targetMoveStep.value = Math.max(0.001, Math.min(0.1, step))
  }
})
</script>

<style lang="scss" scoped>
.drone-ui {
  display: flex;
  align-items: flex-start;
  font-family: 'ARS-M-VCR', monospace;
  position: relative;
  width: 720px;
  height: 480px;

  .main-screen {
    border: 2px solid #333;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style> 