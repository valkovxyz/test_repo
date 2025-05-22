<template lang="pug">
  .drone-ui
    // Слой 1: Фон (z-index: 1)
    BackgroundImage(
      ref="backgroundRef"
      :offsetX="backgroundOffset.x"
      :offsetY="backgroundOffset.y"
      :isHorizonMode="isHorizonMode"
      :imageSrc="backgroundImageSrc"
    )

    // Слой 2: Прицелы и FAI (z-index: 10)
    .aiming-layer
      FlightAttitudeIndicator(
        :internalRoll="internalRoll"
        :externalRoll="externalRoll"
        :internalPitch="internalPitch"
        :externalPitch="externalPitch"
        :rollSensitivity="hudSettings.rollSensitivity"
        :pitchSensitivity="hudSettings.pitchSensitivity"
        :externalRollFactor="hudSettings.externalRollFactor"
        :externalPitchFactor="hudSettings.externalPitchFactor"
        :posX="358"
        :posY="118"
        :style="horizonModeStyle"
      )

      // Подслой 2.1: Пунктирная линия (z-index: 11)
      .aim-line-layer
        AimLine(
          v-if="isAimMode"
          :isActive="isAimMode"
          :length="aimLineLength"
          :angle="aimLineAngle"
          :centerX="360"
          :centerY="120"
          :squareSize="squareSize"
          :squarePosition="squarePosition"
          :reticleOffsetX="reticleOffsetX"
          :reticleOffsetY="reticleOffsetY"
        )

      // Подслой 2.2: Квадрат и прицелы (z-index: 12)
      .crosshair-layer
        TargetCrosshair(
          v-if="isHorizonMode || (crosshairMode === 4) || (crosshairMode === 5)"
          ref="targetCrosshairRef"
          :posX="targetPosition.x"
          :posY="targetPosition.y"
          :screenWidth="720"
          :screenHeight="480"
          :crosshairMode="crosshairMode"
          :isHorizonMode="isHorizonMode"
          :faiOffset="faiOffsetNormalized"
          :faiCenterX="flightAttitudeCenter.x"
          :faiCenterY="flightAttitudeCenter.y"
          v-model:targetPercentage="targetPercentage"
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
        :crosshairMode="crosshairMode"
      )

    // Слой 3: Индикаторы со значениями (z-index: 20)
    .indicators-layer
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
        :value="internalRoll"
        :posX="10"
        :posY="106"
      )

      AngleIndicator(
        type="pitch"
        title="ТАНГ"
        :value="internalPitch"
        :posX="594"
        :posY="106"
      )

      AimIndicator(
        v-if="isAimMode"
        :isActive="isAimMode"
        :posX="10"
        :posY="356"
      )

      FlightModeIndicator(
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

      DropIndicator(
        v-if="isAimMode"
        :value="skidValue"
        :posX="598"
        :posY="356"
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

      // Подслой 3.1: Индикаторы квадрата (z-index: 25)
      .lock-indicators-layer
        LockIndicator(
          v-if="crosshairMode === 4"
          :value="targetPercentage"
          :posX="360"
          :posY="436"
        )

        LockAttackIndicator(
          v-if="crosshairMode === 5"
          :posX="360"
          :posY="436"
        )

    DroneSettingsMenu(
      v-model:speed="speed"
      v-model:altitude="altitude"
      v-model:internalRoll="internalRoll"
      v-model:externalRoll="externalRoll"
      v-model:internalPitch="internalPitch"
      v-model:externalPitch="externalPitch"
      v-model:mode="mode"
      v-model:gas="gas"
      v-model:flaps="flaps"
      v-model:signal="signal"
      v-model:batteryPercentage="batteryPercentage"
      v-model:voltage="voltage"
      v-model:hudSettings="hudSettings"
      v-model:crosshairMode="crosshairMode"
      v-model:isAimMode="isAimMode"
      v-model:aimLineLength="aimLineLength"
      v-model:aimLineAngle="aimLineAngle"
      v-model:skidValue="skidValue"
      v-model:squarePosition="squarePosition"
      v-model:squareSize="squareSize"
      v-model:reticleOffsetX="reticleOffsetX"
      v-model:reticleOffsetY="reticleOffsetY"
      v-model:targetPercentage="targetPercentage"
    )
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import FlightAttitudeIndicator from '~/components/FlightAttitudeIndicator.vue'
import BackgroundImage from '~/components/BackgroundImage.vue'
import TargetCrosshair from '~/components/TargetCrosshair.vue'
import TargetZoomPanel from '~/components/TargetZoomPanel.vue'
import AimIndicator from '~/components/AimIndicator.vue'
import DropIndicator from '~/components/DropIndicator.vue'
import AimLine from '~/components/AimLine.vue'
import SpeedAltitudeBlock from '~/components/SpeedAltitudeBlock.vue'
import AngleIndicator from '~/components/AngleIndicator.vue'
import FlightModeIndicator from '~/components/FlightModeIndicator.vue'
import GasIndicator from '~/components/GasIndicator.vue'
import FlapsIndicator from '~/components/FlapsIndicator.vue'
import SignalIndicator from '~/components/SignalIndicator.vue'
import BatteryIndicator from '~/components/BatteryIndicator.vue'
import LockIndicator from '~/components/LockIndicator.vue'
import LockAttackIndicator from '~/components/LockAttackIndicator.vue'

const backgroundImageSrc = ref('/images/background2.png')

const internalRoll = ref(0)
const externalRoll = ref(0)
const internalPitch = ref(0)
const externalPitch = ref(0)
const hudSettings = ref({
  rollSensitivity: 1,
  pitchSensitivity: 1,
  externalRollFactor: 1,
  externalPitchFactor: 1
})

const speed = ref(110)
const altitude = ref(100)
const mode = ref('STAB')
const crosshairMode = ref(1)
const isAimMode = ref(false)
const aimLineLength = ref(180)
const aimLineAngle = ref(0)
const gas = ref(42)
const flaps = ref(0)
const signal = ref(88)
const batteryPercentage = ref(13)
const voltage = ref(37.0)
const skidValue = ref(0)
const squarePosition = ref(100)
const squareSize = ref(124)
const reticleOffsetX = ref(0)
const reticleOffsetY = ref(0)
const targetPercentage = ref(56)
const faiOffsetNormalized = ref({ x: 0, y: 0 })
const flightAttitudeCenter = ref({ x: 358, y: 118 })

const isHorizonMode = computed(() => {
  return mode.value === 'HORIZON'
})

const horizonModeStyle = computed(() => {
  if (isHorizonMode.value) {
    return {
      transform: 'translate(-50%, calc(-50% - 86px))',
      transition: 'transform 0.5s ease-out'
    }
  }
  return {
    transform: 'translate(-50%, -50%)',
    transition: 'transform 0.5s ease-out'
  }
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
const targetCrosshairRef = ref(null)
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

watch(mode, (newMode, oldMode) => {
  if (newMode === 'HORIZON') {
    if (targetPosition.value.x === 0.5 && targetPosition.value.y === 0.5) {
      updateTargetPosition(0.5, 0.4)
    }
    isAimMode.value = false

    if (crosshairMode.value === 4) {
      crosshairMode.value = 1
    }
  } else if (newMode === 'STAB' && oldMode === 'HORIZON') {
  }
})

watch(crosshairMode, (newMode) => {
  if (newMode === 4 && mode.value === 'HORIZON') {
    mode.value = 'STAB'
  }

  if (newMode === 5) {
    mode.value = 'AUTO'
  }
})

watch(isAimMode, (newValue) => {
  if (newValue) {
    aimLineLength.value = 180
    squarePosition.value = 100
    reticleOffsetX.value = 0
    reticleOffsetY.value = 0
  }
})

watch(aimLineLength, (newValue) => {
  if (squarePosition.value === 0) {
    squarePosition.value = 0
  }
})

// Вычисляемое значение общего крена как среднее арифметическое
const averageRoll = computed(() => {
  return (internalRoll.value + externalRoll.value) / 2
})

// Вычисляемое значение общего тангажа как среднее арифметическое  
const averagePitch = computed(() => {
  return (internalPitch.value + externalPitch.value) / 2
})

defineExpose({
  updateBackgroundPosition,
  updateTargetPosition,
  updateBackgroundImage,
  moveTarget,
  setTargetMoveStep: (step) => {
    targetMoveStep.value = Math.max(0.001, Math.min(0.1, step))
  },
  getDisplayTargetPosition: () => {
    if (targetCrosshairRef.value && (crosshairMode.value === 4 || crosshairMode.value === 5)) {
      return {
        ...targetCrosshairRef.value.displayPosition,
        percentage: targetPercentage.value
      };
    }
    return {
      ...targetPosition.value,
      percentage: targetPercentage.value
    };
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

  // Слой 1: Фон
  .background-image {
    position: absolute;
    z-index: 1;
  }

  // Слой 2: Прицелы и FAI  
  .aiming-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;

    // Подслой 2.1: Пунктирная линия
    .aim-line-layer {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 11;
      pointer-events: none;
    }

    // Подслой 2.2: Квадрат и прицелы
    .crosshair-layer {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 12;
      pointer-events: none;
    }
  }

  // Слой 3: Индикаторы со значениями
  .indicators-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 20;
    pointer-events: none;

    // Подслой 3.1: Индикаторы квадрата
    .lock-indicators-layer {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 25;
      pointer-events: none;
    }
  }

  .target-crosshair {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 200;
  }
}
</style> 
