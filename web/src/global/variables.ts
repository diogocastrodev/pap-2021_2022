export const config = {
  API: {
    URL: process.env.API_URL || "localhost:4000",
    protocol: process.env.API_PROTOCOL || "http",
  },
  CDN: {
    URL: process.env.CDN_URL || "localhost:5000",
    protocol: process.env.CDN_PROTOCOL || "http",
  },
};

export const graphQL_Endpoint = `${config.API.protocol}://${config.API.URL}/graphql`;
