import { dbConnect, dbClose } from "../database/dbConnect.js"
import { InstructorModel } from "../schema/instructor.js"
import { UserModel } from "../schema/user.js"


const get_instructor = async (req, res) => {
    try {
        await dbConnect()
        const instructor = await InstructorModel.findById(req.params.id)
        if (!instructor) return res.status(404).send("instructor not found")
        if (req.decode.userType === "admin" || instructor.userId.toString() === req.decode._id ) res.status(200).json(instructor)
        else res.status(403).send("Unauthoried User")

    } catch (error) {
        res.status(500).send(error.message)
    }
    finally {
        await dbClose()
    }
}

const get_instructors = async (req, res) => {
    try {
        await dbConnect()
        const instructors = await InstructorModel.find({})
        res.status(200).json(instructors)
    } catch (error) {
        res.status(500).send(error.message)
    }
    finally {
        await dbClose()
    }
}

const delete_instructor = async (req, res) => {
    {
        try {
            await dbConnect()
            const instructor = await InstructorModel.findById(req.params.id)
            if (!instructor) return res.status(404).send("instructor not found")
            if (req.decode.userType === "admin" || instructor.userId.toString() === req.decode._id) {
                await InstructorModel.findByIdAndDelete(req.params.id)
                res.status(204).json()
            }               
            else res.status(403).json("Unauthorised User")
        } catch (error) {
            res.status(500).send(error.message)
        }
        finally {
            await dbClose()
        }
    }
}

const update_instructor = async (req, res) => {
    const { bio } = req.body
    const update = {}
    if (bio) update.bio = bio
    try {
        await dbConnect()
        const instructor = await InstructorModel.findById(req.params.id)
        if (!instructor) return res.status(404).send("instructor not found")
        if (instructor.userId.toString() === req.decode._id) {
            const instructor = await InstructorModel.findByIdAndUpdate(req.params.id, update, { new: true })
            res.status(200).json(instructor)
        }
        else res.status(403).send("Unauthorised user")

    } catch (error) {
        res.status(500).send(error.message)
    }
    finally {
        await dbClose()
    }
}


export {
    get_instructor,
    get_instructors,
    delete_instructor,
    update_instructor
}
