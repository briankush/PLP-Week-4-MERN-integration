const express = require("express");

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes



app.post("/api/users", (req, res) => {
    const user = await user.create (req.body)
    res.json(user); // Respond with created user
});