export default {
  isPublishedAuthorsLoaded(state) {
    return state.publishedAuthors.length > 0
  },
  getPublishedAuthors(state) {
    return state.publishedAuthors
  },
  getDraftedAuthors(state) {
    return state.draftedAuthors
  },
  getPublishedAuthorById: (state) => (authorId) => {
    return state.publishedAuthors.find(
      (author) => author.author_id === authorId
    )
  },
  getDraftedAuthorById: (state) => (authorId) => {
    return state.draftedAuthors.find((author) => author.author_id === authorId)
  },
  getAuthorLabelById: (state) => (authorId) => {
    return state.publishedAuthors.find(
      (author) => author.author_id === authorId
    ).author_label
  }
}
