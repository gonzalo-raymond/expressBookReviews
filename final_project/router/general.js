const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function insertSpaces(string) {
    string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    return string;
}


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
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

    const author = insertSpaces(req.params.author);

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

    const title = insertSpaces(req.params.title);

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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;