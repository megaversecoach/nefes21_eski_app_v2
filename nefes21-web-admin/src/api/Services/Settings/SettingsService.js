import firebase from 'firebase'

const SettingsService = {
  getMaintenanceStates: async function () {
    const dbRef = firebase.database().ref('/maintenance')
    const doc = await dbRef.get()
    return doc.val()
  },
  updateMaintenanceStates: async function (start_date, end_date, state, _id) {
    const request = {
      start_date: start_date,
      end_date: end_date,
      state: state
    }
    await firebase
      .database()
      .ref('/maintenance/' + _id.id)
      .set(request, (error) => {
        if (error) {
          console.log(error)
        } else {
          // Data saved successfully!
        }
      })
  }
}

export { SettingsService }
