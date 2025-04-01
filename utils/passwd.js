import argon2 from 'argon2';
export const verify_password = async (hashedPassword, password) => {
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (error) {
        console.error("Error verify password:", error.message);
        throw error;
    }

}

export const hash_password = async (password) => {
    try{
        return await argon2.hash(password)
    }catch (error) {
        console.error("Error hashing password:", error.message);
        res.status(400).send(error.message)
    }
}