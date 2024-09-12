import { CartModel } from '../models/cartModel.js';

export class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            return await CartModel.findById(id).populate('products.product').lean();
        } catch (error) {
            console.error('Error al obtener carrito por ID:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            return await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
        } catch (error) {
            console.error('Error al actualizar carrito:', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al actualizar cantidad de producto en el carrito:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            return await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
    }
}
