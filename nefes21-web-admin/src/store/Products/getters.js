export default {
  getSuppliers(state) {
    return state.suppliers
  },
  getProducts(state) {
    return state.products
  },
  getProgramProducts(state) {
    const programProducts = state.products.filter(
      (product) =>
        product.product_type === 'program' && product.product_group === 'main'
    )
    const emptyProgramProduct = { product_id: '', product_label: 'None' }
    programProducts.unshift(emptyProgramProduct)

    return programProducts
  },
  getDiscountedProgramProducts(state) {
    const discountedProgramProducts = state.products.filter(
      (product) =>
        product.product_type === 'program' &&
        product.product_group === 'discounted'
    )
    const emptyProgramProduct = { product_id: '', product_label: 'None' }
    discountedProgramProducts.unshift(emptyProgramProduct)

    return discountedProgramProducts
  },
  getPrepaidCodes(state) {
    return state.prepaidCodes
  },
  getPromoCodes(state) {
    return state.promoCodes
  },
  getPromoCodeById: (state) => (codeId) => {
    return state.promoCodes.find((promoCode) => promoCode.code_id === codeId)
  },
  getPrepaidCodeById: (state) => (codeId) => {
    return state.prepaidCodes.find(
      (prepaidCode) => prepaidCode.code_id === codeId
    )
  }
}
