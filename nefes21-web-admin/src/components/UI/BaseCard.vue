<template>
    <div class="card">
        <slot>
        </slot>
    </div>
</template>


<script>
export default {
    
}
</script>

<style>
.card {
  background: #ffffff;
  padding: 1.25rem;
  border: 0 none;
  margin-bottom: 2rem;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
.card:last-child {
  margin-bottom: 0;
}
.card .card-header {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.card .card-subtitle {
  color: #6c757d;
  font-weight: 600;
  margin: -1rem 0 1rem 0;
}
</style>