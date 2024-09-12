import { ProductModel } from '../models/productModel.js';

export class ProductManager {
    async addProduct(productData) {
        try {
            const newProduct = new ProductModel(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async getProducts(limit = 10, page = 1, sort, query) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
                lean: true
            };
            const filter = query ? { category: query } : {};

            const result = await ProductModel.paginate(filter, options);
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
