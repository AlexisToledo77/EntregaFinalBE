import fs from 'fs/promises'

class ProductsManager {
  constructor(filePath) {
    this.filePath = filePath
  }

  async readFile() {
    try {
      let products = await fs.readFile(this.filePath, 'utf8')
      return JSON.parse(products)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  async writeFile(products) {
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
  }

  async getNextId() {
    let products = await this.readFile()
    let maxId = products.reduce((max, item) => Math.max(max, item.id || 0), 0)
    return maxId + 1
  }

  async addItem(item) {
    let products = await this.readFile()
    let existingItem = products.find(i => i.name.toLowerCase() === item.name.toLowerCase())
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1)
      await this.writeFile(products)
      return existingItem
    } else {
      item.id = await this.getNextId()
      item.quantity = item.quantity || 1
      products.push(item)
      await this.writeFile(products)
      return item
    }
  }

  async updateItem(id, updatedItem) {
    let products = await this.readFile()
    let index = products.findIndex(item => item.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedItem }
      await this.writeFile(products)
      return products[index]
    }
    return null
  }

  async deleteItem(id) {
    let products = await this.readFile()
    let filteredData = products.filter(item => item.id !== id)
    await this.writeFile(filteredData)
  }

  async getItemById(id) {
    let products = await this.readFile()
    return products.find(item => item.id === id)
  }

  async getItemByName(name) {
    let products = await this.readFile()
    return products.find(item => item.name.toLowerCase() === name.toLowerCase())
  }
}

export const productsManager = new ProductsManager('./src/data/products.json')
