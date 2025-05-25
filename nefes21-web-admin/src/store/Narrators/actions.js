import { NarratorService } from '../../api/Services/Narrator/NarratorService'
import converter from '../../api/Services/Narrator/converter'

export default {
  getNarrators: async function (context, payload) {
    const data =
      payload.state === 'draft'
        ? await NarratorService.getDraftedNarrators()
        : await NarratorService.getPublishedNarrators()
    console.log(payload.state, 'Narrators: ', data)

    context.commit('loadNarrators', {
      narrators: data,
      state: payload.state
    })
  },
  saveAsDraft: async function (context, payload) {
    context.rootState.uploadingState = true
    const language = context.rootGetters.getCurrentLanguage
    const formData = converter.convert(payload, language)
    const data = await NarratorService.saveAsDraft(
      formData,
      (progressEvent) => {
        let percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        context.rootState.uploaderPercentage =
          percentage === 100 ? null : percentage
        if (percentage === 100) {
          context.rootState.uploadingState = false
        }
      }
    )
    return data.success
  },
  publish: async function (context, payload) {
    context.rootState.uploadingState = true
    const data = await NarratorService.publish(payload.narratorId)
    if (data) {
      context.commit('publish', {
        narrator: data
      })
      context.rootState.uploadingState = false
    }
  },
  delete: async function (context, payload) {
    context.rootState.uploadingState = true
    const data = await NarratorService.delete(payload.narratorId)
    if (data.success) {
      context.commit('delete', {
        narratorId: payload.narratorId
      })
      context.rootState.uploadingState = false
    }
  }
}
