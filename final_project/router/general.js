const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isAvailable = require("./auth_users.js").isAvailable;
let users = require("./auth_users.js").users;
const { response } = require('express');
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
public_users.get('/', async function (req, res) {

    try{
        res.send(JSON.stringify({books}, null, 4));
    }catch(error){
        res.status(404).send(error);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try{

        if(books[isbn]){
            res.send(books[isbn]);        
        }else{
            res.status(404).json({message: "The ISBN code is incorrect or the book does not exist."});
        }

    }catch(error){
        res.status(404).send(error);
    }

});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;

    try{

        let isbns = Object.keys(books);

        let filtered_index = isbns.filter((isbn) =>  books[isbn].author === author);

        if(filtered_index.length > 0){
            res.send(books[filtered_index]);
        }else{
            res.status(404).json({message: "The author does not exist."});
        }

    }catch(error){
        res.status(404).send(error);
    } 

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title;

    try{

        let isbns = Object.keys(books);

        let filtered_index = isbns.filter((isbn) =>  (books[isbn].title) === title);

        if(filtered_index.length > 0){
            res.send(books[filtered_index]);
        }else{
            res.status(404).json({message: "The title does not exist."});
        }

    }catch(error){
        res.status(404).send(error);
    }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try{

        if(books[isbn]){
            res.send(books[isbn].reviews);
        }else{
            res.status(404).json({message: "The isbn is incorrect."});
        }

    }catch(error){
        es.status(404).send(error);
    }
});

module.exports.general = public_users;