export default {
  convert: function (payload, language) {
    let formData = new FormData()
    formData.append('state', payload.state)
    if (payload.parts !== undefined) {
      const sendData = payload.parts
      sendData.forEach((part) => {
        part.language = language
      })
      console.log('PartListSendData: ', sendData)
      formData.append('partList', JSON.stringify(sendData))
    } else {
      if (payload.part.part_mp3.file !== null) {
        formData.append('part-audio', payload.part.part_mp3.file)
      }
      if (payload.part.part_mp4.file !== null) {
        formData.append('part-video', payload.part.part_mp4.file)
      }
      const sendData = {
        part_id: payload.part.part_id,
        part_title: payload.part.part_title,
        part_label: payload.part.part_label,
        part_duration: payload.part.part_duration,
        part_type: payload.part.part_type,
        quest_title: payload.part.quest_title,
        quest_description: payload.part.quest_description,
        quest_information: payload.part.quest_information,
        orderInSection: payload.part.orderInSection,
        section_id: payload.part.section_id,
        program_id: payload.part.program_id,
        soundscape_id: payload.part.soundscape_id,
        soundscape_volume: payload.part.soundscape_volume,
        part_isValid: payload.part.part_isValid,
        part_version: payload.part.part_version,
        language: language
      }
      console.log('PartDataSendData: ', sendData)
      formData.append('partData', JSON.stringify(sendData))
    }
    return formData
  }
}
