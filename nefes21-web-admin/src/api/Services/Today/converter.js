export default {
  convert: function (payload, language) {
    console.log(payload.data)
    var formData = new FormData()
    if (payload.data.showcase_imageUrl.file !== null) {
      formData.append('showcase-image', payload.data.showcase_imageUrl.file)
    }
    const sendData = {
      actionUrl: payload.data.actionUrl,
      action: payload.data.action,
      content_id: payload.data.content_id,
      method: 'non-personalized',
      priorityRating: parseInt(payload.data.priorityRating),
      showcase_id: payload.data.showcase_id,
      showcase_imageUrl: payload.data.showcase_imageUrl.url,
      showcase_type_id: payload.data.showcase_type_id,
      showcase_isFree:
        payload.data.showcase_isFree === ''
          ? false
          : payload.data.showcase_isFree,
      showcase_isValid: payload.data.showcase_isValid,
      language: language
    }
    console.log(sendData)
    formData.append('showcaseItemData', JSON.stringify(sendData))
    return formData
  }
}
