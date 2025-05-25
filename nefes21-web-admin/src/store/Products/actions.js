import { ProductService } from '@/api/Services/Product/ProductService'

export default {
  getSuppliers: async function (context) {
    const data = await ProductService.getSuppliers()
    console.log('suppliers: ', data)
    context.commit('loadSuppliers', { suppliers: data })
  },
  getProducts: async function (context) {
    const data = await ProductService.getProducts()
    console.log('products: ', data)
    context.commit('loadProducts', { products: data })
  },
  getPrepaidCodes: async function (context) {
    const data = await ProductService.getPrepaidCodes()
    console.log('prepaid codes: ', data)
    context.commit('loadPrepaidCodes', { prepaidCodes: data })
  },
  getPromoCodes: async function (context) {
    const data = await ProductService.getPromoCodes()
    console.log('promo codes: ', data)
    context.commit('loadPromoCodes', { promoCodes: data })
  },
  savePrepaidCode: async function (context, payload) {
    const data = await ProductService.savePrepaidCode(
      payload.data,
      payload.quantity
    )
    console.log('SavePrepaidCode: ', data)
    return data
  },
  savePromoCode: async function (context, payload) {
    delete payload.data.dateCreated
    const data = await ProductService.savePromoCode(payload.data)
    console.log('SavePromoCode: ', data)
    return data
  },
  refundPrepaidCode: async function (context, payload) {
    const data = await ProductService.refundPrepaidCode(payload.data)
    console.log('RefundPrepaidCode: ', data)
    return data.success
  }
}
