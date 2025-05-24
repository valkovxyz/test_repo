<template lang="pug">
.drone-settings-menu
  .menu-title HUD
  
  .settings-section
    .section-content
      .settings-group
        .setting-title Режим польоту
        .setting-control
          select(v-model="localMode" @change="updateMode")
            option(value="STAB") STAB
            option(value="HORIZON") HORIZON
            option(value="AUTO") AUTO
  
  .settings-section
    .section-content
      .settings-group
        .setting-title Режим прицілу
        .setting-control
          select(v-model="localCrosshairMode" @change="updateCrosshairMode")
            option(:value="0") 0
            option(:value="1") 1
            option(:value="2") 2
            option(:value="3") 3
            option(:value="4") 4
            option(:value="5") 5
        
      .settings-group(v-if="parseInt(localCrosshairMode) === 4 || parseInt(localCrosshairMode) === 5")
        .setting-title 
        .setting-control
          input(
            type="range"
            min="1"
            max="100"
            step="1"
            v-model="localTargetPercentage"
            @input="updateTargetPercentage"
          )
          .setting-value {{ localTargetPercentage }}%
  
  .settings-section
    .section-content
      .settings-group
        .setting-title СКИД
        .setting-control
          .checkbox-control
            input(
              type="checkbox"
              v-model="localIsAimMode"
              @change="updateIsAimMode"
            )
            .label {{ localIsAimMode ? 'УВМКН' : 'ВИМКН' }}

      .settings-group(v-if="localIsAimMode")
        .setting-title Длина линии
        .setting-control
          input(
            type="range"
            min="0"
            max="360"
            step="10"
            v-model="localAimLineLength"
            @input="updateAimLineLength"
          )
          .setting-value {{ aimLineLength }}px

      .settings-group(v-if="localIsAimMode")
        .setting-title Угол линии
        .setting-control
          input(
            type="range"
            min="-90"
            max="90"
            step="5"
            v-model="localAimLineAngle"
            @input="updateAimLineAngle"
          )
          .setting-value {{ aimLineAngle }}°

      .settings-group(v-if="localIsAimMode")
        .setting-title Квадрат
        .setting-control
          input(
            type="range"
            min="0"
            max="100"
            step="5"
            v-model="localSquarePosition"
            @input="updateSquarePosition"
          )
          .setting-value {{ squarePosition }}%

      .settings-group(v-if="localIsAimMode")
        .setting-title Прицел X
        .setting-control
          input(
            type="range"
            min="-100"
            max="100"
            step="5"
            v-model="localReticleOffsetX"
            @input="updateReticleOffsetX"
          )
          .setting-value {{ reticleOffsetX }}

      .settings-group(v-if="localIsAimMode")
        .setting-title Прицел Y
        .setting-control
          input(
            type="range"
            min="-100"
            max="100"
            step="5"
            v-model="localReticleOffsetY"
            @input="updateReticleOffsetY"
          )
          .setting-value {{ reticleOffsetY }}

      .settings-group(v-if="localIsAimMode")
        .setting-title СКИД
        .setting-control
          input(
            type="range"
            min="0"
            max="9"
            step="1"
            v-model="localSkidValue"
            @input="updateSkidValue"
          )
          .setting-value {{ skidValue }}
  
  .settings-section
    .section-header(@click="toggleSection('hudBasic')")
      .section-title Індикатори
      .section-toggle {{ sectionStates.hudBasic ? '▼' : '►' }}
    .section-content(v-if="sectionStates.hudBasic")
      .settings-group
        .setting-title Швидк
        .setting-control
          input(
            type="range"
            min="0"
            max="200"
            step="1"
            v-model="localSpeed"
            @input="updateSpeed"
          )
          .setting-value {{ speed }} км/г
      
      .settings-group
        .setting-title Висота
        .setting-control
          input(
            type="range"
            min="0"
            max="500"
            step="1"
            v-model="localAltitude"
            @input="updateAltitude"
          )
          .setting-value {{ altitude }} м
      
      .settings-group
        .setting-title Крен внутр
        .setting-control
          input(
            type="range"
            min="-45"
            max="45"
            step="1"
            v-model="localInternalRoll"
            @input="updateInternalRoll"
          )
          .setting-value {{ internalRoll }}°
      
      .settings-group
        .setting-title Крен зовн
        .setting-control
          input(
            type="range"
            min="-45"
            max="45"
            step="1"
            v-model="localExternalRoll"
            @input="updateExternalRoll"
          )
          .setting-value {{ externalRoll }}°
      
      .settings-group
        .setting-title Танг внутр
        .setting-control
          .range-with-labels
            .min-label 
            input(
              type="range"
              min="-45"
              max="45"
              step="1"
              v-model="localInternalPitch"
              @input="updateInternalPitch"
            )
            .max-label 
          .setting-value {{ internalPitch }}°
      
      .settings-group
        .setting-title Танг зовн
        .setting-control
          .range-with-labels
            .min-label 
            input(
              type="range"
              min="-45"
              max="45"
              step="1"
              v-model="localExternalPitch"
              @input="updateExternalPitch"
            )
            .max-label 
          .setting-value {{ externalPitch }}°
      
      .settings-group
        .setting-title Газ
        .setting-control
          input(
            type="range"
            min="0"
            max="100"
            step="1"
            v-model="localGas"
            @input="updateGas"
          )
          .setting-value {{ gas }}%
      
      .settings-group
        .setting-title Закр
        .setting-control
          input(
            type="range"
            min="0"
            max="10"
            step="1"
            v-model="localFlaps"
            @input="updateFlaps"
          )
          .setting-value {{ flaps }}
      
      .settings-group
        .setting-title Сигнал
        .setting-control
          input(
            type="range"
            min="0"
            max="100"
            step="1"
            v-model="localSignal"
            @input="updateSignal"
          )
          .setting-value {{ signal }}
      
      .settings-group
        .setting-title Батарея
        .setting-control
          input(
            type="range"
            min="0"
            max="100"
            step="1"
            v-model="localBatteryPercentage"
            @input="updateBatteryPercentage"
          )
          .setting-value {{ batteryPercentage }}%
      
      .settings-group
        .setting-title Напр. бат
        .setting-control
          input(
            type="range"
            min="10"
            max="30"
            step="0.1"
            v-model="localVoltage"
            @input="updateVoltage"
          )
          .setting-value {{ voltage }}v
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

