import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'
const TrackService = {
  getPublishedTracksByContentId: async function (content_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TrackEndpoints.getPublishedTracksByContentId,
        content_id
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedTracksByContentId: async function (content_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TrackEndpoints.getDraftedTracksByContentId,
        content_id
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveAsDraft: async function (data, config) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TrackEndpoints.saveAsDraft,
        undefined,
        data,
        { 'Content-Type': 'multipart/form-data' },
        config
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  deleteTrack: async function (track_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TrackEndpoints.deleteTrack,
        undefined,
        { track_id: track_id }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { TrackService }
