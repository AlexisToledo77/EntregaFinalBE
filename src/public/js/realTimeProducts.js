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
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'error') throw new Error(result.message);
    console.log('Producto creado:', result);
    return fetch('/api/products');
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'error') throw new Error(result.message);
    socket.emit('productList', result);
    
    ['title', 'description', 'code', 'price', 'stock', 'category'].forEach(id => {
      document.getElementById(id).value = '';
    });
  })
  .catch(err => {
    console.error('Error:', err);
    alert(`Ocurrió un error: ${err.message}`);
  });
});

function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'error') throw new Error(result.message);
    console.log('Producto eliminado:', result);
    return fetch('/api/products');
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'error') throw new Error(result.message);
    socket.emit('productList', result);
  })
  .catch(err => {
    console.error('Error:', err);
    alert(`Ocurrió un error: ${err.message}`);
  });
}

socket.on('updateProducts', data => {
  const tbody = table.getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';
  for(let product of data) {
    let tr = document.createElement('tr')
    tr.innerHTML =
    ` 
      <td><button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Eliminar</button></td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
    `
    tbody.appendChild(tr);
  }
});

// const socket = io();

// const table = document.getElementById('productsTable')

// document.getElementById('createBtn').addEventListener('click', () => {
//   const body = {
//     title: document.getElementById('title').value,
//     description: document.getElementById('description').value,
//     category: document.getElementById('category').value,
//     price: document.getElementById('price').value,
//     code: document.getElementById('code').value,
//     stock: document.getElementById('stock').value,
//   }

//   fetch('/api/products', {
//     method: 'POST',
//     body: JSON.stringify(body),
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   })
//   .then(response => {
//     if (!response.ok) {
//       return response.text().then(text => {
//         throw new Error(text);
//       });
//     }
//     return response.json();
//   })
//   .then(result => {
//     console.log('Producto creado:', result);
//     return fetch('/api/products');
//   })
//   .then(response => {
//     if (!response.ok) {
//       return response.text().then(text => {
//         throw new Error(text);
//       });
//     }
//     return response.json();
//   })
//   .then(result => {
//     if (result.status === 'error') throw new Error(result.error);
//     socket.emit('productList', result);
    
//     ['title', 'description', 'code', 'price', 'stock', 'category'].forEach(id => {
//       document.getElementById(id).value = '';
//     });
//   })
//   .catch(err => {
//     console.error('Error:', err);
//     alert(`Ocurrió un error: ${err.message}`);
//   });
// });

// deleteProduct = (id) => {
//   fetch(`/api/products/${id}`, {
//     method: 'DELETE',
//   })
//   .then(response => {
//     if (!response.ok) {
//       return response.text().then(text => {
//         throw new Error(text);
//       });
//     }
//     return response.json();
//   })
//   .then(result => {
//     console.log('Producto eliminado:', result);
//     return fetch('/api/products');
//   })
//   .then(response => {
//     if (!response.ok) {
//       return response.text().then(text => {
//         throw new Error(text);
//       });
//     }
//     return response.json();
//   })
//   .then(result => {
//     if (result.status === 'error') throw new Error(result.error);
//     socket.emit('productList', result);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//     alert(`Ocurrió un error: ${err.message}`);
//   });
// }

// socket.on('updateProducts', data => {
//   table.innerHTML = 
//     `<tr>
//       <td></td>
//       <td><strong>Producto</strong></td>
//       <td><strong>Descripción</strong></td>
//       <td><strong>Precio</strong></td>
//       <td><strong>Código</strong></td>
//       <td><strong>Stock</strong></td>
//     </tr>`;
//     for(product of data) {
//       let tr = document.createElement('tr')
//       tr.innerHTML =
//       ` 
//         <td><button class="btn btn-danger" onclick="deleteProduct("${product.id}")">Eliminar</button></td>
//         <td>${product.title}</td>
//         <td>${product.description}</td>
//         <td>${product.price}</td>
//         <td>${product.code}</td>
//         <td>${product.stock}</td>
//       `
//       table.getElementsByTagName('tbody')[0].appendChild(tr);
//     }
// })