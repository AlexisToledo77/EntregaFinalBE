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
        console.log('Filter:', filter);
        console.log('Options:', options);
        const result = await ProductModel.paginate(filter, options);
        console.log('Pagination result:', result);
        return result;
      } catch (error) {
        console.error('Error en la paginación:', error);
        throw error;
      }
    }
  }
  export const productsManager = new ProductsManager
