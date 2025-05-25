<template>
  <div v-for="option in options" :key="option.key">
    <div class="p-grid">
      <div class="p-col-6">
        <p>
          <b>{{ option.name }}</b>
        </p>
      </div>
      <div class="p-col-6">
        <p v-if="option.color === undefined">
          {{ option.value }}
        </p>
        <p :style="{ color: option.color }" v-else>
          {{ option.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options']
}
</script>
