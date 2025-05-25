import { ContentService } from '../../api/Services/Contents/ContentService'
import converter from '../../api/Services/Contents/converter'

export default {
  getContents: async function (context, payload) {
    const data =
      payload.state === 'draft'
        ? await ContentService.getDraftedContents()
        : await ContentService.getPublishedContents()
    console.log(data)
    context.commit('loadContents', {
      contents: data,
      state: payload.state
    })
  },
  getContentTypes: async function (context) {
    const data = await ContentService.getContentTypes()
    console.log(data)
    context.commit('loadContentTypes', {
      content_types: data
    })
  },
  saveAsDraft: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const formData = converter.convert(payload, language)
    const data = await ContentService.saveAsDraft(formData, (progressEvent) => {
      let percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      context.rootState.uploaderPercentage =
        percentage === 100 ? null : percentage
    })
    return data.success
  },
  delete: async function (context, payload) {
    const data = await ContentService.delete(payload.content_id)
    console.log(data)
    if (data.success) {
      context.commit('delete', payload)
    }
  },
  publish: async function (context, payload) {
    const data = await ContentService.publish(payload.content_id)
    console.log('published content:', data)
    context.commit('publish', {
      content: data
    })
  },
  getContentById: async function (context, payload) {
    const data = await ContentService.getContentById(payload.content_id)
    context.commit('loadDraftedContent', {
      content: data
    })
    return data
  }
}
