export default {
  loadPublishedParts: function (state, payload) {
    state.publishedParts = payload.publishedParts
  },
  loadDraftedParts: function (state, payload) {
    state.draftedParts = payload.draftedParts
  },
  deletePartFromDrafts: function (state, payload) {
    const partId = payload.part_id
    const sectionId = state.draftedParts.find((part) => part.part_id === partId)
      .section_id

    const index = state.draftedParts.findIndex(
      (part) => part.part_id === partId
    )

    if (index !== -1) {
      state.draftedParts.splice(index, 1)
    }
    let sectionParts = state.draftedParts.filter(
      (part) => part.section_id === sectionId
    )

    sectionParts.forEach(function (item, index) {
      item.orderInSection = index + 1
    })
  }
}
