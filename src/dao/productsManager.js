import { ProductModel } from "../models/productModel.js"

export class ProductsManager {

    static async getProducts() {
      return await ProductModel.find().lean()
    }
  
    static async getProductsBy(filtro = {}) {
      return await ProductModel.findOne(filtro).lean()
    }

    static async getProductsById(pid) {
      return await ProductModel.findById(pid).lean()
    }

    static async getBy(filtro={}){
      return await ProductModel.findOne(filtro).lean()
  }
    static async createProducts(product) {
      return await ProductModel.create(product)
    }

    static async update(id, aModificar={}){
        return await ProductModel.findByIdAndUpdate(id, aModificar, {new:true}).lean()
    }
  
    static async deleteProducts(id) {
      return await ProductModel.findByIdAndDelete(id).lean()
    }

    static async paginate(filter, options) {
        try {
            return await ProductModel.paginate(filter, options)
        } catch (error) {
            console.log(error);
            throw new Error('Error al paginar productos')
        }
    }
  }
  export const productsManager = new ProductsManager
