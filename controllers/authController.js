import { UserModel } from "../schema/user.js";
import { verify_password } from "../utils/passwd.js";
import { getToken, tokenBlacklist, verifyToken } from "../auth/jwt.js";
import { dbClose, dbConnect } from "../database/dbConnect.js";
import { sendmail } from "../utils/sendmail.js"
import config from "../config.js";

const URL = config.base_url
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        await dbConnect()
        const user = await UserModel.findOne({ email: email }).exec()
        if (!user || await verify_password(user.password, password) == false) {
            res.status(404).send("User not found or Incorrect login details")
        }
        else if (user.status === "inactive" || user.status === "suspended") {
            res.status(404).send(`User is ${user.status} and cannot be logged in. Contact the admin if suspended or request for activation token`)
        }
        else {
            const { _id, first_name, last_name, email, userType } = user
            const token = await getToken({ first_name, last_name, _id, userType })
            res.status(200).json({ _id, first_name, last_name, email, token, userType })
        }

    } catch (err) {
        res.status(400).send(err.message)
    } finally {
        dbClose();
    }
}


export const logout = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    tokenBlacklist.add(token); // Add token to blacklist
    res.status(200).json({ message: "Logged out successfully!" });
};


export const activate_user = async (req, res) => {
    const token = req.query.token
    if (token) {
        try {
            const decode = verifyToken(token)
            const { email, id } = decode
            await dbConnect()
            const update_user = await UserModel.findOneAndUpdate(
                { _id: id, email: email }, { status: "active" }, { new: true }
            )
            const { _id, first_name, last_name, status, userType, createdAt, updatedAt } = update_user
            update_user ? res.status(200).json({ _id, first_name, last_name, status, userType, createdAt, updatedAt, email: update_user.email }) : res.status(403).send("User not activated")
        } catch (err) {
            res.status(403).send(err.message)
        }
        finally {
            dbClose()
        }
    } else {
        res.status(403).send("token required, generate a token")
    }
}

export const get_activation_token = async (req, res) => {
    const { email } = req.body
    if (email) {
        try {
            await dbConnect()
            const user = await UserModel.findOne({ email: email, status: "inactive" })
            if (user) {
                if (user.status === "inactive") {
                    const { _id, email, first_name } = user
                    const payload = { id: _id, email: email }
                    const token = getToken(payload, "20m")
                    const msg = `Dear ${first_name},\n Your request for account activation token, click on the link below to activate you account\n${URL}/auth/activate?token=${token}\n With love from\nMINI LEARNING`
                    console.log(msg)
                    //send email
                    sendmail(email, "Token for activation", msg)
                    res.status(200).send(`activation link as being sent to your email`)
                }
                else {
                    res.status(200).send(`User is ${user.status}`)
                }
            }
            else {
                res.status(404).send("User not found or the user is already activated or suspended")
            }
        } catch (error) {
            res.status(403).send(error.message)
        } finally {
            dbClose()
        }
    }
}