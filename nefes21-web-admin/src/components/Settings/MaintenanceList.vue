<template>
  <base-card>
    <DataTable :value="keys" responsiveLayout="scroll" showGridlines>
      <template #empty><h4>No State Found</h4></template>
      <template #loading>Loading ...</template>
      <Column header="Key">
        <template #body="{ data }">
          <i
            :class="
              data.id.includes('android') ? 'pi pi-android' : 'pi pi-apple'
            "
            style="margin-right: 5px"
          ></i>
          <span>
            {{ data.id }}
          </span>
        </template>
      </Column>
      <Column header="Maintenance Mode">
        <template #body="{ data }">
          <span :class="'badge badge-' + maintenanceStates[data.id].state">
            {{ maintenanceStates[data.id].state }}
          </span>
        </template>
      </Column>
      <Column header="Actions" headerStyle="width: 4rem;">
        <template #body="{ data }">
          <Button
            class="p-button-outlined"
            icon="pi pi-ellipsis-v"
            label="Change"
            @click="changeButtonTapped(data)"
          />
        </template>
      </Column>
    </DataTable>
  </base-card>
</template>

<script>
export default {
  props: ['keys', 'maintenanceStates'],
  emits: ['changeTapped'],
  methods: {
    changeButtonTapped(data) {
      this.$emit('changeTapped', data)
    }
  }
}
</script>
<style scoped>
.badge {
  border-radius: 3px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}

.badge-passive {
  background: #c8e6c9;
  color: #256029;
}

.badge-active {
  background: #ffcdd2;
  color: #c63737;
}

.badge-scheduled {
  background: #fff916;
  color: #c63737;
}
</style>
