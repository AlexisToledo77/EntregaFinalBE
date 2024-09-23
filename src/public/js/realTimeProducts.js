const socket = io();

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
        if(result.status ==='error') throw new Error(result.error)
      })
      .then(() => fetch('/api/products'))
      .then(result => result.json())
      .then(result => {
        if(result.status === 'error') throw new Error(result.error)
        else socket.emit('productList', result)
        document.getElementById('title').value = ''
        document.getElementById('description').value = ''
        document.getElementById('code').value = ''
        document.getElementById('price').value = ''
        document.getElementById('stock').value = ''
        document.getElementById('category').value = ''
      })
      .catch(err => alert(`Ocurrio un error: ${err}`))
  })
deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: 'delete',
  })
  .then(result => {
    if(result.status === 'error') throw new Error(result.error)
  })
  .then(() => fetch('/api/products'))
  .then(result => result.json())
  .then(result => {
    if(result.status === 'error') throw new Error(result.error)
    else socket.emit('productList', result)
  })
  .catch(err => alert(`Ocurrio un error: ${err}`))
}

socket.on('updateProducts', data => {
  table.innerHTML = 
    `<tr>
      <td></td>
      <td><strong>Producto</strong></td>
      <td><strong>Descripción</strong></td>
      <td><strong>Precio</strong></td>
      <td><strong>Código</strong></td>
      <td><strong>Stock</strong></td>
    </tr>`;
    for(product of data) {
      let tr = document.createElement('tr')
      tr.innerHTML =
      ` 
        <td><button class="btn btn-danger" onclick="deleteProduct("${product.id}")">Eliminar</button></td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
      `
      table.getElementsByTagName('tbody')[0].appendChild(tr);
    }
})