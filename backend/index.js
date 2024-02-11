const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const utils = require("./utils");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();

const jwtSecret = process.env.JWT_SECRET_KEY;
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const MONGO_DB_URI = `mongodb+srv://ajay:${password}@recipe.5ra2lcb.mongodb.net/?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 8080;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const recipe_app = client.db("recipe_app");
const useraccounts = recipe_app.collection("user_accounts");

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.get("/hello", (req, res) => {
  res.send("i say hello");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // checking if user exists
  const response = await useraccounts.findOne({ email });
  if (response) {
    // we found the user, now we check  the password
    const storedPassword = response.password;
    const verify = utils.verifyPassword(
      password,
      storedPassword.salt,
      storedPassword.hashedPassword
    );
    if (verify) {
      // user was authenticated succesfully
      const token = jwt.sign({ email }, jwtSecret);
      res.status(200).json({
        token,
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message:
          "username or password is incorrect, please verify and try again",
      });
      return;
    }
  } else {
    // user doesn't exist, send error to frontend
    res.status(404).json({
      success: false,
      message: "username or password is incorrect, please verify and try again",
    });
    return;
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, name, phone } = req.body;
  const isEmailValid = utils.validateEmail(email);
  if (!isEmailValid) {
    res.json({
      success: false,
      message: "email id is incorrect format, please fix and try again",
    });
    return;
  }
  // we need to check if email already exists
  const doesEmailAlreadyExist = await useraccounts.findOne({
    email,
  });
  if (doesEmailAlreadyExist) {
    res.json({
      success: false,
      message: "email id already exists! please log in",
    });
    return;
  }
  const salt = utils.generateSalt(16);
  const hashedPassword = utils.hashPassword(password, salt);

  const doc = { email, password: hashedPassword, name, phone };
  const result = await useraccounts.insertOne(doc);

  res.json({ data: result });
});

app.post("/auth/generate", (req, res) => {
  const data = {
    time: new Date(),
    userId: 1,
  };
  const token = jwt.sign(data, jwtSecret);

  res.send(token);
});

app.get("/auth/validate", (req, res) => {
  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ success: false, err: "Not authenticated" });
    }
  } catch (err) {
    return res.status(401).json({ success: false, err: "Not authenticated" });
  }
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
