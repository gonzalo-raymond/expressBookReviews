const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isAvailable = (username)=>{ //returns boolean

    let userWithSameName = users.filter((user) => {
        return user.username === username;
    });

    if(userWithSameName.length > 0){
        return false;
    }else{
        return true;
    }

};

const authenticatedUser = (username, password)=>{ //returns boolean

    let validUser = users.filter((user) => (user.username === username && user.password === password));

    if(validUser.length > 0){
        return true;
    }else{
        return false;
    }

};

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){

        res.status(404).json({message: "Please enter username and password."});

    }else{

        if(authenticatedUser(username, password)){

            let accessToken = jwt.sign({
                data: password
            }, "access", {expiresIn: 60 * 60});
    
            req.session.authorization = {
                accessToken, username
            };
    
            return res.status(200).json({message: "User successfully logged in!"});
            
        }else{
            return res.status(403).json({message: "Incorrect username or password."});
        }

    }
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const review = req.query.review;

    let reviews = books[isbn].reviews

    let currentUser = req.session.authorization.username;

    if(isbn && review){
        reviews[currentUser] = review;
        res.status(200).json({message: "The review has been successfully published!"});
    }else{
        res.status(404).json({message: "Enter a review and a valid ISBN"})
    }
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    let currentUser = req.session.authorization.username;

    if(books[isbn]){
        
        let reviews = books[isbn].reviews;

        if(reviews[currentUser]){

            delete reviews[currentUser];
            res.status(200).json({message: "Your review has been removed."});

        }else{
            res.status(404).json({message: "No review exists or has been removed."});
        }

    }else{
        res.status(404).json({message: "Enter a valid ISBN"});
    }

});

module.exports.authenticated = regd_users;
module.exports.isAvailable = isAvailable;
module.exports.users = users;