import fs from 'fs/promises'


class CartsManager {
  constructor(filePath) {
    this.filePath = filePath
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  async writeFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2))
  }

  async getNextId() {
    const data = await this.readFile()
    const maxId = data.reduce((max, item) => Math.max(max, item.id || 0), 0)
    return maxId + 1
  }

  async addItem(item) {
    const data = await this.readFile()
    const existingItem = data.find(i => i.userId === parseInt(item.userId))
    
    if (existingItem) {
      await this.writeFile(data)
      return existingItem
    } else {
      item.id = await this.getNextId()
      data.push(item)
      await this.writeFile(data)
      return item
    }
  }

  async updateItem(id, updatedItem) {
    const data = await this.readFile()
    const index = data.findIndex(item => item.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedItem }
      await this.writeFile(data)
      return data[index]
    }
    return null
  }

  async deleteItem(id) {
    const data = await this.readFile()
    const filteredData = data.filter(item => item.id !== id)
    await this.writeFile(filteredData)
  }

  async getItemById(id) {
    const data = await this.readFile()
    return data.find(item => item.id === id)
  }
}


export const cartsManager = new CartsManager('./src/data/carts.json')
