import fs from 'fs/promises'

class CartsManager {
  constructor(filePath) {
    this.filePath = filePath
  }

  async readFile() {
    try {
      let cart = await fs.readFile(this.filePath, 'utf8')
      return JSON.parse(cart)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  async writeFile(cart) {
    await fs.writeFile(this.filePath, JSON.stringify(cart, null, 2))
  }

  async getNextId() {
    let cart = await this.readFile()
    let maxId = cart.reduce((max, item) => Math.max(max, item.id || 0), 0)
    return maxId + 1
  }

  async addItem(item) {
    let cart = await this.readFile()
    let existingItem = cart.find(i => i.userId === parseInt(item.userId))
    
    if (existingItem) {
      await this.writeFile(cart)
      return existingItem
    } else {
      item.id = await this.getNextId()
      cart.push(item)
      await this.writeFile(cart)
      return item
    }
  }

  async updateItem(id, updatedItem) {
    let cart = await this.readFile()
    let index = cart.findIndex(item => item.id === id)
    if (index !== -1) {
      cart[index] = { ...cart[index], ...updatedItem }
      await this.writeFile(cart)
      return cart[index]
    }
    return null
  }

  async deleteItem(id) {
    let cart = await this.readFile()
    let filteredData = cart.filter(item => item.id !== id)
    await this.writeFile(filteredData)
  }

  async getItemById(id) {
    let cart = await this.readFile()
    return cart.find(item => item.id === id)
  }
}


export const cartsManager = new CartsManager('./src/data/carts.json')
