import express from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import flash from "express-flash";
import session from "express-session";

const db = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "b61-personal-web",
  max: 20,
});

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", home);
app.get("/contact", contact);
app.post("/contact", handleContact);

app.get("/portofolio/:id", portofolioDetail);

app.get("/update/:id", updateData);

app.get("/login", login);
app.post("/login", handleLogin);

app.get("/register", register);
app.post("/register", handleRegister);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function updateData(req, res) {
  const { id } = req.params;

  const result = await db.query(`SELECT * FROM human WHERE id=${id}`);

  const data = {
    name: result.rows[0].name,
    id: result.rows[0].id,
  };

  // console.log(data);

  res.render("contact-update", { data });
}

async function home(req, res) {
  const query = `SELECT * FROM human`;
  const result = await db.query(query);

  let userData;
  if (req.session.user) {
    userData = { name: req.session.user.name, email: req.session.user.email };
  }

  res.render("index", { userData });
}

async function contact(req, res) {
  const query = `SELECT * FROM human `;
  const result = await db.query(query);

  res.render("contact", { result });
}

async function handleContact(req, res) {
  // let name = req.body.name;
  // let password = req.body.password;
  let { name, password } = req.body;

  console.log(name, password);

  let account = {
    name,
    password,
  };

  // accounts.push(account);
  const query = `INSERT INTO human(name) VALUES ('${account.name}')`;
  // const query = `SELECT * FROM person`;
  const result = await db.query(query); //butuh waktu untu menyelesaikan
  // console.log(result); //result kosong

  res.redirect("/contact");
}

function portofolioDetail(req, res) {
  let { id } = req.params;

  let result = data.find((element) => element.id == id);

  res.render("portfolio", { result });
}

function register(req, res) {
  res.render("register", { message: req.flash("error") });
}

async function handleRegister(req, res) {
  let { name, email, password } = req.body;

  const isRegistered = await db.query(
    `SELECT * FROM public.user WHERE email='${email}'`
  );

  console.log(isRegistered.rows);

  if (isRegistered) {
    req.flash("error", "email sudah terdaftar");
    return res.redirect("/register");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO public.user(email, password, name) VALUES ('${email}', '${hashedPassword}', '${name}')`;
  const result = await db.query(query);
  res.redirect("/login");
}

function login(req, res) {
  res.render("login", { message: req.flash("error") });
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  const isRegistered = await db.query(
    `SELECT * FROM public.user WHERE email='${email}'`
  );

  const isMatch = await bcrypt.compare(password, isRegistered.rows[0].password);

  if (!isMatch) {
    req.flash("error", "password salah");
    return res.redirect("/login");
  }

  req.session.user = {
    name: isRegistered.rows[0].name,
    email: isRegistered.rows[0].email,
  };

  res.redirect("/");
}
