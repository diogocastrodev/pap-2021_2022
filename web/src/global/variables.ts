export const config = {
  port: process.env.PORT || 3000,
  API: {
    URL: process.env.API_URL || "localhost:4000",
    protocol: process.env.API_PROTOCOL || false,
  },
  CDN: {
    URL: process.env.CDN_URL || "localhost:5000",
    protocol: process.env.CDN_PROTOCOL || false,
  },
};

const httpProtocolSecure = config.API.protocol ? "https" : "http";
const wsProtocolSecure = config.API.protocol ? "wss" : "ws";

export const graphQL_Endpoint = `${httpProtocolSecure}://${config.API.URL}/graphql`;
export const graphQL_Endpoint_Ws = `${wsProtocolSecure}://${config.API.URL}/graphql`;
