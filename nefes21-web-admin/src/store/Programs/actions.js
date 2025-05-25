import { ProgramService } from '@/api/Services/Programs/ProgramService'
import converter from '../../api/Services/Programs/converter'

export default {
  getPublishedPrograms: async function (context) {
    const data = await ProgramService.getPublishedPrograms()
    console.log('Published Programs: ', data)
    context.commit('loadPublishedPrograms', { publishedPrograms: data })
  },
  getDraftedPrograms: async function (context) {
    const data = await ProgramService.getDraftedPrograms()
    console.log('Drafted Programs: ', data)
    context.commit('loadDraftedPrograms', { draftedPrograms: data })
  },
  getDraftedProgramById: async function (context, payload) {
    const data = await ProgramService.getDraftedProgramById(payload.program_id)
    console.log('Drafted Program: ', data)
    context.commit('loadDraftProgram', { draftProgram: data })
    return data
  },
  saveProgramAsDraft: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const formData = converter.convert(payload, language)
    const data = await ProgramService.saveProgramAsDraft(
      formData,
      (progressEvent) => {
        let percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        context.rootState.uploaderPercentage =
          percentage === 100 ? null : percentage
      }
    )
    return data.success
  },
  deleteProgramFromDrafts: async function (context, payload) {
    const data = await ProgramService.deleteProgramFromDrafts(
      payload.program_id
    )
    console.log('DeleteProgram:', data)
    if (data.success) {
      context.commit('deleteProgramFromDrafts', payload)
    }
  },
  publishProgram: async function (context, payload) {
    const data = await ProgramService.publishProgram(payload.program_id)
    console.log('PublishedProgram: ', data)
    context.commit('publishProgram', { program: data })
  },
  getProgramLayout: async function (context) {
    const data = await ProgramService.getProgramLayout()
    console.log('ProgramLayout: ', data)
    context.commit('loadProgramLayout', { programLayout: data })
  },
  getProgramLabels: async function (context) {
    const data = await ProgramService.getProgramLabels()
    console.log('ProgramLabels: ', data)
    context.commit('loadProgramLabels', { programLabels: data })
  },
  reorderProgramLayout: function (context, payload) {
    context.commit('reorderProgramLayout', payload)
  },
  deleteProgramFromLayout: function (context, payload) {
    context.commit('deleteProgramFromLayout', payload)
  }
}
