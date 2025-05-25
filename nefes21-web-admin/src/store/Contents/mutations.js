export default {
  loadContents: function (state, payload) {
    if (payload.state === 'draft') {
      state.draftedContents = payload.contents
    } else {
      state.publishedContents = payload.contents
    }
    console.log(payload.state)
  },
  loadContentTypes: function (state, payload) {
    state.content_types = payload.content_types
  },
  addContentToDraft: function (state, payload) {
    state.draftedContents.push(payload.content)
  },
  loadDraftedContent: function (state, payload) {
    state.draftContent = payload.content
  },
  delete: function (state, payload) {
    const index = state.draftedContents.findIndex(
      (content) => content.content_id === payload.content_id
    )
    if (index !== -1) {
      state.draftedContents.splice(index, 1)
    }
  },
  publish: function (state, payload) {
    const draftedIndex = state.draftedContents.findIndex(
      (content) => content.content_id === payload.content.content_id
    )
    const publishedIndex = state.publishedContents.findIndex(
      (content) => content.content_id === payload.content.content_id
    )
    if (draftedIndex !== -1) {
      if (publishedIndex !== -1) {
        state.publishedContents.splice(publishedIndex, 1)
      }
      state.publishedContents.push(payload.content)
      state.draftedContents.splice(draftedIndex, 1)
    }
  }
}
