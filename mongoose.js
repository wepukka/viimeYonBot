const mongoose = require("mongoose");

module.exports = {
  name: "mongoose",
  description: "Connects to DB",
  connect() {
    mongoose
      .connect(process.env.DB_SRV, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to Database");
      })
      .catch((err) => {
        console.log("Database connection failed");
      });
  },
};