const props = defineProps({
  speed: {
    type: [Number, String],
    default: 110
  },
  altitude: {
    type: [Number, String],
    default: 100
  },
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
  mode: {
    type: String,
    default: 'STAB'
  },
  gas: {
    type: [Number, String],
    default: 95
  },
  flaps: {
    type: [Number, String],
    default: 0
  },
  signal: {
    type: [Number, String],
    default: 88
  },
  batteryPercentage: {
    type: [Number, String],
    default: 72
  },
  voltage: {
    type: [Number, String],
    default: 22.0
  },
  hudSettings: {
    type: Object,
    default: () => ({
      rollSensitivity: 1.0,
      pitchSensitivity: 1.0,
      externalRollFactor: 0.3,
      externalPitchFactor: 0.3
    })
  },
  crosshairMode: {
    type: Number,
    default: 0
  },
  isAimMode: {
    type: Boolean,
    default: false
  },
  aimLineLength: {
    type: [Number, String],
    default: 180
  },
  aimLineAngle: {
    type: [Number, String],
    default: 0
  },
  skidValue: {
    type: [Number, String],
    default: 0
  },
  squarePosition: {
    type: [Number, String],
    default: 100
  },
  squareSize: {
    type: [Number, String],
    default: 124
  },
  reticleOffsetX: {
    type: [Number, String],
    default: 0
  },
  reticleOffsetY: {
    type: [Number, String],
    default: 0
  },
  targetPercentage: {
    type: Number,
    default: 56
  }
})

const emit = defineEmits([
  'update:speed',
  'update:altitude',
  'update:internalRoll',
  'update:externalRoll',
  'update:internalPitch',
  'update:externalPitch',
  'update:mode',
  'update:gas',
  'update:flaps',
  'update:signal',
  'update:batteryPercentage',
  'update:voltage',
  'update:hudSettings',
  'update:crosshairMode',
  'update:isAimMode',
  'update:aimLineLength',
  'update:aimLineAngle',
  'update:skidValue',
  'update:squarePosition',
  'update:squareSize',
  'update:reticleOffsetX',
  'update:reticleOffsetY',
  'update:targetPercentage'
])
const sectionStates = reactive({
  flightMode: false,
  crosshair: false,
  aimMode: false,
  hudBasic: false
})

const toggleSection = (section) => {
  sectionStates[section] = !sectionStates[section]
}

