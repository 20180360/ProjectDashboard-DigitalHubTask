// server.js
import jsonServer from "json-server";
import jwt from "jsonwebtoken";
import cors from "cors";
import fs from "fs";

const server = jsonServer.create();
const router = jsonServer.router("db.json"); // لازم يكون path صحيح
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);

const SECRET_KEY = "your_secret_key";
const expiresIn = "24h";

// 1) CREATE JWT TOKEN
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// 2) VERIFY TOKEN
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

// 3) LOGIN ENDPOINT
server.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8")); // ✅ path صحيح
    const user = db.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// 4) PROTECTED ROUTES (JWT required)
server.use(/^(?!\/login).*$/, (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

server.use(middlewares);
server.use(router);

server.listen(5000, () => {
  console.log("🚀 JSON Server with JWT running on http://localhost:5000");
});
