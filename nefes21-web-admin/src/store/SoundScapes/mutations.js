export default {
  loadSoundScapes: function (state, payload) {
    if (payload.state === 'draft') {
      state.draftedSoundScapes = payload.soundScapes
    } else {
      state.publishedSoundScapes = payload.soundScapes
    }
  },
  publish: function (state, payload) {
    console.log(payload)
    const draftedIndex = state.draftedSoundScapes.findIndex(
      (soundscape) =>
        soundscape.soundscape_id === payload.soundScape.soundscape_id
    )
    const publishedIndex = state.publishedSoundScapes.findIndex(
      (soundscape) =>
        soundscape.soundscape_id === payload.soundScape.soundscape_id
    )
    if (draftedIndex !== -1) {
      if (publishedIndex !== -1) {
        state.publishedSoundScapes.splice(publishedIndex, 1)
      }
      state.publishedSoundScapes.push(payload.soundScape)
      state.draftedSoundScapes.splice(draftedIndex, 1)
    }
  },
  delete: async function (state, payload) {
    const index = state.draftedSoundScapes.findIndex(
      (soundscape) => soundscape.soundscape_id === payload.soundscapeId
    )
    if (index !== null) {
      state.draftedSoundScapes.splice(index, 1)
    }
  }
}
