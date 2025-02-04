import passport from "passport"
import local from "passport-local"
import { UserDAO } from "../dao/userDAO.js"
import { generaHash, isValidPassword, procesaErrores, validEmail, validName } from "../utils.js"
import passportJWT from "passport-jwt"
import { config } from "./config.js"
import { cartsModel } from "../models/cartModel.js"
import { UserModel } from "../models/userModel.js"

const buscaToken = (req) => {
    return req?.cookies?.cookietoken || null
}

export const inciarPassport = () => {

    passport.use(
        "current",
        new passportJWT.Strategy(
            {
                secretOrKey: config.SECRET,
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscaToken])

            },
            async (usuario, done) => {
                try {

                    return done(null, usuario)

                } catch (error) {
                    return done(error)
                }

            }
        )
    )
    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField: 'email',
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    let { first_name, last_name, age } = req.body

                    if (!first_name || !last_name || !password || !email || !age) {
                        return done(null, false, { message: 'Todos los campos son requeridos' })
                    }

                    let regExEmail = validEmail
                    if (!regExEmail.test(email)) {
                        return done(null, false, { message: 'Formato inválido del email' })
                    }

                    let regExNombre = validName
                    if (regExNombre.test(first_name) || regExNombre.test(last_name)) {
                        return done(null, false, { message: 'No se admiten nombres con números' })
                    }

                    let existe = await UserDAO.getBy({ email })
                    if (existe) {
                        return done(null, false, { message: `El usuario con email ${email} ya existe` })
                    }

                    password = generaHash(password)

                    // nuevo carrito 
                    const newCart = new cartsModel({ products: [] })
                    await newCart.save()

                    const nuevoUsuario = new UserModel({
                        first_name,
                        last_name,
                        email,
                        password,
                        age,
                        cart: newCart._id,
                    })

                    await nuevoUsuario.save()

                    return done(null, nuevoUsuario)
                } catch (error) {
                    return done(error)
                }
            }
        ))


    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    let usuario = await UserDAO.getBy({ email: username })
                    if (!usuario) {
                        return done(null, false)
                    }

                    if (!isValidPassword(password, usuario.password)) {
                        return done(null, false)
                    }

                    return done(null, usuario)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}