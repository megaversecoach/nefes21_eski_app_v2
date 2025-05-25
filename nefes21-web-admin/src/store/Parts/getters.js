export default {
  publishedParts(state) {
    return state.publishedParts
  },
  draftedParts(state) {
    return state.draftedParts
  },
  isExistsInPublishedParts: (state) => (partId) => {
    const result = state.publishedParts.some((part) => part.part_id === partId)
    console.log('isExistsInPublishedParts:', partId, result)
    return result
  },
  getPublishedPartById: (state) => (partId) => {
    return state.publishedParts.find((part) => part.part_id === partId)
  },
  getDraftedPartById: (state) => (partId) => {
    return state.draftedParts.find((part) => part.part_id === partId)
  },
  newPartIndex: (state) => (sectionId) => {
    const sectionParts = state.draftedParts.filter(
      (part) => part.section_id === sectionId
    )
    return sectionParts.length + 1
  }
}
