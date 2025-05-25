export default {
  convertDimensionLayout: function (data, language) {
    const array = []
    data.map((filteredData) => {
      filteredData.layoutItems.forEach((item) => {
        item.language = language
        array.push(item)
      })
    })
    return array
  },
  convertDimensionCategories: function (data, language) {
    data.forEach((item) => {
      item.language = language
    })
    console.log(data)
    return data
  }
}
