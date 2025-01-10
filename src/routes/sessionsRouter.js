import { Router } from "express"
import { generaHash, isValidPassword, procesaErrores } from "../utils.js"
import { UserManager } from "../dao/userManager.js"
import { cartsModel } from "../models/cartModel.js"
import { UserModel } from "../models/userModel.js"
import passport from "passport"
import jwt from "jsonwebtoken"
import { config } from "../config//config.js"

export const router = Router()

router.get(
    "/error",
    (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ payload: `Error al autenticar` })
    })

router.get(
    "/current",
    passport.authenticate("current", { session: false }),
    (req, res) => {
        res.status(200).json({
            mensaje: "Usuario logueado", datosUsuario: req.user
        })
        console.log(req.user)
    })

router.post(
    "/register",
    passport.authenticate("registro", { session: false }),
    async (req, res) => {
        let { first_name, last_name, email, password, age, web } = req.body
        if (!first_name || !last_name || !password || !email || !age) {
            if (web) {
                return res.redirect("/register?mensaje=Todos los campos son requeridos")
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Todos los campos son requeridos` })
        }

        let regExEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
        if (!regExEmail.test(email)) {
            if (web) {
                return res.redirect("/register?mensaje=El Email no es valido")
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Formato inválido del email` })
        }

        let regExNombre = /[0-9]/
        if (regExNombre.test(first_name) || regExNombre.test(last_name)) {
            if (web) {
                return res.redirect("/register?mensaje=El nombre o apellido no puede contener numeros")
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No se admiten nombres con números` })
        }

        try {
            let existe = await UserManager.getBy({ email })
            if (existe) {
                if (web) {
                    return res.redirect(`/register?mensaje=email ${email} ya esta registrado en DB`)
                }
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `email ${email} ya esta registrado en DB` })
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
                cart: newCart._id
            });
            await nuevoUsuario.save()

            let token = jwt.sign({
                id: nuevoUsuario._id,
                email: nuevoUsuario.email,
                first_name: nuevoUsuario.first_name,
                last_name: nuevoUsuario.last_name,
                cart: nuevoUsuario.cart
            },
                config.SECRET,
                { expiresIn: "1h" })

            res.cookie("cookietoken", token, { maxAge: 1000 * 60 * 60, httpOnly: true })

            if (web) {
                return res.redirect(`/login?mensaje=Has iniciado sesion con el e-mail ${email}`)
            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: `registro exitoso`, nuevoUsuario })
        } catch (error) {
            procesaErrores(res, error)
        }
    })

router.post(
    "/login",
    passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }),

    async (req, res) => {
        let { email, password, web } = req.body
        if (!email || !password) {
            if (web) {
                return res.redirect("/login?mensaje=Email y password son requeridos")
            }
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `Email y password son requeridos` })
        }
        try {
            let usuarioLogueado = await UserManager.getBy({ email })
            if (!usuarioLogueado) {
                if (web) {
                    return res.redirect("/login?mensaje=Credenciales Invalidas")
                }
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({ error: `Credenciales invalidas` })
            }
            if (!isValidPassword(password, usuarioLogueado.password)) {
                if (web) {
                    return res.redirect("/login?mensaje=Credenciales Invalidas")
                }
                res.setHeader('Content-Type', 'application/json');
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

router.get("/logout", (req, res) => {
    res.clearCookie("cookietoken")
    if (req.query.web) {
        return res.redirect("/login?mensaje=Logout exitoso")
    }
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ payload: `Logout exitoso` })
})
