export default {
  convert: function (payload, language) {
    var formData = new FormData()
    formData.append('state', payload.state)
    if (payload.authorData.headerImageUrl.file !== null) {
      formData.append('header-image', payload.authorData.headerImageUrl.file)
    }
    if (payload.authorData.profilePicUrl.file !== null) {
      formData.append('profile-pic', payload.authorData.profilePicUrl.file)
    }
    const sendData = {
      author_id: payload.authorData.author_id,
      author_name: payload.authorData.author_name,
      author_surname: payload.authorData.author_surname,
      author_label: payload.authorData.author_label,
      author_title: payload.authorData.author_title,
      author_info: payload.authorData.author_info,
      author_position: payload.authorData.author_position,
      profilePicUrl: payload.authorData.profilePicUrl.url,
      headerImageUrl: payload.authorData.headerImageUrl.url,
      isConsulting: payload.authorData.isConsulting,
      language: language
    }
    console.log(sendData)
    formData.append('authorData', JSON.stringify(sendData))
    return formData
  }
}
