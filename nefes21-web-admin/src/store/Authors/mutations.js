export default {
  loadAuthor: function (state, payload) {
    if (payload.state === 'draft') {
      state.draftedAuthors = payload.authors
    } else {
      state.publishedAuthors = payload.authors
    }
  },
  /*saveAsDraft: function(state, payload) {
    const index = state.draftedAuthors.findIndex(author => author.author_id === payload.author.author_id)
    if (index !== null) {
      state.draftedAuthors.splice(index, 1)
    }
    state.draftedAuthors.push(payload.author)
  },
  */
  publish: function (state, payload) {
    const draftedIndex = state.draftedAuthors.findIndex(
      (author) => author.author_id === payload.author.author_id
    )
    const publishedIndex = state.publishedAuthors.findIndex(
      (author) => author.author_id === payload.author.author_id
    )
    if (draftedIndex !== -1) {
      if (publishedIndex !== -1) {
        state.publishedAuthors.splice(publishedIndex, 1)
      }
      state.publishedAuthors.push(payload.author)
      state.draftedAuthors.splice(draftedIndex, 1)
    }
  },
  delete: function (state, payload) {
    const index = state.draftedAuthors.findIndex(
      (author) => author.author_id === payload.authorId
    )
    if (index !== null) {
      state.draftedAuthors.splice(index, 1)
    }
  }
}
