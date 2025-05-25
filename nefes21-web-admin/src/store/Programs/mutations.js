export default {
  loadPublishedPrograms: function (state, payload) {
    state.publishedPrograms = payload.publishedPrograms
  },
  loadDraftedPrograms: function (state, payload) {
    state.draftedPrograms = payload.draftedPrograms
  },
  loadDraftProgram: function (state, payload) {
    state.draftProgram = payload.draftProgram
  },
  loadProgramLayout: function (state, payload) {
    state.programLayout = payload.programLayout
  },
  loadProgramLabels: function (state, payload) {
    state.programLabels = payload.programLabels
  },
  deleteProgramFromDrafts: function (state, payload) {
    const index = state.draftedPrograms.findIndex(
      (program) => program.program_id === payload.program_id
    )
    if (index !== -1) {
      state.draftedPrograms.splice(index, 1)
    }
  },
  publishProgram: function (state, payload) {
    const draftedIndex = state.draftedPrograms.findIndex(
      (program) => program.program_id === payload.program.program_id
    )
    const publishedIndex = state.publishedPrograms.findIndex(
      (program) => program.program_id === payload.program.program_id
    )
    if (draftedIndex !== -1) {
      if (publishedIndex !== -1) {
        state.publishedPrograms.splice(publishedIndex, 1)
      }
      state.publishedPrograms.push(payload.program)
      state.draftedPrograms.splice(draftedIndex, 1)
    }
  },
  reorderProgramLayout: function (state, payload) {
    payload.programLayout.forEach(function (item, index) {
      item.orderInSection = index + 1
    })
    state.programLayout = payload.programLayout
  },
  deleteProgramFromLayout: function (state, payload) {
    const index = state.programLayout.findIndex(
      (program) => (program.program_id = payload.program_id)
    )
    if (index !== -1) {
      state.programLayout.splice(index, 1)
    }
    state.programLayout.forEach(function (item, index) {
      item.orderInSection = index + 1
    })
  }
}
