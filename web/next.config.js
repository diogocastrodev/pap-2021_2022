/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.imgur.com',
      'localhost'
    ],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'localhost:4000',
    CDN_URL: process.env.CDN_URL || 'localhost:5000',
  }
}
