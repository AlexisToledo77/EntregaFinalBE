import passport from "passport"
import local from "passport-local"
import { UserManager } from "../dao/userManager.js"
import { generaHash, isValidPassword } from "../utils.js"
import passportJWT from "passport-jwt"
import { config } from "./config.js"

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
                usernameField: "email",
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                try {
                    let { first_name, last_name, age } = req.body
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: "Todos los campos son requeridos" })
                    }

                    let existe = await UserManager.getBy({ email: username })
                    if (existe) {
                        return done(null, false, { message: "El usuario ya existe" })
                    }

                    password = generaHash(password)

                    return done(null, {
                        first_name,
                        last_name,
                        age,
                        email: username,
                        password,
                    })
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    let usuario = await UserManager.getBy({ email: username })
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