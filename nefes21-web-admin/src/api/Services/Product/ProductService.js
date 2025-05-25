import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const ProductService = {
  getSuppliers: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProductEndpoints.getSuppliers
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getProducts: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProductEndpoints.getProducts
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getPrepaidCodes: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProductEndpoints.getPrepaidCodes
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getPromoCodes: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProductEndpoints.getPromoCodes
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  savePrepaidCode: async function (data, quantity) {
    const body = {
      product_id: data.product_id,
      supplier_id: data.supplier_id,
      quantity: quantity
    }
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProductEndpoints.savePrepaidCode,
        undefined,
        body
      )
      console.log('SavePrepaidCodeResponse: ', response.data)
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  savePromoCode: async function (data) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProductEndpoints.savePromoCode,
        undefined,
        data
      )
      console.log('SavePromoCodeResponse: ', response.data)
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  refundPrepaidCode: async function (data) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProductEndpoints.refundPrepaidCode,
        undefined,
        { code_id: data.code_id }
      )
      console.log('RefundPrepaidCodeResponse: ', response.data)
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { ProductService }
