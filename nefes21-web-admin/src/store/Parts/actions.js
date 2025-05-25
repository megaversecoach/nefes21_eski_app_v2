import { PartService } from '@/api/Services/Parts/PartService'
import converter from '../../api/Services/Parts/converter'

export default {
  getPublishedPartsByProgramId: async function (context, payload) {
    const data = await PartService.getPublishedPartsByProgramId(
      payload.program_id
    )
    console.log('PublishedParts: ', data)
    context.commit('loadPublishedParts', { publishedParts: data })
  },
  getDraftedPartsByProgramId: async function (context, payload) {
    const data = await PartService.getDraftedPartsByProgramId(
      payload.program_id
    )
    console.log('DraftedParts: ', data)
    context.commit('loadDraftedParts', { draftedParts: data })
  },
  savePartAsDraft: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const formData = converter.convert(payload, language)
    const data = await PartService.savePartAsDraft(
      formData,
      (progressEvent) => {
        let percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        context.rootState.uploaderPercentage =
          percentage === 100 ? null : percentage
      }
    )
    return data.success
  },
  deletePartFromDrafts: async function (context, payload) {
    const data = await PartService.deletePartFromDrafts(payload.part_id)
    console.log('deletePartFromDrafts: ', data)
    if (data.success) {
      context.commit('deletePartFromDrafts', payload)
    }
    return data.success
  }
}
