<template>
  <base-card class="widget-box">
    <div>
      <span class="card-icon">
        <i :class="icon"></i>
      </span>
      <span class="card-title">{{ title }}</span>
      <div class="data-wrapper">
        <div class="card-data">{{ data }}</div>
        <div class="card-description">{{ description }}</div>
      </div>
    </div>
  </base-card>
</template>
<script>
export default {
  props: ['title', 'icon', 'data', 'description']
}
</script>
<style scoped>
.widget-box {
  min-height: 6rem;
  border-left: 4px solid;
  border-left-color: #7158b0;
}
.card-icon {
  background: #7158b0;
  color: #cfc8de;
  display: inline-block;
  border-radius: 4px;
  width: 2em;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  vertical-align: middle;
}
.card-title {
  color: #7158b0;
  font-weight: 600;
  font-size: 1.25rem;
  vertical-align: middle;
  margin-left: 0.5rem;
}
.data-wrapper {
  text-align: center;
  margin-top: 1rem;
}
.card-data {
  font-size: 1.5rem;
  font-weight: 600;
}
.card-description {
  color: #7f7a98;
  font-weight: 600;
  margin-top: 0.25rem;
}
</style>
