import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleString(), 
  };

  fs.readFile("posts.json", "utf-8", (err, data) => {
    let posts = [];
    if(!err && data.trim()) {
        posts = JSON.parse(data);
    };

    posts.push(newPost);

    fs.writeFile("posts.json", JSON.stringify(posts, null, 2), (err)=> {
        if (err) throw err;
        res.render("postSubmit.ejs")
    });


  });
});

app.get("/posts", (req, res) => {
  
    fs.readFile("posts.json", "utf-8", (err, data) => {
        if (err) throw err;
        const posts = JSON.parse(data);

        res.render("posts.ejs", {blogPosts: posts});
    });

});

app.get("/edit", (req, res) => {
  fs.readFile("posts.json", "utf-8", (err, data) => {
        if (err) throw err;
        const posts = JSON.parse(data);

        res.render("posts.ejs", {blogPosts: posts});
    });
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});