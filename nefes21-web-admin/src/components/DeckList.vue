<template>
  <base-card>
    <h3>{{ title }}</h3>
    <DataTable :value="decks" responsiveLayout="scroll" showGridlines>
      <Column
        field="orderInSection"
        header="#"
        headerStyle="width: 2.5rem;"
      ></Column>
      <Column header="Deck Showcase" headerStyle="width: 16rem;">
        <template #body="{ data }">
          <img
            class="showcase-image"
            :src="getShowcaseImageUrl(data.showcaseImageUrl)"
          />
        </template>
      </Column>
      <Column field="deck_id" header="Deck ID"></Column>
      <Column field="deck_title" header="Deck Title"></Column>
      <Column field="dailyTag" header="Daily Card Tag"></Column>
      <Column header="Validation">
        <template #body="{ data }">
          <span :class="'badge badge-' + data.deck_isValid">{{
            data.deck_isValid ? 'Valid' : 'Invalid'
          }}</span>
        </template>
      </Column>
      <Column header="Actions" headerStyle="width: 11.5rem;">
        <template #body="{ data }">
          <SplitButton
            :model="getItems(data)"
            label="Edit Cards"
            @click="editCards(data)"
          ></SplitButton>
        </template>
      </Column>
    </DataTable>
  </base-card>
</template>
<script>
export default {
  props: ['title', 'decks'],
  computed: {},
  methods: {
    getShowcaseImageUrl(showcaseImageUrl) {
      return this.$store.getters.getImageSourceURL(showcaseImageUrl)
    },
    getItems(model) {
      return [
        {
          label: 'Edit Deck',
          icon: 'pi pi-ellipsis-v',
          command: () => {
            this.editDeck(model)
          }
        },
        {
          label: 'Delete Deck',
          icon: 'pi pi-times',
          command: () => {
            //this.delete(model)
          }
        }
      ]
    },
    editDeck(model) {
      this.$router.push({
        name: 'DeckDetail',
        params: {
          deckId: model.deck_id
        }
      })
    },
    editCards(model) {
      this.$router.push({
        name: 'CardList',
        params: {
          deckId: model.deck_id
        }
      })
    }
  }
}
</script>

<style scoped>
.showcase-image {
  display: block;
  margin-left: auto;
  margin-right: auto;

  border-radius: 20px;
  width: 12rem;
  object-fit: cover;
}
</style>
