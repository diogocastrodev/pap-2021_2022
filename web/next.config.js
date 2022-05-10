const Dotenv = require("dotenv-webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    /* WARNING: Not Use this in last build */
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com", "localhost"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(new Dotenv({ silent: true }));

    return config;
  },
};

/* (phase, { defaultConfig }) => {
  return removeImports({
    ...defaultConfig
  });
};
 */
