export const config = {
  port: process.env.PORT || 3000,
  API: {
    URL: process.env.API_URL || "localhost:4000",
    secure: process.env.API_Secure || false,
  },
  CDN: {
    URL: process.env.CDN_URL || "localhost:5000",
    secure: process.env.CDN_Secure || false,
  },
};

const httpProtocolSecure = config.API.secure ? "https" : "http";
const wsProtocolSecure = config.API.secure ? "wss" : "ws";

export const graphQL_Endpoint = `${httpProtocolSecure}://${config.API.URL}/graphql`;
export const graphQL_Endpoint_Ws = `${wsProtocolSecure}://${config.API.URL}/graphql`;
