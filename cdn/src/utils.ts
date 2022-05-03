import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 4000,
    backend: process.env.BACKEND_URL || "http://localhost:4000",
    API_CDN_Private_Key: process.env.API_CDN_Private_Key || "api-cdn",
}

export const supportedTypes = [
    "png",
    "jpeg",
    "jpg",
]

export const maxSizePerImage = 5 * 1024 * 1024; // 5MB