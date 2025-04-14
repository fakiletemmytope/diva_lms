import axios from "axios"
import config from "../config.js"


const SECRET_KEY = config.paystack.secret
const URL = config.paystack.url

const payment = async (email, amount, ticket_number) => {
    const params = JSON.stringify({
        "email": email,
        "amount": amount,
        "reference": ticket_number
    })
    const status = {}
    try {
        const response = await axios({
            method: 'post',
            url: `${URL}initialize`,
            data: params,
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        status.response = response
        return status
    }
    catch (error) {
        console.log(error)
        status.error = error
        return status
    }

}

//initialze transaction(donation)
export const generatePayment = async (email, amount, reference) => {
    return await payment(email, amount, reference)
}


//verify transaction(donation)
export const verifyPayment = async (reference) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${URL}verify/${reference}`,
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        return response
    }
    catch (error) {
        console.log(`${error}`)
        return "network error"
    }
}

