export default {
  convert: function (payload, language) {
    const formData = new FormData()
    formData.append('state', payload.state)
    if (payload.narratorData.profilePicUrl.file !== null) {
      formData.append('profile-pic', payload.narratorData.profilePicUrl.file)
    }
    const sendData = {
      narrator_id: payload.narratorData.narrator_id,
      narrator_name: payload.narratorData.narrator_name,
      narrator_surname: payload.narratorData.narrator_surname,
      narrator_info: payload.narratorData.narrator_info,
      narrator_title: payload.narratorData.narrator_title,
      profilePicUrl: payload.narratorData.profilePicUrl.url,
      language: language
    }
    console.log(sendData)
    formData.append('narratorData', JSON.stringify(sendData))
    return formData
  }
}
