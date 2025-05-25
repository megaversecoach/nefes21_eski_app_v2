import { TrackService } from '../../api/Services/Tracks/TrackService'
import converter from '../../api/Services/Tracks/converter'

export default {
  getPublishedTracksByContentId: async function (context, payload) {
    const data = await TrackService.getPublishedTracksByContentId(
      payload.content_id
    )
    context.commit('loadTrack', {
      tracks: data,
      state: 'publish'
    })
  },
  getDraftedTracksByContentId: async function (context, payload) {
    const data = await TrackService.getDraftedTracksByContentId(
      payload.content_id
    )
    context.commit('loadTrack', {
      tracks: data,
      state: 'draft'
    })
  },
  sortUpdate: function (context, payload) {
    context.commit('sortUpdate', {
      tracks: payload.tracks
    })
  },
  saveAsDraft: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const formData = converter.convert(payload, language)
    const data = await TrackService.saveAsDraft(formData, (progressEvent) => {
      let percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      context.rootState.uploaderPercentage =
        percentage === 100 ? null : percentage
    })
    return data.success
  },
  deleteTrack: async function (context, payload) {
    console.log('***')
    const data = await TrackService.deleteTrack(payload.track_id)
    console.log(data)
    if (data.success) {
      context.commit('deleteTrack', payload)
    }
    return data.success
  }
}
