export default {
  convert: function (payload, language) {
    var formData = new FormData()
    formData.append('state', payload.state)
    if (payload.contentData.coverImageUrl.file !== null) {
      formData.append('content-cover', payload.contentData.coverImageUrl.file)
    }
    if (payload.contentData.showcaseImageUrl.file !== null) {
      formData.append(
        'content-showcase',
        payload.contentData.showcaseImageUrl.file
      )
    }
    const sendData = {
      content_id: payload.contentData.content_id,
      content_title: payload.contentData.content_title,
      content_description: payload.contentData.content_description,
      content_type_id: payload.contentData.content_type_id,
      isMultiTrack: payload.contentData.isMultiTrack,
      content_duration: payload.contentData.content_duration,
      author_id: payload.contentData.author_id,
      coverImageUrl: payload.contentData.coverImageUrl.url,
      showcaseImageUrl: payload.contentData.showcaseImageUrl.url,
      content_isNew: payload.contentData.content_isNew,
      content_isFree: payload.contentData.content_isFree,
      ageSegment: payload.contentData.ageSegment,
      genderSegment: payload.contentData.genderSegment,
      dateCreated: payload.contentData.dateCreated,
      datePublished: payload.contentData.datePublished,
      content_isValid: payload.contentData.content_isValid,
      content_version: payload.contentData.content_version,
      language: language
    }
    console.log('-----SENDING----')
    console.log(sendData)
    console.log('----')
    formData.append('contentData', JSON.stringify(sendData))
    return formData
  }
}
