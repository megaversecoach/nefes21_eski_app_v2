function sort(tracks) {
  tracks.forEach(function (item, index) {
    item.orderInContent = index + 1
  })
  return tracks
}

export default {
  loadTrack: function (state, payload) {
    payload.tracks.sort((a, b) => a.orderInContent - b.orderInContent)
    if (payload.state === 'publish') {
      state.publishedTracks = null
      state.publishedTracks = payload.tracks
    } else {
      state.draftedTracks = null
      state.draftedTracks = payload.tracks
    }
  },
  deleteTrack: function (state, payload) {
    const track_id = payload.track_id
    const index = state.draftedTracks.findIndex(
      (track) => track.track_id === track_id
    )
    if (index !== -1) {
      state.draftedTracks.splice(index, 1)
    }
    const sortedTracks = sort(state.draftedTracks)
    state.draftedTracks = null
    state.draftedTracks = sortedTracks
  },
  sortUpdate: function (state, payload) {
    const sortedTracks = sort(payload.tracks)
    state.draftedTracks = null
    state.draftedTracks = sortedTracks
  }
}
