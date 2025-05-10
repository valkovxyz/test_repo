<template lang="pug">
  .speed-altitude-block(
    :class="{ 'speed': type === 'speed', 'altitude': type === 'altitude' }"
    :style="{ left: `${posX}px`, top: `${posY}px` }"
  )
    .title {{ title }}
    .value-line
      .trend-indicator
        .arrow {{ arrowChar }}
        .bars-viewport(:style="barsViewportStyle")
          .bars-container(:style="barsContainerStyle" @transitionend="onAnimationEnd")
            .bar(
              v-for="(barItem, index) in barData"
              :key="barItem.id"
              :style="getBarStyle(index)"
            )
      .value-text {{ value }}
      .value-unit {{ unit }}
</template>

<script setup>
import {ref, computed, watch} from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['speed', 'altitude'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  prevValue: {
    type: [Number, String],
    default: null
  },
  unit: {
    type: String,
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
});

const arrowChar = '►';

const BAR_HEIGHT_PX = 1.5;
const BAR_WIDTH_PX = 8;
const BAR_SPACING_PX = 15.7;
const SLOT_HEIGHT_PX = BAR_HEIGHT_PX + BAR_SPACING_PX;
const NUM_BARS_TOTAL = 5;
const NUM_BARS_VISIBLE = 3;

const barData = ref([...Array(NUM_BARS_TOTAL).keys()].map(i => ({id: `bar-${Date.now()}-${i}`})));
const containerTranslateY = ref(0);
const isTransitioning = ref(false);

const trend = computed(() => {
  if (props.prevValue === null || props.prevValue === undefined) {
    return 0;
  }
  const currentValue = Number(props.value);
  const previousValue = Number(props.prevValue);

  if (currentValue > previousValue) return 1;
  if (currentValue < previousValue) return -1;
  return 0;
});

const barsViewportStyle = computed(() => ({
  height: '36px',
  width: `${BAR_WIDTH_PX}px`,
  position: 'relative',
  overflow: 'hidden',
}));

const barsContainerStyle = computed(() => ({
  transform: `translateY(${containerTranslateY.value}px)`,
  transition: isTransitioning.value ? `transform 0.2s linear` : 'none',
  position: 'relative',
}));

const getBarStyle = (index) => {
  const topPosition = (index - 1) * SLOT_HEIGHT_PX;
  return {
    position: 'absolute',
    top: `${topPosition}px`,
    left: '0px',
    height: `${BAR_HEIGHT_PX}px`,
    width: `${BAR_WIDTH_PX}px`,
    backgroundColor: '#fff',
  };
};

watch(trend, (newTrend) => {
  if (newTrend === 0 || isTransitioning.value) {
    return;
  }
  isTransitioning.value = true;
  if (newTrend === 1) {
    containerTranslateY.value = -SLOT_HEIGHT_PX;
  } else {
    containerTranslateY.value = SLOT_HEIGHT_PX;
  }
});

const onAnimationEnd = () => {
  if (!isTransitioning.value) return;

  const currentTrendAtAnimationEnd = trend.value;

  if (currentTrendAtAnimationEnd === 1) {
    const firstBar = barData.value.shift();
    barData.value.push(firstBar);
  } else if (currentTrendAtAnimationEnd === -1) {
    const lastBar = barData.value.pop();
    barData.value.unshift(lastBar);
  }

  isTransitioning.value = false;
  containerTranslateY.value = 0;

  if (currentTrendAtAnimationEnd !== 0) {
    setTimeout(() => {
      isTransitioning.value = true;
      if (currentTrendAtAnimationEnd === 1) {
        containerTranslateY.value = -SLOT_HEIGHT_PX;
      } else {
        containerTranslateY.value = SLOT_HEIGHT_PX;
      }
    }, 0);
  }
};
</script>

<style lang="scss" scoped>
.speed-altitude-block {
  position: absolute;
  width: 144px;
  min-width: 144px;
  height: 88px;
  background-color: #000;
  color: #fff;
  font-family: 'ARS-M-VCR', monospace;
  display: flex;
  flex-direction: column;
  padding: 5px;
  box-sizing: border-box;

  .title {
    text-transform: uppercase;
    text-align: center;
  }

  .value-line {
    display: flex;
    margin-top: 10px;
    margin-left: 5px;
  }

  .trend-indicator {
    display: flex;
    align-items: center;
    margin-right: 6px;
  }

  .arrow {
    color: #0ff;
    font-size: 12px;
    margin-right: 4px;
  }

  .bars-viewport, .bars-container, .bar {
  }

  .value-text {
    font-size: 25px;
    flex-shrink: 0;
    margin-left: 6px;
    width: 54px;
    text-align: center;
  }

  .value-text, .value-unit {
    margin-top: 5px;
  }

}
</style> 