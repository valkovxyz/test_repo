<template>
  <div class="app-wrapper">
    <DroneUI />
  </div>
</template>

<script setup>
import DroneUI from '~/components/DroneUI.vue'
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
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
