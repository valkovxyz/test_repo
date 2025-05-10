<template lang="pug">
  .drone-ui
    .main-screen
      FlightAttitudeIndicator(
        :roll="roll"
        :pitch="pitch"
        :rollSensitivity="hudSettings.rollSensitivity"
        :pitchSensitivity="hudSettings.pitchSensitivity"
        :externalRollFactor="hudSettings.externalRollFactor"
        :externalPitchFactor="hudSettings.externalPitchFactor"
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
import {ref, watch} from 'vue'
import FlightAttitudeIndicator from '~/components/FlightAttitudeIndicator.vue'

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
</script>

<style lang="scss" scoped>
.drone-ui {
  display: flex;
  align-items: flex-start;
  font-family: 'ARS-M-VCR', monospace;
  background-color: yellow;

  .main-screen {
    border: 2px solid #333;
    overflow: hidden;
    width: 720px;
    height: 480px;
    position: relative;
}

.drone-target {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;

  .center-point {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #0ff;
    box-sizing: border-box;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 4px;
      height: 4px;
      background-color: #0ff;
      border-radius: 50%;
    }
  }

  .horizontal-line {
    position: absolute;
    top: 50%;
    height: 2px;
    background-color: #0ff;

    &.left {
      right: 70%;
      width: 20px;
    }

    &.right {
      left: 70%;
      width: 20px;
    }
  }

  .vertical-line {
    position: absolute;
    left: 50%;
    width: 2px;
    background-color: #0ff;

    &.top {
      bottom: 70%;
      height: 20px;
    }

    &.bottom {
      top: 70%;
      height: 20px;
    }
  }
}

}
</style> 