<template>
  <base-card>
    <h3 class="p-align-center">{{ title }}</h3>
    <Chart type="pie" :data="chartData" :options="chartOptions" />
  </base-card>
</template>
<script>
export default {
  props: ['title', 'chartData', 'chartOptions']
}
</script>