const localSpeed = ref(props.speed)
const localAltitude = ref(props.altitude)
const localInternalRoll = ref(props.internalRoll)
const localExternalRoll = ref(props.externalRoll)
const localInternalPitch = ref(props.internalPitch)
const localExternalPitch = ref(props.externalPitch)
const localMode = ref(props.mode)
const localGas = ref(props.gas)
const localFlaps = ref(props.flaps)
const localSignal = ref(props.signal)
const localBatteryPercentage = ref(props.batteryPercentage)
const localVoltage = ref(props.voltage)
const localCrosshairMode = ref(props.crosshairMode)
const localIsAimMode = ref(props.isAimMode)
const localAimLineLength = ref(props.aimLineLength)
const localAimLineAngle = ref(props.aimLineAngle)
const localSkidValue = ref(props.skidValue)
const localSquarePosition = ref(props.squarePosition)
const localReticleOffsetX = ref(props.reticleOffsetX)
const localReticleOffsetY = ref(props.reticleOffsetY)
const localTargetPercentage = ref(props.targetPercentage)

const localHUDSettings = ref({
  rollSensitivity: props.hudSettings.rollSensitivity,
  pitchSensitivity: props.hudSettings.pitchSensitivity,
  externalRollFactor: props.hudSettings.externalRollFactor,
  externalPitchFactor: props.hudSettings.externalPitchFactor
})

watch(() => props.speed, (newVal) => {
  localSpeed.value = newVal
})

watch(() => props.altitude, (newVal) => {
  localAltitude.value = newVal
})

watch(() => props.internalRoll, (newValue) => {
  localInternalRoll.value = newValue
})

watch(() => props.externalRoll, (newValue) => {
  localExternalRoll.value = newValue
})

watch(() => props.internalPitch, (newValue) => {
  localInternalPitch.value = newValue
})

watch(() => props.externalPitch, (newValue) => {
  localExternalPitch.value = newValue
})

watch(() => props.mode, (newVal) => {
  localMode.value = newVal
})

watch(() => props.gas, (newVal) => {
  localGas.value = newVal
})

watch(() => props.flaps, (newVal) => {
  localFlaps.value = newVal
})

watch(() => props.signal, (newVal) => {
  localSignal.value = newVal
})

watch(() => props.batteryPercentage, (newVal) => {
  localBatteryPercentage.value = newVal
})

watch(() => props.voltage, (newVal) => {
  localVoltage.value = newVal
})

watch(() => props.hudSettings, (newVal) => {
  localHUDSettings.value = {
    rollSensitivity: newVal.rollSensitivity,
    pitchSensitivity: newVal.pitchSensitivity,
    externalRollFactor: newVal.externalRollFactor,
    externalPitchFactor: newVal.externalPitchFactor
  }
}, { deep: true })

watch(() => props.crosshairMode, (newVal) => {
  localCrosshairMode.value = newVal
})

watch(() => props.isAimMode, (newVal) => {
  localIsAimMode.value = newVal
})

watch(() => props.aimLineLength, (newVal) => {
  localAimLineLength.value = newVal
})

watch(() => props.aimLineAngle, (newVal) => {
  localAimLineAngle.value = newVal
})

watch(() => props.skidValue, (newVal) => {
  localSkidValue.value = newVal
})

watch(() => props.squarePosition, (newVal) => {
  localSquarePosition.value = newVal
})

watch(() => props.reticleOffsetX, (newVal) => {
  localReticleOffsetX.value = newVal
})

watch(() => props.reticleOffsetY, (newVal) => {
  localReticleOffsetY.value = newVal
})

watch(() => props.targetPercentage, (newVal) => {
  localTargetPercentage.value = newVal
})

const updateSpeed = () => {
  emit('update:speed', parseInt(localSpeed.value))
}

const updateAltitude = () => {
  emit('update:altitude', parseInt(localAltitude.value))
}

const updateInternalRoll = () => {
  emit('update:internalRoll', Number(localInternalRoll.value))
}

const updateExternalRoll = () => {
  emit('update:externalRoll', Number(localExternalRoll.value))
}

const updateInternalPitch = () => {
  emit('update:internalPitch', Number(localInternalPitch.value))
}

const updateExternalPitch = () => {
  emit('update:externalPitch', Number(localExternalPitch.value))
}

const updateMode = () => {
  emit('update:mode', localMode.value)
}

const updateGas = () => {
  emit('update:gas', parseInt(localGas.value))
}

const updateFlaps = () => {
  emit('update:flaps', parseInt(localFlaps.value))
}

const updateSignal = () => {
  emit('update:signal', parseInt(localSignal.value))
}

