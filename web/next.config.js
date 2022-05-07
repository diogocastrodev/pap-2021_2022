const removeImports = require("next-remove-imports");
const withCSS = require("@zeit/next-css");

/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    /* WARNING: Not Use this in last build */
    ignoreBuildErrors: true,
  },
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


/* (phase, { defaultConfig }) => {
  return removeImports({
    ...defaultConfig
  });
};
 */
