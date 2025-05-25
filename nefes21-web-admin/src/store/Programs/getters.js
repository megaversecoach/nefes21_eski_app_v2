export default {
  publishedPrograms(state) {
    return state.publishedPrograms
  },
  getPublishedProgramById: (state) => (programId) => {
    return state.publishedPrograms.find(
      (program) => program.program_id === programId
    )
  },
  getDraftedProgramById: (state) => (programId) => {
    return state.draftedPrograms.find(
      (program) => program.program_id === programId
    )
  },
  getProgramTitleById: (state) => (programId) => {
    return state.publishedPrograms.find(
      (program) => program.program_id === programId
    ).program_title
  },
  draftedPrograms(state) {
    return state.draftedPrograms
  },
  draftProgram(state) {
    return state.draftProgram
  },
  isProgramExistsOnDraft: (state) => (programId) => {
    const result = state.draftedPrograms.some(
      (program) => program.program_id === programId
    )
    console.log('isProgramExistsOnDraft: ', result)
    return result
  },
  programLayout(state) {
    return state.programLayout
  }
}
