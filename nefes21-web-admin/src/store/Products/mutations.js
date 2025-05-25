export default {
  loadSuppliers: function (state, payload) {
    state.suppliers = payload.suppliers
  },
  loadProducts: function (state, payload) {
    state.products = payload.products
  },
  loadPrepaidCodes: function (state, payload) {
    state.prepaidCodes = payload.prepaidCodes
  },
  loadPromoCodes: function (state, payload) {
    state.promoCodes = payload.promoCodes
  }
}
