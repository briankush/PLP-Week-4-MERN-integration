const jwt = require("jsonwebtoken");
const express = require("express");
const bycript = require("bcrypt");

const app = express();

app.post("/api/Users/signup", async (req, res) => {
    const {email, password } = req.body;
    const hash = await bycript.hash(password, 10);
    const user = await User.create({ email, password: hash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
})

// Login and password validation
app.post("/api/Users/Login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");

    const ismatch = await bycript.compare(req.body.password, user.password);
    if (!ismatch) return res.status(401).send("Invalid password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
})



// protect routes with JWT middleware
// How
const auth= (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];// bearer <token>
    if (!token) return res.status(401).send("token required");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).send("Invalid token");
    }
}

app.get("/api/Users/Profile", auth, async (req, res) => {
   res.send(`welcome ${req.user.id}`);
});