const socket = io()

const table = document.getElementById('productsTable')

document.getElementById('createBtn').addEventListener('click', () => {
  const body = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    price: document.getElementById('price').value,
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
  }

  fetch('/api/products', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(result => result.json())
    .then(result => {

      if (result.status === 'error') throw new Error(result.error)
    })
    .then(() => fetch('/api/products'))
    .then(result => {
      if (result.status === 'error') throw new Error(result.error)
      else socket.emit('productList', result)
      document.getElementById('title').value = ''
      document.getElementById('description').value = ''
      document.getElementById('code').value = ''
      document.getElementById('price').value = ''
      document.getElementById('stock').value = ''
      document.getElementById('category').value = ''
      window.location.reload()
    })
    .catch(err => {
      console.error('Error:', err)
      alert(`Ocurrio un error: ${err}`)
    })
})

function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'error') throw new Error(result.message)
      console.log('Producto eliminado:', result)
      return fetch('/api/products')
    })
    .then(result => {
      if (result.status === 'error') throw new Error(result.message)
      socket.emit('productList', result)
      window.location.reload()
    })
    .catch(err => {
      console.error('Error:', err)
      alert(`Ocurrió un error: ${err.message}`)
    })
}
