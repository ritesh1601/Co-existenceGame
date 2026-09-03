const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const gameSessionRoutes = require("./routes/gameSessionRoutes");
const pool = require("./db/database");
const gameEntityRoutes = require("./routes/gameEntityRoute");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/game-sessions", gameSessionRoutes);
app.use("/api/game-sessions", gameEntityRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Wolf-Sheep-Grass backend is running!"
    });
});

pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.error("Database connection failed:", error);
    } else {
        console.log("Database connected:", result.rows[0]);
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
