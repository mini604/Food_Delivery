const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const usersFile = "./users.json";

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    let users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

    if (users.find((user) => user.username === username)) {
        return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    fs.writeFileSync(usersFile, JSON.stringify(users));

    res.json({ msg: "User registered successfully" });
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

    const user = users.find((user) => user.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
    res.json({ token, msg: "Login successful" });
};

const verifyToken = (req, res) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "Access Denied" });

    try {
        const verified = jwt.verify(token, "secretKey");
        res.json({ username: verified.username });
    } catch (error) {
        res.status(400).json({ msg: "Invalid Token" });
    }
};

module.exports = { registerUser, loginUser, verifyToken };
