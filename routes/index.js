const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }
}

/* 
Helper function to create an array of arrays with 10 books each
for pagination.
*/
const getBookArrays = (books) => {
    const bookArrays = [];
    let array = [];

    for (let i = 0; i < books.length; i++) {
        array.push(books[i]);
        if (array.length === 10) {
            bookArrays.push(array);
            array = [];
        }
        if (i === books.length - 1) {
            bookArrays.push(array)
        }
    }

    return bookArrays;

}

/* GET /index */
router.get('/', (req, res) => {
    return res.redirect('/books');
});

/* GET all books */
router.get("/books", asyncHandler(async(req, res) => {
    const foundBooks = await Book.findAll();

    const books = foundBooks.map(b => b.toJSON());

    const bookArrays = getBookArrays(books);

    return res.render('all_books', { bookArrays, searchValue: '' });
}));

/* GET create new book form */
router.get("/books/new", asyncHandler(async(req, res) => {
    return res.render("new_book", { book: {}, title: "New Book"});
}));

/* POST create book. */
router.post('/books/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/books/" + book.id);
    } catch (error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render("new_book", { book, errors: error.errors, title: "New Book" })
        } else {
            throw error;
        }  
    }
}));

/* GET individual book and edit form. */
router.get("/books/:id", asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        res.render("edit", { book, title: book.title });  
    } else {
        res.render('error');
    }
})); 
  
/* POST Update a book. */
router.post('/books/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if(book) {
            await Book.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            res.redirect(`/books/${req.params.id}`);  
        } else {
            res.render('error');
        }
    } catch (error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render("edit", { book, errors: error.errors, title: "Edit book" })
        } else {
            throw error;
        }
    }
}));

/* Delete individual book. */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        await Book.destroy({
            where: {
                id: req.params.id
            }
        });
        res.redirect("/books");
    } else {
        res.render('error');
    }
}));

/* Search function */
router.post('/search', asyncHandler(async(req, res) => {
    const { searchValue } = req.body;
    const foundBooks = await Book.findAll({
        where: {
            [Op.or]:[
                { 
                    title: {
                        [Op.like]: `%${searchValue}%`
                    } 
                },
                { 
                    author: {
                        [Op.like]: `%${searchValue}%`
                    } 
                },
                { 
                    genre: {
                        [Op.like]: `%${searchValue}%`
                    } 
                },
                { year: searchValue }
            ]
        }
    });

    const books = foundBooks.map(b => b.toJSON());

    const bookArrays = getBookArrays(books);

    return res.render('all_books', { bookArrays, searchValue });
}));


module.exports = router;