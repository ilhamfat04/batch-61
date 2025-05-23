// const express = require("express");
import express from "express";
import { Pool } from "pg";

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
// req => dari client ke server
// res => dari server ke client

// async =  kode dieksekusi berdasarkan waktu eksekusi
// sync = kode dieksekusi berdasarkan urutan

app.get("/", home);
app.get("/contact", contact); // render
app.post("/contact", handleContact); // handle submit data
app.get("/portofolio/:id", portofolioDetail);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

let data = [
  {
    id: 1,
    title: "project 1",
  },
  {
    id: 2,
    title: "project 2",
  },
  {
    id: 3,
    title: "project 3",
  },
  {
    id: 4,
    title: "project 4",
  },
];

async function home(req, res) {
  const query = `SELECT * FROM human`;
  const result = await db.query(query);
  res.render("index", { result });
}

function contact(req, res) {
  const phoneNumber = 82306069612;
  res.render("contact", { phoneNumber });
}

let accounts = [];

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

  res.redirect("/");
}

function portofolioDetail(req, res) {
  let { id } = req.params;

  let result = data.find((element) => element.id == id);

  res.render("portfolio", { result });
}
