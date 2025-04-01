import { v2 as cloudinary } from 'cloudinary' 
import config from '../config.js';

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.secret,
});

// const image = './path/to/image.jpg'; // This can also be a remote URL or a base64 DataURI

export const upload_image = async (image) =>{    
    return await cloudinary.uploader.upload(image);
}