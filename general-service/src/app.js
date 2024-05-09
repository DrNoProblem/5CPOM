const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const config = require("./config");

const drawRoutes = require("./draws/draw.routes");
const roomRoutes = require("./rooms/room.routes");
const taskRoutes = require("./tasks/task.routes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

mongoose
  .connect(config.mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

  
// Routes
app.use("/room", roomRoutes);
app.use("/task", taskRoutes);
app.use("/draw", drawRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
