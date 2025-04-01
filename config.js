import { configDotenv } from "dotenv";

configDotenv()
//console.log(process.env)

const isDev = process.env.NODE_ENV === 'dev';
const isTest = process.env.NODE_ENV === 'test';

const URI = isTest
    ? process.env.TESTDBURL
    : isDev
        ? process.env.DEVDBURL
        : process.env.DATABASEURL;

//console.log(URI)

const BASEURL = isTest
    ? process.env.BASE_URL
    : isDev
        ? process.env.BASE_URL
        : process.env.PROD_URL;

const config = {
    secret_key: process.env.SECRETKEY,
    base_url: BASEURL,
    db: {
        uri: URI
    },
    port: process.env.PORT || 3000,
    cloudinary: {
        secret: process.env.CLOUDINARY_SECRET,
        api_key: process.env.CLOUDINARY_API_KEY,
        name: process.env.CLOUDINARY_NAME
    },
    paystack: {
        url: process.env.PAYSTACK_URL,
        secret: process.env.PAYSTACK_SECRET_KEY
    },
    gmail: {
        username: process.env.GMAIL_USERNAME,
        password: process.env.GMAIL_APP_PASSWORD
    }
}


export default config