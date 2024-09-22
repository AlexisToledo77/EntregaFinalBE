export const registerHelpers = (hbs) => {
    hbs.registerHelper('multiply', function(a, b) {
        return a * b
    });

    hbs.registerHelper('formatCurrency', function(amount) {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
    });

    hbs.registerHelper('calculateTotal', function(products) {
        return products.reduce((total, item) => total + (item.quantity * item.product.price), 0)
    })
}
