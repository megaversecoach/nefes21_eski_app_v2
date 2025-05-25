export default {
  isPublishedContentsLoaded(state) {
    return state.publishedContents.length > 0 && state.content_types.length > 0
  },
  isDraftedContentsLoaded(state) {
    return state.draftedContents.length > 0 && state.content_types.length > 0
  },
  getPublishedContentById: (state) => (contentId) => {
    return state.publishedContents.find(
      (content) => content.content_id === contentId
    )
  },
  isContentExistsOnDraft: (state) => (contentId) => {
    const result = state.draftedContents.some(
      (content) => content.content_id === contentId
    )
    console.log(result)
    return result
  },
  findDifferences: (state) => (contents) => {
    let existingContentIds = contents.map((content) => {
      return content.content_id
    })
    let differences = state.publishedContents.filter(
      (content) => !existingContentIds.includes(content.content_id)
    )
    return differences
  },
  publishedContents(state) {
    return state.publishedContents
  },
  draftedContents(state) {
    return state.draftedContents
  },
  draftedContent(state) {
    return state.draftContent
  },
  contentTypes(state) {
    return state.content_types
  }
}
