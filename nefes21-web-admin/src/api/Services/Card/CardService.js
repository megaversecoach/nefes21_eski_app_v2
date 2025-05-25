import { ApiService } from '@/api/ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const CardService = {
  getDecks: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.CardEndpoints.getDecks
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getCards: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.CardEndpoints.getCards
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveAndPublish: async function (data, deck_id, language) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.CardEndpoints.saveAndPublish,
        '/' + deck_id + '?lang=' + language,
        { card_list: data }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}
export { CardService }
