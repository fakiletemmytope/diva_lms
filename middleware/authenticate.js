import { verifyToken, isTokenBlacklisted } from "../auth/jwt.js"
import { hash_password } from "../utils/passwd.js"


export const authenticate = async (req, res, next) => {
    const auth = req.headers.authorization
    if (!auth) {
        return res.status(401).send("Unauthenticated user, bearer token required")
    }
    else {
        try {
            const token = auth.split(" ")[1]
            const is_token_blacklisted = await isTokenBlacklisted(token)
            if (is_token_blacklisted) return res.status(400).send("Token not valid")
            const decode = await verifyToken(token)
            if (decode._id) {
                req.decode = decode
                next()
            }
            else {
                return res.status(401).send("Unauthenticated User")
            }
        } catch (err) {
            return res.status(400).send(err.message)
        }
    }
}

export const unrestricted = async (req, res, next) => {
    const auth = req.headers.authorization
    if (!auth) {
        next()
    }
    else {
        try {
            const token = auth.split(" ")[1]
            const is_token_blacklisted = await isTokenBlacklisted(token)
            if (is_token_blacklisted) return res.status(400).send("Token not valid")
            const decode = await verifyToken(token)
            if (decode) {
                req.decode = decode
                next()
            }
            else {
                next()
            }
        } catch (err) {
            return res.status(400).send(err.message)
        }
    }
}

export const isAdmin = async (req, res, next) => {
    if (req.decode.userType == "admin") {
        next()
    }
    else {
        return res.status(403).send("Unauthorized User")
    }
}


export const isInstructor = async (req, res, next) => {

    if (req.decode.userType == "instructor") {
        next()
    }
    else {
        return res.status(403).send("Unauthorized User")
    }
}

export const isStudent = async (req, res, next) => {

    if (req.decode.userType == "student") {
        next()
    }
    else {
        return res.status(403).send("Unauthorized User")
    }
}



export const isAdminOrInstructor = async (req, res, next) => {
    // console.log(req.decode)
    if (req.decode.userType == "instructor" || req.decode.userType == "admin") {
        next()
    }
    else {
        return res.status(403).send("Unauthorized User")
    }
}

export const hashPassword = async (req, res, next) => {
    const { password } = req.body
    try {
        if (password) {
            req.hash_password = hash_password(password)
            next()
        }
        else {
            res.status(403).send("Password required")
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const user_update_permission = async (req, res, next) => {
    req.decode.userType === "admin" || req.decode._id === req.params.id ? next() : res.status(403).send("Unauthorised user")
}
