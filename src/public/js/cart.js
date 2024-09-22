const cartPrice = document.getElementById("cart-price");
const cleanCart = document.getElementById("clean-cart");
const backToHome = document.getElementById("back-home");
const removeItem = document.getElementById("remove-item");  
const cartContainer = document.getElementById("cart-container"); 

const cart = {
    _id: '66e8ffe277186cd85d69378d',
    products: []
  };

document.addEventListener('DOMContentLoaded', function() {
    const cartList = document.getElementById('cartList');

    // Función para actualizar la cantidad
    window.updateQuantity = function(cartId, productId, currentQuantity, action) {
        const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
        if (newQuantity < 1) return;
    
        console.log(`Actualizando producto: ${productId} en carrito: ${cartId}`);
    
        fetch(`/api/cart/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                const productElement = document.querySelector(`[data-product-id="${productId}"]`);
                productElement.querySelector('.quantity').textContent = newQuantity;
                updateSubtotalAndTotal();
            } else {
                console.error('Error al actualizar la cantidad:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al actualizar la cantidad. Por favor, intenta de nuevo.');
        });
    }

    // Función para eliminar producto del carrito
    window.removeProductFromCart = function(cartId, productId) {
        fetch(`/api/cart/${cartId}/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            const productElement = document.querySelector(`[data-product-id="${productId}"]`);
            productElement.remove();
            updateSubtotalAndTotal();
        })
        .catch(error => console.error(error));
    }

    // Función para vaciar el carrito
    window.clearCart = function(cartId) {
        fetch(`/api/cart/${cartId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            cartList.innerHTML = '<p>El carrito está vacío</p>';
            document.getElementById('cartTotal').textContent = '0';
        })
        .catch(error => console.error(error));
    }

    // Función para actualizar subtotales y total
    function updateSubtotalAndTotal() {
        let total = 0;
        document.querySelectorAll('#cartList li').forEach(item => {
            const price = parseFloat(item.querySelector('p').textContent.split('$')[1]);
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            const subtotal = price * quantity;
            item.querySelector('.subtotal').textContent = subtotal.toFixed(2);
            total += subtotal;
        });
        document.getElementById('cartTotal').textContent = total.toFixed(2);
    }
});
