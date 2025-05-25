export default {
  convert: function (payload, language) {
    var formData = new FormData()
    formData.append('state', payload.state)
    if (payload.tracks !== undefined) {
      const sendData = payload.tracks
      sendData.forEach((item) => {
        item.language = language
      })
      console.log(sendData)
      formData.append('trackList', JSON.stringify(sendData))
    } else {
      if (payload.track.track_mp3.file !== null) {
        formData.append('track-mp3', payload.track.track_mp3.file)
      }
      const sendData = {
        track_id: payload.track.track_id,
        track_title: payload.track.track_title,
        track_label: payload.track.track_label,
        track_duration: payload.track.track_duration,
        track_isFree: payload.track.track_isFree,
        orderInContent: payload.track.orderInContent,
        content_id: payload.track.content_id,
        narrator_id: payload.track.narrator_id,
        soundscape_id: payload.track.soundscape_id,
        soundscape_volume: payload.track.soundscape_volume,
        source_id: payload.track.source_id,
        track_isValid: payload.track.track_isValid,
        track_version: payload.track.track_version,
        language: language
      }
      console.log(sendData)
      formData.append('trackData', JSON.stringify(sendData))
    }
    return formData
  }
}
