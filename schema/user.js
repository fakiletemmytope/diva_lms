import mongoose from "mongoose"

const { Schema, model } = mongoose



export const UserType = {
    ADMIN: 'admin',
    STUDENT: 'student',
    INSTRUCTOR: 'instructor',
};

export const Status = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
}


const UserSchema = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        userType: {
            type: String,
            enum: Object.values(UserType), // Restrict userType to the values of UserType
            required: true, // Optional: make it required if necessary
            default: UserType.STUDENT
        },
        status: {
            type: String,
            enum: Object.values(Status),
            required: true,
            default: Status.INACTIVE
        }
        //resetPasswordToken: { type: String, default: null }, // For password reset functionality
        //resetPasswordExpires: { type: Date, default: null }, // Token expiration
        //lastLogin: { type: Date, default: null } // Track login activity
    },
    { timestamps: true }
)

UserSchema.index({ 'email': 1 }, { unique: 1 })

export const UserModel = model('User', UserSchema)