const updateBatteryPercentage = () => {
  emit('update:batteryPercentage', parseInt(localBatteryPercentage.value))
}

const updateVoltage = () => {
  emit('update:voltage', parseFloat(localVoltage.value).toFixed(1))
}

const updateHUDRollSensitivity = () => {
  const newSettings = {
    ...props.hudSettings,
    rollSensitivity: parseFloat(localHUDSettings.value.rollSensitivity)
  }
  emit('update:hudSettings', newSettings)
}

const updateHUDPitchSensitivity = () => {
  const newSettings = {
    ...props.hudSettings,
    pitchSensitivity: parseFloat(localHUDSettings.value.pitchSensitivity)
  }
  emit('update:hudSettings', newSettings)
}

const updateHUDExternalRollFactor = () => {
  const newSettings = {
    ...props.hudSettings,
    externalRollFactor: parseFloat(localHUDSettings.value.externalRollFactor)
  }
  emit('update:hudSettings', newSettings)
}

const updateHUDExternalPitchFactor = () => {
  const newSettings = {
    ...props.hudSettings,
    externalPitchFactor: parseFloat(localHUDSettings.value.externalPitchFactor)
  }
  emit('update:hudSettings', newSettings)
}

const updateCrosshairMode = () => {
  emit('update:crosshairMode', parseInt(localCrosshairMode.value))
}

const updateIsAimMode = () => {
  emit('update:isAimMode', localIsAimMode.value)
}

const updateAimLineLength = () => {
  emit('update:aimLineLength', parseInt(localAimLineLength.value, 10))
}

const updateAimLineAngle = () => {
  emit('update:aimLineAngle', parseInt(localAimLineAngle.value, 10))
}

const updateSquarePosition = () => {
  emit('update:squarePosition', parseInt(localSquarePosition.value, 10))
}

const updateReticleOffsetX = () => {
  emit('update:reticleOffsetX', parseInt(localReticleOffsetX.value, 10))
}

const updateReticleOffsetY = () => {
  emit('update:reticleOffsetY', parseInt(localReticleOffsetY.value, 10))
}

const updateSkidValue = () => {
  emit('update:skidValue', parseInt(localSkidValue.value, 10))
}

const updateTargetPercentage = () => {
  emit('update:targetPercentage', parseInt(localTargetPercentage.value))
}

const formatNumber = (value) => {
  return parseFloat(value).toFixed(1)
}
</script>

<style lang="scss" scoped>
.drone-settings-menu {
  position: absolute;
  top: 0;
  right: -320px;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-family: 'ARS-M-VCR', monospace;
  padding: 10px;
  box-sizing: border-box;
  z-index: 10;
}

.menu-title {
  text-align: center;
  margin-bottom: 15px;
  text-transform: uppercase;
  border-bottom: 1px solid #555;
  padding-bottom: 5px;
}

.settings-section {
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: rgba(0, 50, 70, 0.5);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 80, 120, 0.5);
  }
}

.section-title {
  font-weight: bold;
}

.section-toggle {
  color: #0ff;
}

.section-content {
  margin-top: 5px;
  padding-left: 5px;
}

.settings-group {
  margin-bottom: 10px;
}

.setting-title {
  margin-bottom: 5px;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 10px;
  
  input[type="range"] {
    flex: 1;
    -webkit-appearance: none;
    height: 8px;
    background: #333;
    border-radius: 4px;
    outline: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 15px;
      height: 15px;
      background: #0ff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  
  select {
    width: 100%;
    background-color: #222;
    color: #fff;
    border: 1px solid #555;
    padding: 5px;
    font-family: 'ARS-M-VCR', monospace;
    
    option {
      background-color: #222;
    }
  }
  
  .setting-value {
    width: 60px;
    font-size: 12px;
    text-align: right;
  }
  
  .checkbox-control {
    display: flex;
    align-items: center;
    width: 100%;
    
    input[type="checkbox"] {
      margin-right: 8px;
      width: 18px;
      height: 18px;
      cursor: pointer;
      
      &:checked {
        accent-color: #00ffff;
      }
    }
    
    .label {
      flex-grow: 1;
      color: #00ffff;
      font-weight: bold;
    }
  }
}

.range-with-labels {
  display: flex;
  align-items: center;
  width: 100%;
  
  .min-label, .max-label {
    font-size: 9px;
    color: #0ff;
    margin: 0 4px;
  }
  
  input[type=range] {
    flex: 1;
  }
}
</style> 