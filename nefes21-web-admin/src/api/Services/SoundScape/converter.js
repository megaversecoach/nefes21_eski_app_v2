export default {
  convert: function (payload, language) {
    var formData = new FormData()
    formData.append('state', payload.state)
    if (payload.soundScapeData.coverImageUrl.file !== null) {
      formData.append('cover-image', payload.soundScapeData.coverImageUrl.file)
    }
    if (payload.soundScapeData.soundscape_mp3.file !== null) {
      formData.append(
        'soundscape-mp3',
        payload.soundScapeData.soundscape_mp3.file
      )
    }
    const sendData = {
      soundscape_id: payload.soundScapeData.soundscape_id,
      soundscape_title: payload.soundScapeData.soundscape_title,
      soundscape_isFree: payload.soundScapeData.soundscape_isFree,
      soundscape_isValid: payload.soundScapeData.soundscape_isValid,
      coverImageUrl: payload.soundScapeData.coverImageUrl.url,
      language: language
    }
    formData.append('soundscapeData', JSON.stringify(sendData))

    formData.forEach((key) => {
      console.log(key)
    })

    return formData
  }
}
