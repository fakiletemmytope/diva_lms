import { dbClose, dbConnect } from "../database/dbConnect.js";
import { InstructorModel } from "../schema/instructor.js";
import { getToken, verifyToken } from "../auth/jwt.js";
import { sendmail } from "../utils/sendmail.js";
import { UserModel } from "../schema/user.js";
import config from "../config.js";

const URL = config.base_url

export const get_users = async (req, res) => {
    try {
        await dbConnect()
        const users = await UserModel.find({}, "_id first_name last_name email userType");
        res.status(200).json(users)
    } catch (err) {
        res.status(400).send(err.message)
    } finally {
        dbClose()
    }

}

export const get_a_user = async (req, res) => {
    try {
        if (req.decode.userType === "admin" || req.decode._id === req.params.id) {
            await dbConnect()
            const user = await UserModel.findById(req.params.id, "last_name first_name id email userType date_created date_updated");
            res.status(200).json(user)
        }
        else {
            res.status(403).send("Unauthorised user")
        }

    }
    catch (err) {
        res.status(400).json(err.message)
    } finally {
        dbClose()
    }
}


export const create_user = async (req, res) => {
    const { first_name, last_name, email, userType, bio } = req.body
    const hashedpw = await req.hash_password
    const user = new UserModel(
        {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedpw,
            userType: userType
        }
    )
    try {
        if (userType == "instructor") {
            await dbConnect()
            console.log("in")
            const savedUser = await user.save()
            const instructor = new InstructorModel(
                {
                    name: `${savedUser.last_name} ${savedUser.first_name}`,
                    bio: bio,
                    userId: savedUser._id
                }
            )
            const Instructor_info = await instructor.save()
            const { first_name, last_name, _id, email, createdAt, updatedAt } = savedUser
            const payload = { id: _id, email: email }
            const token = getToken(payload, "20m")
            const msg = `Dear ${first_name},\n\n\nYour account has being created successfully. Click on the link below to activate you account\n\n${URL}/auth/activate?token=${token}\n\nWith love from,\nMINI LEARNING`
            //send email
            await sendmail(email, "Token for activation", msg)
            res.status(200).json({
                first_name, last_name, _id, email, createdAt, updatedAt, Instructor_info,
                message: "activation link as been sent to your email"
            })
        }
        else {
            await dbConnect()
            const savedUser = await user.save()
            // console.log(savedUser)
            const { first_name, last_name, _id, email, createdAt, updatedAt } = savedUser
            const payload = { id: _id, email: email }
            const token = getToken(payload, "20m")
            const msg = `Dear ${first_name},\n\n\nYour account has being created successfully. Click on the link below to activate you account\n\n${URL}/auth/activate?token=${token}\n\nWith love from,\nMINI LEARNING`
            await sendmail(email, "Token for activation", msg)
            res.status(200).json({
                first_name, last_name, _id, email, createdAt, updatedAt,
                message: "activation link has been sent to your email"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    } finally {
        dbClose()
    }
}

export const update_user = async (req, res) => {
    const { last_name, first_name } = req.body
    const update = {};
    if (last_name) update.last_name = last_name;
    if (first_name) update.first_name = first_name;
    try {
        await dbConnect()
        const user = await UserModel.findByIdAndUpdate(req.params.id, update, { new: true })
        if (!user) {
            return res.status(404).send("User not found");
        }
        const { _id, last_name, first_name, email } = user
        const updated_user = { _id, last_name, first_name, email };
        res.status(200).json(updated_user)
    } catch (err) {
        res.status(400).send(err.message)
    } finally {
        dbClose()
    }
}


export const delete_user = async (req, res) => {
    try {
        await dbConnect()
        const deleted_user = await UserModel.findByIdAndDelete(req.params.id)
        deleted_user ? res.status(200).send("User deleted") : res.status(403).send("User not found")

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}
