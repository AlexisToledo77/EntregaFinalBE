import { generaHash, isValidPassword, procesaErrores, validEmail, validName } from "../utils.js"
import { UserDAO } from "../dao/userDAO.js"
import { cartsModel } from "../models/cartModel.js"
import { UserModel } from "../models/userModel.js"
import passport from "passport"
import jwt from "jsonwebtoken"
import { config } from "../config//config.js"

export class SessionsController {

    static async error(req, res) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ payload: `Error al autenticar` })
    }

    static authenticate(req, res) {
        res.status(200).json({
            mensaje: "Usuario logueado", datosUsuario: req.user
        })
        console.log(req.user)
    }

    static async register(req, res, next) {
        passport.authenticate('registro', (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(400).json({ error: info.message })
            }

            req.login(user, { session: false }, (err) => {
                if (err) {
                    return next(err)
                }

                let token = jwt.sign({
                    id: user._id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    cart: user.cart,
                    role: user.role,
                }, config.SECRET, { expiresIn: '1h' })

                res.cookie('cookietoken', token, { maxAge: 1000 * 60 * 60, httpOnly: true })

                if (req.body.web) {
                    return res.redirect(`/login?mensaje=Has iniciado sesión con el e-mail ${user.email}`)
                }

                res.setHeader('Content-Type', 'application/json')
                return res.status(200).json({ payload: 'Registro exitoso', nuevoUsuario: user })
            })
        })(req, res, next)
    }

    static login(req, res, next) {

        passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }, async (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({
                    error: info ? info.message : 'Credenciales invalidas'
                })
            }

            req.logIn(user, { session: false }, async (err) => {
                if (err) {
                    return res.status(401).json({ error: 'Autenticación fallida' })
                }

                let { email, password, web } = req.body
                if (!email || !password) {
                    if (web) {
                        return res.redirect("/login?mensaje=Email y password son requeridos")
                    }
                    res.setHeader('Content-Type', 'application/json')
                    return res.status(400).json({ error: `Email y password son requeridos` })
                }
                try {
                    let usuarioLogueado = await UserDAO.getBy({ email })

                    if (!usuarioLogueado) {
                        if (web) {
                            return res.redirect("/login?mensaje=Credenciales Invalidas")
                        }
                        res.setHeader('Content-Type', 'application/json')
                        return res.status(401).json({ error: `Credenciales invalidas` })
                    }
                    if (!isValidPassword(password, usuarioLogueado.password)) {
                        if (web) {
                            return res.redirect("/login?mensaje=Credenciales Invalidas")
                        }
                        res.setHeader('Content-Type', 'application/json')
                        return res.status(401).json({ error: `Credenciales invalidas` })
                    }



                    delete usuarioLogueado.password

                    let token = jwt.sign(usuarioLogueado, config.SECRET, { expiresIn: "1h" })
                    res.cookie("cookietoken", token, { maxAge: 1000 * 60 * 60, httpOnly: true })

                    if (web) {
                        return res.redirect("/perfil")
                    }
                    res.setHeader('Content-Type', 'application/json')
                    return res.status(200).json({ payload: `Login exitoso`, usuarioLogueado })
                } catch (error) {
                    procesaErrores(res, error)
                }
            })
        })(req, res, next)
    }

    static async logout(req, res) {
        res.clearCookie("cookietoken")
        if (req.query.web) {
            return res.redirect("/login?mensaje=Logout exitoso")
        }
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ payload: `Logout exitoso` })
    }

}



