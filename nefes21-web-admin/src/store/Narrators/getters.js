export default {
  isNarratorLoaded(state) {
    return state.publishedNarrators.length > 0
  },
  getPublishedNarrators(state) {
    return state.publishedNarrators
  },
  getDraftedNarrators(state) {
    return state.draftedNarrators
  },
  getPublishedNarratorById: (state) => (narratorId) => {
    const narrator = state.publishedNarrators.find(
      (narrator) => narrator.narrator_id === narratorId
    )
    return narrator
  },
  getDraftedNarratorsById: (state) => (narratorId) => {
    const narrator = state.draftedNarrators.find(
      (narrator) => narrator.narrator_id === narratorId
    )
    return narrator
  }
}
