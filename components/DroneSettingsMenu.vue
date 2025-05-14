<template lang="pug">
.drone-settings-menu
  .menu-title HUD
  
  .settings-group
    .setting-title Скорость
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
    .setting-title Крен
    .setting-control
      input(
        type="range"
        min="-45"
        max="45"
        step="1"
        v-model="localRoll"
        @input="updateRoll"
      )
      .setting-value {{ roll }}°
  
  .settings-group
    .setting-title Танг
    .setting-control
      input(
        type="range"
        min="-45"
        max="45"
        step="1"
        v-model="localPitch"
        @input="updatePitch"
      )
      .setting-value {{ pitch }}°
  
  .settings-group
    .setting-title Режим
    .setting-control
      select(v-model="localMode" @change="updateMode")
        option(value="STAB") STAB
        option(value="HORIZON") HORIZON
        option(value="AUTO") AUTO
  
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
    .setting-title Бат
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
  
  .settings-section-title Navigation control settings
  
  .settings-group
    .setting-title Чутл. крен
    .setting-control
      input(
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        v-model="localHUDSettings.rollSensitivity"
        @input="updateHUDRollSensitivity"
      )
      .setting-value {{ formatNumber(hudSettings.rollSensitivity) }}
  
  .settings-group
    .setting-title Чутл. танг
    .setting-control
      input(
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        v-model="localHUDSettings.pitchSensitivity"
        @input="updateHUDPitchSensitivity"
      )
      .setting-value {{ formatNumber(hudSettings.pitchSensitivity) }}
  
  .settings-group
    .setting-title Наруж. крен
    .setting-control
      input(
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        v-model="localHUDSettings.externalRollFactor"
        @input="updateHUDExternalRollFactor"
      )
      .setting-value {{ formatNumber(hudSettings.externalRollFactor) }}
  
  .settings-group
    .setting-title Наруж. танг
    .setting-control
      input(
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        v-model="localHUDSettings.externalPitchFactor"
        @input="updateHUDExternalPitchFactor"
      )
      .setting-value {{ formatNumber(hudSettings.externalPitchFactor) }}
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  speed: {
    type: [Number, String],
    default: 110
  },
  altitude: {
    type: [Number, String],
    default: 100
  },
  roll: {
    type: [Number, String],
    default: -3
  },
  pitch: {
    type: [Number, String],
    default: -5
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
  }
})

const emit = defineEmits([
  'update:speed',
  'update:altitude',
  'update:roll',
  'update:pitch',
  'update:mode',
  'update:gas',
  'update:flaps',
  'update:signal',
  'update:batteryPercentage',
  'update:voltage',
  'update:hudSettings'
])

const localSpeed = ref(props.speed)
const localAltitude = ref(props.altitude)
const localRoll = ref(props.roll)
const localPitch = ref(props.pitch)
const localMode = ref(props.mode)
const localGas = ref(props.gas)
const localFlaps = ref(props.flaps)
const localSignal = ref(props.signal)
const localBatteryPercentage = ref(props.batteryPercentage)
const localVoltage = ref(props.voltage)

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

watch(() => props.roll, (newVal) => {
  localRoll.value = newVal
})

watch(() => props.pitch, (newVal) => {
  localPitch.value = newVal
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

const updateSpeed = () => {
  emit('update:speed', parseInt(localSpeed.value))
}

const updateAltitude = () => {
  emit('update:altitude', parseInt(localAltitude.value))
}

const updateRoll = () => {
  emit('update:roll', parseInt(localRoll.value))
}

const updatePitch = () => {
  emit('update:pitch', parseInt(localPitch.value))
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
  
  .menu-title {
    text-align: center;
    margin-bottom: 15px;
    text-transform: uppercase;
    border-bottom: 1px solid #555;
    padding-bottom: 5px;
  }
  
  .settings-group {
    margin-bottom: 10px;
    
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
    }
  }
  
  .settings-section-title {
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: bold;
    text-align: center;
    border-top: 1px solid #555;
    padding-top: 10px;
  }
}
</style> 