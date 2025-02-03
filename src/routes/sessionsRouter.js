import { Router } from "express"
import passport from "passport"
import { SessionsController } from "../controller/sessionsController.js"

export const router = Router()

router.get("/error", SessionsController.error)

router.get(
    "/current",
    passport.authenticate("current", { session: false }),
    SessionsController.authenticate
)
router.post(
    "/register",
    SessionsController.register
)
// router.post(
//     "/register",
//     passport.authenticate("registro", { session: false }),
//     SessionsController.register
// )

router.post("/login",
    SessionsController.login)


router.get("/logout", SessionsController.logout)
