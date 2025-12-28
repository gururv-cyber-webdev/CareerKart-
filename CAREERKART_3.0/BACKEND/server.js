const app = require("./app");
const mongoose = require("mongoose");
const ensureAdmin = require("./ensureAdmin");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

// Make sure DB is connected before ensuring admin
mongoose.connection.once('open', async () => {
  await ensureAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});