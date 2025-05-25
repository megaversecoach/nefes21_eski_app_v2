<template>
  <base-card>
    <h3>{{ title }}</h3>
    <DataTable :value="cards" showGridlines>
      <Column field="card_id" header="Card Id"></Column>
      <Column field="card_title" header="Card Title"></Column>
      <Column field="isDailyAvailable" header="Daily Available"></Column>
      <Column header="Actions">
        <template #body="{ data }">
          <SplitButton
            :model="getItems(data)"
            label="Edit"
            @click="editCard(data)"
          ></SplitButton>
        </template>
      </Column>
    </DataTable>
  </base-card>
</template>
<script>
export default {
  props: ['title', 'cards'],
  emits: ['editCard', 'deleteCard'],
  methods: {
    getItems(model) {
      return [
        {
          label: 'Delete Card',
          icon: 'pi pi-times',
          command: () => {
            this.deleteCard(model)
          }
        }
      ]
    },
    editCard(cardModel) {
      console.log('card-model')
      console.log(cardModel)
      this.$emit('editCard', cardModel)
    },
    deleteCard(cardModel) {
      this.$emit('deleteCard', cardModel)
    }
  }
}
</script>
