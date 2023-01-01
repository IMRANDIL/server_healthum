require("dotenv").config();
require("./config/dbConfig");
const cors = require("cors");
const { app, express } = require("./config/dbConfig");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", require("./routes/authRoute"));
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/doctor", require("./routes/doctorRoute"));
app.use("/api/doctor/appointment", require("./routes/appointmentRoute"));

app.get("/", (req, res) => {
  res.send("Server is running");
});

// if (process.env.NODE_ENV === "production") {
//   app.use("/", express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.send(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
