import { AuthorService } from '../../api/Services/Author/AuthorService'
import converter from '../../api/Services/Author/converter'

export default {
  getAuthors: async function (context, payload) {
    const data =
      payload.state === 'draft'
        ? await AuthorService.getDraftedAuthors()
        : await AuthorService.getPublishedAuthors()
    console.log(payload.state, 'Authors: ', data)
    context.commit('loadAuthor', {
      authors: data,
      state: payload.state
    })
  },
  saveAsDraft: async function (context, payload) {
    context.rootState.uploadingState = true
    const language = context.rootGetters.getCurrentLanguage
    const formData = converter.convert(payload, language)
    const data = await AuthorService.saveAsDraft(formData, (progressEvent) => {
      let percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      context.rootState.uploaderPercentage =
        percentage === 100 ? null : percentage
      if (percentage === 100) {
        context.rootState.uploadingState = false
      }
    })
    return data.success
  },
  publish: async function (context, payload) {
    context.rootState.uploadingState = true
    const data = await AuthorService.publish(payload.authorId)
    console.log('data', data)
    if (data) {
      context.commit('publish', {
        author: data
      })
      context.rootState.uploadingState = false
    }
  },
  delete: async function (context, payload) {
    context.rootState.uploadingState = true
    const data = await AuthorService.delete(payload.authorId)
    if (data.success) {
      context.commit('delete', {
        authorId: payload.authorId
      })
      context.rootState.uploadingState = false
    }
  }
}
