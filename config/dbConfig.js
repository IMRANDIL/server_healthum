const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log(`DB connected`);
    app.listen(PORT, () => {
      console.log(`Server runs on port: ${PORT}`);
    });
  })
  .catch(() => {
    console.log(`DB connection failed`);
  });

module.exports = {
  app,
  express,
};
