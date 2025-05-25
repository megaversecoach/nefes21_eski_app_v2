export default {
  async convertUrlToFile(url, filename, mimeType) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], filename, { type: mimeType })
        })
        .then((file) => {
          resolve(file)
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
    })
  },
  async totalDuration(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      reader.onload = function (event) {
        var audioContext = new (window.AudioContext ||
          window.webkitAudioContext)()
        audioContext.decodeAudioData(event.target.result, function (buffer) {
          var duration = buffer.duration
          resolve(duration)
        })
      }
      reader.onerror = function (event) {
        console.error('An error ocurred reading the file: ', event)
        reject('error')
      }
      reader.readAsArrayBuffer(file)
    })
  }
}
