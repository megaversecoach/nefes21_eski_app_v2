<template>
  <DataTable
    v-if="pool.length !== 0"
    :value="pool"
    responsiveLayout="scroll"
    showGridlines
  >
    <template #empty>
      <empty-state :title="'Pool Not Found'"></empty-state>
    </template>
    <template #loading> Loading ...</template>

    <Column field="action" header="Showcase Action Type">
      <template #body="{ data }">
        {{ data.action }}
      </template>
    </Column>

    <Column field="priorityRating" header="Priority">
      <template #body="{ data }">
        {{ data.priorityRating }}
      </template>
    </Column>

    <Column field="showcase_type_id" header="Showcase Type">
      <template #body="{ data }">
        {{ data.showcase_type_id }}
      </template>
    </Column>

    <Column
      ,
      bodyStyle="text-align: center; overflow: visible"
      header="Actions"
      headerStyle="width: 4rem; text-align: center"
    >
      <template #body="{ data }">
        <SplitButton
          class="p-button-raised p-button-warning"
          style="color: white"
          :model="getItems(data)"
          icon="pi pi-ellipsis-v"
          label="Edit"
          @click="edit(data)"
        ></SplitButton>
      </template>
    </Column>
  </DataTable>
</template>

<script>
export default {
  props: ['pool'],
  methods: {
    getItems(model) {
      return [
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
            this.delete(model)
          }
        }
      ]
    },
    edit(model) {
      console.log(model)
      this.$router.push({
        name: 'TodayShowcaseItemDetail',
        params: {
          showcase_id: model.showcase_id
        }
      })
    },
    delete(model) {
      this.$store.dispatch('todays/deleteNonPersonalized', {
        showcase_id: model.showcase_id
      })
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
.badge-true {
  background: #c8e6c9;
  color: #256029;
}
.badge-false {
  background: #ffcdd2;
  color: #c63737;
}
</style>
