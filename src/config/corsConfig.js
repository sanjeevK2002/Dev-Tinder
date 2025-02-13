// config/corsConfig.js
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",  // Frontend URL
  credentials: true,                // Allow cookies to be sent
};

module.exports = cors(corsOptions);
