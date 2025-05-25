import { SoundScapeService } from '../../api/Services/SoundScape/SoundScapeService'
import converter from '../../api/Services/SoundScape/converter'

export default {
  getSoundScapes: async function (context, payload) {
    const data =
      payload.state === 'draft'
        ? await SoundScapeService.getDraftedSoundscapes()
        : await SoundScapeService.getPublishedSoundscapes()
    console.log(data)
    context.commit('loadSoundScapes', {
      soundScapes: data,
      state: payload.state
    })
  },
  saveAsDraft: async function (context, payload) {
    context.rootState.uploadingState = true
    const language = context.rootGetters.getCurrentLanguage
    const formData = converter.convert(payload, language)
    const data = await SoundScapeService.saveAsDraft(
      formData,
      (progressEvent) => {
        let percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        console.log(percentage)
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
    console.log(payload.soundscape_id)
    const data = await SoundScapeService.publish(payload.soundscape_id)
    if (data) {
      context.commit('publish', {
        soundScape: data
      })
      context.rootState.uploadingState = false
    }
  },
  delete: async function (context, payload) {
    context.rootState.uploadingState = true
    const data = await SoundScapeService.delete(payload.soundscape_id)
    if (data.success) {
      context.commit('delete', {
        soundscapeId: payload.soundscape_id
      })
      context.rootState.uploadingState = false
    }
  }
}
