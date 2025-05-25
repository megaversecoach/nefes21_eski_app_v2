export default {
  loadNarrators: function (state, payload) {
    if (payload.state === 'draft') {
      state.draftedNarrators = payload.narrators
    } else {
      state.publishedNarrators = payload.narrators
    }
  },
  /*saveAsDraft: function (state, payload) {
    const index = state.draftedNarrators.findIndex(
      (narrator) => narrator.narratorId === payload.narrator.narratorId
    )
    if (index !== null) {
      state.draftedNarrators.splice(index, 1)
    }
    state.draftedNarrators.push(payload.narrator)
  },*/
  publish: function (state, payload) {
    const draftedIndex = state.draftedNarrators.findIndex(
      (narrator) => narrator.narrator_id === payload.narrator.narrator_id
    )
    console.log(draftedIndex)
    const publishedIndex = state.publishedNarrators.findIndex(
      (narrator) => narrator.narrator_id === payload.narrator.narrator_id
    )
    console.log(publishedIndex)
    if (draftedIndex !== -1) {
      if (publishedIndex !== -1) {
        state.publishedNarrators.splice(publishedIndex, 1)
      }
      state.publishedNarrators.push(payload.narrator)
      state.draftedNarrators.splice(draftedIndex, 1)
    }
  },
  delete: function (state, payload) {
    const index = state.draftedNarrators.findIndex(
      (narrator) => narrator.narrator_id === payload.narratorId
    )
    if (index !== null) {
      state.draftedNarrators.splice(index, 1)
    }
  }
}
