<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex p-jc-between">
          <Button @click="openModal(null)">Add Card</Button>
          <Button class="p-button-success" @click="saveAndPublish"
            >Save and Publish</Button
          >
        </div>
      </base-card>
      <card-list
        :title="'Cards'"
        :cards="cards"
        @edit-card="openModal"
        @delete-card="deleteCard"
      ></card-list>
    </div>
  </div>
  <card-detail-dialog
    v-model:visible="displayModal"
    v-model:card-data="editCardData"
    :state="state"
    :contents="contents"
    @discard="closeModal"
    @save="saveCard"
    @update="updateCardAndCloseModal"
  ></card-detail-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CardList from '@/components/CardList'
import CardDetailDialog from '@/components/CardDetailDialog'
export default {
  components: { CardDetailDialog, CardList },
  props: ['deckId'],
  data() {
    return {
      displayModal: false,
      editCardData: '',
      state: ''
    }
  },
  computed: {
    ...mapGetters({
      cards: 'cards/filteredCards',
      contents: 'content/publishedContents'
    })
  },
  methods: {
    ...mapActions({
      filterCards: 'cards/filterCardsByDeckId',
      addCardToDeck: 'cards/addCardToDeck',
      updateCard: 'cards/updateCard',
      getContents: 'content/getContents'
    }),
    closeModal() {
      this.displayModal = !this.displayModal
      this.editCardData = ''
    },
    openModal(object) {
      this.state = object === null ? 'new' : 'edit'
      this.editCardData = object === null ? '' : object
      this.displayModal = !this.displayModal
    },
    saveCard(cardModel) {
      console.log('save new card')
      console.log(cardModel)
      cardModel.deck_id = this.deckId
      cardModel.language = this.$store.getters.getCurrentLanguage
      this.addCardToDeck(cardModel)
      this.editCardData = ''
      this.displayModal = !this.displayModal
    },
    updateCardAndCloseModal(cardModel) {
      console.log('update card')
      console.log(cardModel)
      cardModel.language = this.$store.getters.getCurrentLanguage
      this.updateCard(cardModel)
      this.editCardData = ''
      this.displayModal = !this.displayModal
    },
    deleteCard(cardModel) {
      this.$store.dispatch('cards/deleteCard', cardModel)
    },
    async saveAndPublish() {
      const cards = this.cards
      const result = await this.$store.dispatch('cards/saveAndPublish', {
        cards: cards,
        deck_id: this.deckId
      })
      if (result) {
        this.$router.back()
        console.log(result)
      }
    }
  },
  mounted() {
    this.filterCards({ deckId: this.deckId })
    this.getContents({ state: 'publish' })
  }
}
</script>
<style scoped>
.add-btn {
  display: flex;
  margin-left: auto;
  margin-right: 0;
}
</style>
