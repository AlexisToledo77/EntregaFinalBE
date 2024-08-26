const socket = io()
const productForm = document.getElementById('productForm')
const productList = document.getElementById('productList')

productForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let name = document.getElementById('productName').value
    let price = document.getElementById('productPrice').value
    let quantity = document.getElementById('productQuantity').value
    socket.emit('newProduct', { name, price: Number(price), quantity: Number(quantity) })
    productForm.reset()
})

socket.on('products', (products) => {
    productList.innerHTML = ''
    products.forEach(product => {
        let li = document.createElement('li')
        li.textContent = `${product.name} - $${product.price} - Cantidad: ${product.quantity} `
        let deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar'
        deleteButton.onclick = () => socket.emit('deleteProduct', product.id)
        li.appendChild(deleteButton)
        productList.appendChild(li)
    })
})