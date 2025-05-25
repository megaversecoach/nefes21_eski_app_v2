import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const SoundScapeService = {
  getPublishedSoundscapes: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.SoundscapeEndpoints.getPublishedSoundscapes
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedSoundscapes: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.SoundscapeEndpoints.getDraftedSoundscapes
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveAsDraft: async function (data, config) {
    console.log(data)
    try {
      const response = await ApiService.requestToServer(
        Endpoints.SoundscapeEndpoints.saveAsDraft,
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
  publish: async function (soundScapeId) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.SoundscapeEndpoints.publish,
        undefined,
        {
          soundscape_id: soundScapeId
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  delete: async function (soundscapeId) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.SoundscapeEndpoints.delete,
        undefined,
        {
          soundscape_id: soundscapeId
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { SoundScapeService }
