export default {
  decks(state) {
    return state.decks
  },
  getDeckById: (state) => (deckId) => {
    return state.decks.find((deck) => deck.deck_id === deckId)
  },
  cards(state) {
    return state.cards
  },
  filteredCards(state) {
    return state.filteredCards
  }
}
