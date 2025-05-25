export default {
  loadDecks: function (state, payload) {
    state.decks = payload.decks
  },
  loadCards: function (state, payload) {
    state.cards = payload.cards
  },
  filterCardsByDeckId: function (state, payload) {
    const deckId = payload.deckId
    const filteredCards = state.cards.filter((card) => card.deck_id === deckId)
    console.log('filtered cards by deck_id:', deckId)
    console.log(filteredCards)
    state.filteredCards = filteredCards
  },
  addCardToDeck: function (state, payload) {
    const newCard = {
      card_id: payload.card_id,
      card_title: payload.card_title,
      card_description: payload.card_description,
      isDailyAvailable: payload.isDailyAvailable,
      content_id: payload.content_id,
      deck_id: payload.deck_id,
      language: payload.language
    }
    if (payload.card_id === '') {
      const newCardId = Math.floor(100000 + Math.random() * 900000)
      newCard.card_id = payload.deck_id + '-' + newCardId
    }
    console.log('new card')
    console.log(newCard)
    state.filteredCards.push(newCard)
  },
  updateCard: function (state, payload) {
    const updatedCard = {
      card_id: payload.card_id,
      card_title: payload.card_title,
      card_description: payload.card_description,
      isDailyAvailable: payload.isDailyAvailable,
      content_id: payload.content_id,
      deck_id: payload.deck_id,
      language: payload.language
    }
    const index = state.filteredCards.findIndex(
      (card) => card.card_id === updatedCard.card_id
    )
    console.log('UpdateCardIndex', index)
    console.log('updatedCard: ', updatedCard)
    state.filteredCards[index] = updatedCard
    console.log('FilteredCards:', state.filteredCards)
  },
  deleteCard: function (state, payload) {
    const index = state.filteredCards.findIndex(
      (card) => card.card_id === payload.card_id
    )
    state.filteredCards.splice(index, 1)
  }
}
