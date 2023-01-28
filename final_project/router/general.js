const express = require('express');
let books = require("./booksdb.js");
let isAvailable = require("./auth_users.js").isAvailable;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(isAvailable(username)){
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registred!"});
        }else{
            return res.status(403).json({message: "The username is already in use, enter a different one."});
        }
    }else{
        return res.status(404).json({message: "Unable to register the user, please enter a user name and password."});
    }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;

    if(books[isbn]){
        res.send(books[isbn]);
    }else{
        res.status(404).json({message: "The ISBN code is incorrect or the book does not exist."})
    }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author;

    let isbns = Object.keys(books);

    let filtered_index = isbns.filter((isbn) =>  books[isbn].author === author);

    if(filtered_index.length > 0){
        res.send(books[filtered_index]);
    }else{
        res.status(404).json({message: "The author does not exist."});
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const title = req.params.title;

    let isbns = Object.keys(books);

    let filtered_index = isbns.filter((isbn) =>  (books[isbn].title) === title);

    if(filtered_index.length > 0){
        res.send(books[filtered_index]);
    }else{
        res.status(404).json({message: "The title does not exist."});
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;

    if(books[isbn]){

        if(books[isbn].review){
            res.send(books[isbn].review);
        }else{
            res.status(404).json({message: "No reviews yet."});
        }

    }else{
        res.status(404).json({message: "The isbn is incorrect."});
    }

});

module.exports.general = public_users;