const socket = io()
const productForm = document.getElementById('productForm')
const productList = document.getElementById('productList')

productForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('productName').value
    const price = document.getElementById('productPrice').value
    const quantity = document.getElementById('productQuantity').value
    socket.emit('newProduct', { name, price: Number(price), quantity: Number(quantity) })
    productForm.reset()
})

socket.on('products', (products) => {
    productList.innerHTML = ''
    products.forEach(product => {
        const li = document.createElement('li')
        li.textContent = `${product.name} - $${product.price} - Cantidad: ${product.quantity} `
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar'
        deleteButton.onclick = () => socket.emit('deleteProduct', product.id)
        li.appendChild(deleteButton)
        productList.appendChild(li)
    })
})