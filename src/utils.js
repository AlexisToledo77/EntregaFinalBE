import bcrypt from "bcrypt"

export const procesaErrores = (res, error) => {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
        {
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
        }
    )
}

export const generaHash = pass => bcrypt.hashSync(pass, 10)
export const isValidPassword = (pass, hash) => bcrypt.compareSync(pass, hash)

