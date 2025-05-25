import { CardService } from '@/api/Services/Card/CardService'

export default {
  getDecks: async function (context) {
    const data = await CardService.getDecks()
    console.log(data)
    context.commit('loadDecks', {
      decks: data
    })
  },
  getCards: async function (context) {
    const data = await CardService.getCards()
    console.log(data)
    context.commit('loadCards', {
      cards: data
    })
  },
  filterCardsByDeckId: function (context, payload) {
    context.commit('filterCardsByDeckId', payload)
  },
  addCardToDeck: function (context, payload) {
    context.commit('addCardToDeck', payload)
  },
  updateCard: function (context, payload) {
    context.commit('updateCard', payload)
  },
  deleteCard: function (context, payload) {
    context.commit('deleteCard', payload)
  },
  saveAndPublish: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const data = await CardService.saveAndPublish(
      payload.cards,
      payload.deck_id,
      language
    )
    return data.success
  }
}
