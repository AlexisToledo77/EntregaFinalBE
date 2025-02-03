import bcrypt from "bcrypt"

export const procesaErrores = (error, res) => {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`
    })
}

// export const procesaErrores = (error, res) => {
//     console.log(error);
//     console.log('Objeto res:', res);

//     if (typeof res.setHeader === 'function') {
//         res.setHeader('Content-Type', 'application/json');
//     } else {
//         console.error('res.setHeader no es una función');
//     }

//     return res.status(500).json({
//         error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
//         detalle: `${error.message}`
    
//     })
// }

export const validEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/

export const validName = /[0-9]/

export const generaHash = pass => bcrypt.hashSync(pass, 10)
export const isValidPassword = (pass, hash) => bcrypt.compareSync(pass, hash)

