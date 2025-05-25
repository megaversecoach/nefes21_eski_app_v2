export default {
  convert: function (payload, language) {
    let formData = new FormData()
    formData.append('state', payload.state)
    if (payload.programData.coverImageUrl.file !== null) {
      formData.append('program-cover', payload.programData.coverImageUrl.file)
    }
    if (payload.programData.bgImageUrl.file !== null) {
      formData.append('program-background', payload.programData.bgImageUrl.file)
    }
    if (payload.programData.trailerCoverImageUrl.file !== null) {
      formData.append(
        'trailer-cover',
        payload.programData.trailerCoverImageUrl.file
      )
    }
    if (payload.programData.trailerUrl.file !== null) {
      formData.append('trailer-mp4', payload.programData.trailerUrl.file)
    }
    const sendData = {
      program_id: payload.programData.program_id,
      program_title: payload.programData.program_title,
      program_description: payload.programData.program_description,
      program_information: payload.programData.program_information,
      program_gains: payload.programData.program_gains,
      program_duration: payload.programData.program_duration,
      author_id: payload.programData.author_id,
      coverImageUrl: payload.programData.coverImageUrl.url,
      bgImageUrl: payload.programData.bgImageUrl.url,
      program_partCount: payload.programData.program_partCount,
      program_sections: payload.programData.program_sections,
      trailerUrl: payload.programData.trailerUrl.url,
      trailerCoverImageUrl: payload.programData.trailerCoverImageUrl.url,
      program_isNew: payload.programData.program_isNew,
      program_isFree: payload.programData.program_isFree,
      program_isOnSale: payload.programData.program_isOnSale,
      product_id: payload.programData.product_id,
      discounted_product_id: payload.programData.discounted_product_id,
      discountRate: payload.programData.discountRate,
      dateCreated: payload.programData.dateCreated,
      datePublished: payload.programData.datePublished,
      program_isValid: payload.programData.program_isValid,
      program_version: payload.programData.program_version,
      language: language
    }
    console.log('Program SendData: ', sendData)
    formData.append('programData', JSON.stringify(sendData))
    return formData
  }
}
