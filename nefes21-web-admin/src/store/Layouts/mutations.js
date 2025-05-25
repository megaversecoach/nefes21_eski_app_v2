export default {
  loadDimensions: function (state, payload) {
    state.dimensions = payload.dimensions
  },
  loadDimensionLayout: function (state, payload) {
    state.dimensionLayout = payload.dimensionLayout
  },
  loadQuickstartLayout: function (state, payload) {
    state.quickStartLayout = payload.quickStartLayout
  },
  loadMoodCheckInLayout: function (state, payload) {
    state.moodLayouts = payload.moodLayouts
  },
  loadShowcaseTypes: function (state, payload) {
    state.showcaseTypes = payload.showcaseTypes
  },
  loadDimensionCategories: function (state, payload) {
    state.dimensionCategories = payload.dimensionCategories
  },
  loadQuickStartCategories: function (state, payload) {
    state.quickStartCategories = payload.quickStartCategories
  },
  clearFilteredDimensionLayout(state) {
    state.filteredDimensionLayouts = null
  },
  clearFilteredQuickstartLayout(state) {
    state.filteredQuickStartLayouts = null
  },
  clearFilteredMoodCheckInLayout(state) {
    state.filteredMoodLayouts = null
  },
  clearFilteredDimensionCategories(state) {
    state.filteredDimensionCategories = null
  },
  filteredQsLayoutByQsCategory: function (state, payload) {
    const qs_category_id = payload.qs_category_id
    const filtered = state.quickStartLayout.filter(
      (layoutItem) => layoutItem.qs_category_id === qs_category_id
    )
    filtered.sort((a, b) => a.orderInCategory - b.orderInCategory)
    state.filteredQuickStartLayouts = filtered
  },
  filteredMoodLayouts: function (state, payload) {
    const mood_id = payload.mood_id
    const filtered = state.moodLayouts.filter(
      (layoutItem) => layoutItem.mood_id === mood_id
    )
    state.filteredMoodLayouts = filtered
  },
  filteredDimensionCategories: function (state, payload) {
    const dimensionId = payload.dimension_id
    const filtered = state.dimensionCategories.filter(
      (layoutItem) => layoutItem.dimension_id === dimensionId
    )
    state.filteredDimensionCategories = filtered
    console.log(filtered)
  },
  filterDimensionLayoutByDimension: function (state, payload) {
    const dimensionId = payload.dimensionId
    const filteredDimensionLayout = state.dimensionLayout.filter(
      (dimension) => dimension.dimension_id === dimensionId
    )
    const filteredDimensionCategories = state.dimensionCategories.filter(
      (category) => category.dimension_id === dimensionId
    )
    const condition =
      filteredDimensionLayout != null && filteredDimensionCategories.length > 0
    if (condition) {
      filteredDimensionCategories.sort(
        (a, b) => a.orderInDimension - b.orderInDimension
      )
      if (dimensionId !== 'sleep') {
        const showcaseCategory = {
          category_id: 'showcase',
          category_label: 'Showcase',
          category_description: 'Showcase',
          orderInDimension: 0
        }
        filteredDimensionCategories.unshift(showcaseCategory)
      }
      const objects = []
      filteredDimensionCategories.forEach((item) => {
        const layoutItems = filteredDimensionLayout.filter(
          (dimension) => dimension.category_id === item.category_id
        )
        layoutItems.sort((a, b) => a.orderInCategory - b.orderInCategory)
        const layoutItem = {
          category_id: item.category_id,
          category_label: item.category_label,
          category_description: item.category_description,
          orderInDimension: item.orderInDimension,
          layoutItems: layoutItems
        }
        objects.push(layoutItem)
      })
      state.filteredDimensionLayouts = null
      state.filteredDimensionLayouts = objects
    }
  },
  reOrderDimensionLayout: function (state, payload) {
    const category_id = payload.data[0].category_id
    const index = state.filteredDimensionLayouts.findIndex(
      (item) => item.category_id === category_id
    )
    payload.data.forEach(function (item, index) {
      item.orderInCategory = index + 1
    })
    state.filteredDimensionLayouts[index].layoutItems = payload.data
  },
  reOrderQsLayout: function (state, payload) {
    payload.data.forEach(function (item, index) {
      item.orderInCategory = index + 1
    })
    state.filteredQuickStartLayouts = payload.data
  },
  reOrderDimensionCategories: function (state, payload) {
    payload.data.forEach(function (item, index) {
      item.orderInDimension = index + 1
    })
    state.filteredDimensionCategories = payload.data
  },
  addContentToQsLayout: function (state, payload) {
    const orderInCategory = state.filteredQuickStartLayouts.length + 1
    const object = {
      content_id: payload.content_id,
      language: payload.language,
      orderInCategory: orderInCategory,
      qs_category_id: payload.qs_category_id
    }
    //state.quickStartLayout.push(object)
    state.filteredQuickStartLayouts.push(object)
  },
  addCategoryToFilteredCategory: function (state, payload) {
    const newCategory = {
      category_description: payload.data.category_description,
      category_id: payload.data.category_id,
      category_label: payload.data.category_label,
      dimension_id: payload.data.dimension_id,
      orderInDimension: payload.data.orderInDimension,
      language: payload.language
    }
    console.log(newCategory)
    if (payload.data.category_id === '') {
      const newCategory_id = Math.floor(100000 + Math.random() * 900000)
      newCategory.category_id = payload.data.dimension_id + '-' + newCategory_id
    }
    state.filteredDimensionCategories.push(newCategory)
  },
  updateCategory: function (state, payload) {
    const category = {
      category_description: payload.data.category_description,
      category_id: payload.data.category_id,
      category_label: payload.data.category_label,
      dimension_id: payload.data.dimension_id,
      orderInDimension: payload.data.orderInDimension,
      language: payload.language
    }
    const index = state.filteredDimensionCategories.findIndex(
      (card) => card.category_id === category.category_id
    )
    state.filteredDimensionCategories[index] = category
  },
  addContentToMoodLayout: function (state, payload) {
    const object = {
      content_id: payload.content_id,
      language: payload.language,
      mood_id: payload.mood_id
    }
    //state.moodLayouts.push(object)
    state.filteredMoodLayouts.push(object)
  },
  addContentToDimensionLayout: function (state, payload) {
    const index = state.filteredDimensionLayouts.findIndex(
      (item) => item.category_id === payload.category_id
    )
    const orderInCategory =
      state.filteredDimensionLayouts[index].layoutItems.length + 1

    const object = {
      category_id: payload.category_id,
      content_id: payload.content_id,
      dimension_id: payload.dimension_id,
      language: payload.language,
      orderInCategory: orderInCategory,
      showcase_type_id: payload.showcase_type_id,
      soundscape_id: payload.soundscape_id
    }
    console.log(object)
    // Eklenmeli mi ?
    state.dimensionLayout.push(object)
    state.filteredDimensionLayouts[index].layoutItems.push(object)
  },
  deleteContentFromQsLayout: function (state, payload) {
    const index = state.filteredQuickStartLayouts.findIndex(
      (item) => item.content_id === payload.content_id
    )
    // const qs_layout_index = state.quickStartLayout.findIndex(
    //   (item) =>
    //     item.content_id === payload.content_id &&
    //     item.qs_category_id === payload.qs_category_id
    // )
    // if (index !== -1 && qs_layout_index !== -1) {
    //   state.quickStartLayout.splice(qs_layout_index, 1)
    if (index !== -1) {
      state.filteredQuickStartLayouts.splice(index, 1)
      state.filteredQuickStartLayouts.forEach(function (item, index) {
        item.orderInCategory = index + 1
      })
    }
  },
  deleteCategoryFromFilteredCategories: function (state, payload) {
    const index = state.filteredDimensionCategories.findIndex(
      (item) => item.category_id === payload.category_id
    )
    // const qs_layout_index = state.quickStartLayout.findIndex(
    //   (item) =>
    //     item.content_id === payload.content_id &&
    //     item.qs_category_id === payload.qs_category_id
    // )
    // if (index !== -1 && qs_layout_index !== -1) {
    //   state.quickStartLayout.splice(qs_layout_index, 1)
    if (index !== -1) {
      state.filteredDimensionCategories.splice(index, 1)
      state.filteredDimensionCategories.forEach(function (item, index) {
        item.orderInDimension = index + 1
      })
    }
  },
  deleteContentFromMoodLayout: function (state, payload) {
    const index = state.filteredMoodLayouts.findIndex(
      (item) => item.content_id === payload.content_id
    )
    // const mood_index = state.moodLayouts.findIndex(
    //   (item) =>
    //     item.content_id === payload.content_id &&
    //     item.mood_id === payload.mood_id
    // )
    //if (index !== -1 && mood_index !== -1) {
    // state.moodLayouts.splice(mood_index, 1)
    if (index !== -1) {
      state.filteredMoodLayouts.splice(index, 1)
    }
  },
  deleteContentFromDimensionLayout: function (state, payload) {
    const index = state.filteredDimensionLayouts.findIndex(
      (item) => item.category_id === payload.category_id
    )

    // const dimension_layout_index = state.dimensionLayout.findIndex(
    //   (item) =>
    //     item.category_id === payload.category_id &&
    //     item.content_id === payload.content_id &&
    //     item.dimension_id === payload.dimension_id
    // )
    const delete_index =
      payload.content_id !== ''
        ? state.filteredDimensionLayouts[index].layoutItems.findIndex(
            (item) => item.content_id === payload.content_id
          )
        : state.filteredDimensionLayouts[index].layoutItems.findIndex(
            (item) => item.soundscape_id === payload.soundscape_id
          )
    // Silme ana layouttan güncellemeli mi ?
    //state.dimensionLayout.splice(dimension_layout_index, 1)
    state.filteredDimensionLayouts[index].layoutItems.splice(delete_index, 1)
    state.filteredDimensionLayouts[index].layoutItems.forEach(function (
      item,
      index
    ) {
      item.orderInCategory = index + 1
    })
  }
}
