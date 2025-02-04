import Handlebars from 'handlebars'

export const registerHelpers = (hbs) => {
  hbs.registerHelper('multiply', function (a, b) {
    return a * b
  })

  hbs.registerHelper('formatCurrency', function (amount) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
  })

  hbs.registerHelper('calculateTotal', function (products) {
    return products.reduce((total, item) => total + (item.quantity * item.product.price), 0)
  })
  Handlebars.registerHelper('calculateTotal', function (products) {
    let total = 0
    products.forEach(product => {
      if (product && product.product && product.product.price) {
        total += product.product.price * product.quantity
      }
    })
    return total
  })

  Handlebars.registerHelper('multiply', function (a, b) {
    return a * b
  })
}

