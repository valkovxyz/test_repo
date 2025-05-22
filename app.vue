<template>
  <div class="app-wrapper">
    <DroneUI ref="droneUiRef" />
    
    <div class="control-panel">
      <div class="panel-group">
        <div class="target-controls">
          <h3>Управление целью</h3>
          <div class="buttons">
            <button @click="moveTarget(-0.01, 0)" title="Малый шаг влево">←</button>
            <button @click="moveTarget(-0.02, 0)" title="Средний шаг влево">←←</button>
            <button @click="moveTarget(0.01, 0)" title="Малый шаг вправо">→</button>
            <button @click="moveTarget(0.02, 0)" title="Средний шаг вправо">→→</button>
          </div>
          <div class="buttons">
            <button @click="moveTarget(0, -0.01)" title="Малый шаг вверх">↑</button>
            <button @click="moveTarget(0, -0.02)" title="Средний шаг вверх">↑↑</button>
            <button @click="moveTarget(0, 0.01)" title="Малый шаг вниз">↓</button>
            <button @click="moveTarget(0, 0.02)" title="Средний шаг вниз">↓↓</button>
          </div>
          <div class="buttons">
            <button @click="randomizeTarget" class="special-btn">Случайно</button>
            <button @click="centerTarget" class="special-btn">По центру</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="target-position">
      Позиция цели: X: {{ displayPosition.x.toFixed(3) }}, Y: {{ displayPosition.y.toFixed(3) }}
    </div>
    
    <div class="keyboard-help">
      <p>Управление клавиатурой:</p>
      <ul>
        <li>Стрелки: перемещение цели (шаг 0.01)</li>
        <li>Shift + стрелки: малый шаг (0.005)</li>
        <li>Ctrl + стрелки: большой шаг (0.05)</li>
        <li>Home: центрировать цель</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import DroneUI from '~/components/DroneUI.vue'

const droneUiRef = ref(null)
const backgroundOffset = ref({ x: 0, y: 0 })
const targetPosition = ref({ x: 0.5, y: 0.4 })

// Вычисляемое свойство для отображения корректной позиции цели
const displayPosition = computed(() => {
  if (droneUiRef.value) {
    const position = droneUiRef.value.getDisplayTargetPosition();
    return position;
  }
  return targetPosition.value;
});

// Определяем шаги перемещения
const STEP_SIZES = {
  small: 0.005, // Очень маленький шаг (с Shift)
  normal: 0.01, // Маленький шаг
  medium: 0.02, // Средний шаг
  large: 0.05  // Большой шаг (с Ctrl)
}

// Добавляем обработчики клавиатуры
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const handleKeyDown = (event) => {
  // Выбираем шаг в зависимости от модификаторов
  let step = STEP_SIZES.normal
  
  if (event.shiftKey) {
    step = STEP_SIZES.small
  } else if (event.ctrlKey) {
    step = STEP_SIZES.large
  }
  
  // Обрабатываем клавиши стрелок
  switch (event.key) {
    case 'ArrowLeft':
      moveTarget(-step, 0)
      event.preventDefault()
      break
    case 'ArrowRight':
      moveTarget(step, 0)
      event.preventDefault()
      break
    case 'ArrowUp':
      moveTarget(0, -step)
      event.preventDefault()
      break
    case 'ArrowDown':
      moveTarget(0, step)
      event.preventDefault()
      break
    case 'Home':
      centerTarget()
      event.preventDefault()
      break
    case 'r':
      if (event.ctrlKey) {
        randomizeTarget()
        event.preventDefault()
      }
      break
  }
}

const moveTarget = (deltaX, deltaY) => {
  targetPosition.value.x += deltaX
  targetPosition.value.y += deltaY
  
  // Ограничиваем значения от 0 до 1
  targetPosition.value.x = Math.max(0, Math.min(1, targetPosition.value.x))
  targetPosition.value.y = Math.max(0, Math.min(1, targetPosition.value.y))
  
  if (droneUiRef.value) {
    droneUiRef.value.updateTargetPosition(
      targetPosition.value.x,
      targetPosition.value.y
    )
  }
}

const centerTarget = () => {
  targetPosition.value = { x: 0.5, y: 0.4 }
  
  if (droneUiRef.value) {
    droneUiRef.value.updateTargetPosition(
      targetPosition.value.x,
      targetPosition.value.y
    )
  }
}

const randomizeTarget = () => {
  // Ограничиваем случайные значения, чтобы не выходить слишком близко к краям
  targetPosition.value = {
    x: 0.1 + Math.random() * 0.8,
    y: 0.1 + Math.random() * 0.8
  }
  
  if (droneUiRef.value) {
    droneUiRef.value.updateTargetPosition(
      targetPosition.value.x,
      targetPosition.value.y
    )
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  background-color: #222;
  color: #fff;
  height: 100vh;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
  gap: 20px;
  padding: 20px;
  position: relative;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 700px;
}

.panel-group {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.target-position {
  margin-top: 10px;
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 5px 10px;
  border-radius: 4px;
}

.keyboard-help {
  margin-top: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 500px;
  
  p {
    margin: 0 0 5px 0;
    font-weight: bold;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: square;
    
    li {
      margin-bottom: 3px;
    }
  }
}

.target-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
  }
  
  .buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 8px;
  }
  
  button {
    padding: 8px 12px;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 40px;
    
    &:hover {
      background-color: #444;
    }
    
    &.special-btn {
      background-color: #444;
      
      &:hover {
        background-color: #555;
      }
    }
  }
}
</style>
