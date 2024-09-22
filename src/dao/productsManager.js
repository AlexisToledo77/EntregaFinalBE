import { ProductModel } from "../models/productModel.js"

export class ProductsManager {
  async addProduct(productData) {
      try {
          let newProduct = new ProductModel(productData);
          await newProduct.save();
          return newProduct;
      } catch (error) {
          console.error('Error al agregar producto:', error);
          throw error;
      }
  }
  async readFile() {
      try {
        let products = await ProductModel.paginate(filter, options)
        return JSON.parse(products)
      } catch (error) {
        if (error.code === 'ENOENT') {
          return []
        }
        throw error
      }
    }

  async getProducts(limit = 10, page = 1, sort, query) {
      try {
          let options = {
              page: parseInt(page),
              limit: parseInt(limit),
              sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
              lean: true
          };
          let filter = query ? { category: query } : {};

          let result = await ProductModel.paginate(filter, options);
          return result;
      } catch (error) {
          console.error('Error al obtener productos:', error);
          throw error;
      }
  }

  async getProductById(id) {
      try {
          return await ProductModel.findById(id).lean();
      } catch (error) {
          console.error('Error al obtener producto por ID:', error);
          throw error;
      }
  }

  async updateProduct(id, updateData) {
      try {
          return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
      } catch (error) {
          console.error('Error al actualizar producto:', error);
          throw error;
      }
  }

  async deleteProduct(id) {
      try {
          return await ProductModel.findByIdAndDelete(id);
      } catch (error) {
          console.error('Error al eliminar producto:', error);
          throw error;
      }
  }
}

// export class ProductsManager {

//     static async getProducts() {
//       return await ProductModel.find().lean()
//     }
  
//     static async getProductsBy(filtro = {}) {
//       return await ProductModel.findOne(filtro).lean()
//     }

//     static async getBy(filtro={}){
//       return await ProductModel.findOne(filtro).lean()
//   }
//     static async createProducts(product) {
//       return await ProductModel.create(product)
//     }

//     static async update(id, aModificar={}){
//         return await ProductModel.findByIdAndUpdate(id, aModificar, {new:true}).lean()
//     }
  
//     static async deleteProducts(id) {
//       return await ProductModel.findByIdAndDelete(id).lean()
//     }

//     static async paginate(filter, options) {
//         try {
//             return await ProductModel.paginate(filter, options)
//         } catch (error) {
//             console.log(error);
//             throw new Error('Error al paginar productos')
//         }
//     }
//   }
//   export const productsManager = new ProductsManager

