export default {
  isSoundscapeLoaded(state) {
    return state.publishedSoundScapes.length > 0
  },
  getDraftedSoundScapes(state) {
    return state.draftedSoundScapes
  },
  getPublishedSoundscapes(state) {
    return state.publishedSoundScapes
  },
  getDefaultSoundscapeOptions(state) {
    const soundscapes = state.publishedSoundScapes
    const muteOption = { soundscape_id: 'muted', soundscape_title: 'Sessiz' }
    soundscapes.unshift(muteOption)
    return soundscapes
  },
  getDraftedSoundscapeById: (state) => (soundScapeId) => {
    const data = state.draftedSoundScapes.find(
      (soundscape) => soundscape.soundscape_id === soundScapeId
    )
    return data
  },
  getPublishedSoundscapeById: (state) => (soundScapeId) => {
    const data = state.publishedSoundScapes.find(
      (soundscape) => soundscape.soundscape_id === soundScapeId
    )
    return data
  },
  findDifferences: (state) => (contents) => {
    let existingSoundscapeIds = contents.map((soundscape) => {
      return soundscape.soundscape_id
    })
    let differences = state.publishedSoundScapes.filter(
      (soundscape) => !existingSoundscapeIds.includes(soundscape.soundscape_id)
    )
    return differences
  }
}
