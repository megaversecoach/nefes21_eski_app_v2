export default {
  isTracksLoaded: (state) => (stateType) => {
    return stateType === 'publish'
      ? state.publishedTracks !== null
      : state.draftedTracks !== null
  },
  getTracks: (state) => (stateType) => {
    return stateType === 'publish' ? state.publishedTracks : state.draftedTracks
  },
  getPublishedTrackById: (state) => (trackId) => {
    return state.publishedTracks.find((track) => track.track_id === trackId)
  },
  getDraftedTrackById: (state) => (trackId) => {
    return state.draftedTracks.find((track) => track.track_id === trackId)
  },
  newTrackIndex: (state) => {
    return state.draftedTracks.length + 1
  }
}
