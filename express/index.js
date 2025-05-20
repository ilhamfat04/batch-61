// const express = require("express");
import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));
// req => dari client ke server
// res => dari server ke client

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

function home(req, res) {
  res.render("index", { data });
}

function contact(req, res) {
  const phoneNumber = 82306069612;
  res.render("contact", { phoneNumber });
}

let accounts = [];

function handleContact(req, res) {
  // let name = req.body.name;
  // let password = req.body.password;
  let { name, password } = req.body;

  console.log(name, password);

  let account = {
    name,
    password,
  };

  accounts.push(account);
  console.log(accounts);

  res.redirect("/");
}

function portofolioDetail(req, res) {
  let { id } = req.params;

  let result = data.find((element) => element.id == id);

  res.render("portfolio", { result });
}
