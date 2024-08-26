import fs from 'fs/promises'

class UserManager {
  constructor(filePath) {
    this.filePath = filePath
  }

  async readFile() {
    try {
      const user = await fs.readFile(this.filePath, 'utf8')
      return JSON.parse(user)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  async writeFile(user) {
    await fs.writeFile(this.filePath, JSON.stringify(user, null, 2))
  }

  async getNextId() {
    let user = await this.readFile()
    let maxId = user.reduce((max, item) => Math.max(max, item.id || 0), 0)
    return maxId + 1
  }

  async addItem(item) {
    let user = await this.readFile()
    let existingItem = user.find(i => i.name.toLowerCase() === item.name.toLowerCase())
    if (existingItem) {
      await this.writeFile(user)
      return existingItem 
    } else {
      item.id = await this.getNextId()
      user.push(item)
      await this.writeFile(user)
      return item
    }
  }

  async updateItem(id, updatedItem) {
    let user = await this.readFile()
    let index = user.findIndex(item => item.id === id)
    if (index !== -1) {
      user[index] = { ...user[index], ...updatedItem }
      await this.writeFile(user)
      return user[index]
    }
    return null
  }

  async deleteItem(id) {
    let user = await this.readFile()
    let filteredData = user.filter(item => item.id !== id)
    await this.writeFile(filteredData)
  }

  async getItemById(id) {
    let user = await this.readFile()
    return user.find(item => item.id === id)
  }

  async getItemByName(name) {
    let user = await this.readFile()
    return user.find(item => item.name.toLowerCase() === name.toLowerCase())
  }
}

export const userManager = new UserManager('./src/data/users.json')