import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export const auth = (req, res, next) => {
    if (!req.cookies || !req.cookies.cookietoken) {
        res.setHeader("Content-Type", "application/json")
        return res.status(401).json({ error: `No hay usuarios autenticados` })
    }
    let token = req.cookies.cookietoken

    try {
        let usuario = jwt.verify(token, config.SECRET)
        req.user = usuario
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `${error.message}` })
    }

    next()
}

export const authAdmin = (req, res, next) => {
    if (!req.cookies || !req.cookies.cookietoken) {
        return res.status(403).send('Token no proporcionado.')
    }
    let token = req.cookies.cookietoken;

    jwt.verify(token, config.SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send('Error al autenticar el token.')
        }

        if (decoded.role !== 'admin') {
            return res.status(403).send('No tienes los permisos necesarios.')
        }

        req.user = decoded
        next()
    })
}

export const authUser = (req, res, next) => {
    if (!req.cookies || !req.cookies.cookietoken) {
        console.log('Token no proporcionado.')
        return res.status(403).send('Token no proporcionado.')
        
    }
    let token = req.cookies.cookietoken;

    jwt.verify(token, config.SECRET, (err, decoded) => {
        if (err) {
            console.log('Error al autenticar el token:', err.message)
            return res.status(500).send('Error al autenticar el token.')
        }

        console.log('Token decodificado:', decoded);

        if (decoded.role !== 'user') {
            console.log('No tienes los permisos necesarios.')
            return res.status(403).send('1No tienes los permisos necesarios.')
        }

        console.log('Autenticación exitosa:', decoded)
        req.user = decoded
        next()
    })
}
