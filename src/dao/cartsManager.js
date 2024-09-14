import { CartModel } from "../models/cartModel.js"

export class CartsManager {
    static async getCart() {
        return await CartModel.find().lean()
    }

    static async getCartsBy(filtro = {}) {
        return await CartModel.findOne(filtro).lean()
    }

    static async createCart() {
        return await CartModel.create()
    }

    static async update(id, aModificar = {}) {
        return await CartModel.findByIdAndUpdate(id, aModificar, { new: true }).lean()
    }

    static async deleteCart(id) {
        return await CartModel.findByIdAndDelete(id).lean()
    }

    static async paginate(filter, options) {
        try {
            return await CartModel.paginate(filter, options);
        } catch (error) {
            console.log(error);
            throw new Error('Error al paginar productos');
        }
    }

}
//     static async updateItem(id, updatedItem) {
//         let cart = await getCart()
//         let index = cart.findIndex(item => item.id === id)
//         if (index !== -1) {
//             cart[index] = { ...cart[index], ...updatedItem }
//             await this.writeFile(cart)
//             return cart[index]
//         }
//         return null
//     }

//     static async deleteCart(id) {
//         return await cartModel.findByIdAndDelete(id).lean()
//     }

//     static async deleteItem(id) {
//         let cart = await getCart()
//         let filteredData = cart.filter(item => item.id !== id)
//         return await cartModel.findByIdAndDelete(id).lean()
//         await this.writeFile(filteredData)
//     }

//     static async getItemById(id) {
//         let cart = await this.readFile()
//         return cart.find(item => item.id === id)
//     }

// }

//   export const cartsManager = new CartsManager


// class CartsManager {
//   constructor(filePath) {
//     this.filePath = filePath
//   }

//   async readFile() {
//     try {
//       let cart = await fs.readFile(this.filePath, 'utf8')
//       return JSON.parse(cart)
//     } catch (error) {
//       if (error.code === 'ENOENT') {
//         return []
//       }
//       throw error
//     }
//   }

//   async writeFile(cart) {
//     await fs.writeFile(this.filePath, JSON.stringify(cart, null, 2))
//   }

//   async getNextId() {
//     let cart = await this.readFile()
//     let maxId = cart.reduce((max, item) => Math.max(max, item.id || 0), 0)
//     return maxId + 1
//   }

//   async addItem(item) {
//     let cart = await this.readFile()
//     let existingItem = cart.find(i => i.userId === parseInt(item.userId))

//     if (existingItem) {
//       await this.writeFile(cart)
//       return existingItem
//     } else {
//       item.id = await this.getNextId()
//       cart.push(item)
//       await this.writeFile(cart)
//       return item
//     }
//   }

//   async addItem(item) {
//     let cart = await this.readFile()
//     let existingItem = cart.find(i => i.userId === parseInt(item.userId))

//     if (existingItem) {
//       await this.writeFile(cart)
//       return existingItem
//     } else {
//       item.id = await this.getNextId()
//       cart.push(item)
//       await this.writeFile(cart)
//       return item
//     }
//   }


export const cartsManager = new CartsManager('./src/data/carts.json')