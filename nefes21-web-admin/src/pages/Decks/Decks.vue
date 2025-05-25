<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Deck"
            @click="addDeckRoute"
          />
        </div>
      </base-card>
      <deck-list :title="'Decks'" :decks="decks"></deck-list>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import DeckList from '@/components/DeckList'
export default {
  components: { DeckList },
  computed: {
    ...mapGetters({
      decks: 'cards/decks'
    })
  },
  methods: {
    ...mapActions({
      getDecks: 'cards/getDecks',
      getCards: 'cards/getCards'
    }),
    addDeckRoute() {
      this.$router.push({
        name: 'DeckEdit',
        params: {
          state: 'new'
        }
      })
    }
  },
  mounted() {
    this.getDecks()
    this.getCards()
  }
}
</script>
