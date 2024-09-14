import { connDB } from '../connDB.js';
import { ProductManager } from '../dao/productsManager.js'

const productManager = new ProductManager();

const testProduct = {
    title: 'Producto de Prueba',
    description: 'Descripción del producto de prueba',
    code: 'PRUEBA123',
    price: 100,
    stock: 50,
    category: 'Categoría de Prueba'
};

const test = async () => {
    await connDB(); // Conectar a la base de datos
    try {
        const product = await productManager.addProduct(testProduct);
        console.log('Producto agregado:', product);
    } catch (error) {
        console.error('Error al agregar producto:', error);
    }
};

test();