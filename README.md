# Project 8 - SQL Library Manager

This is a NodeJS project that uses server-side rendering with Pug and Sqlite for data persistence to display a library of books and allow the user to perform CRUD operations on the library. **Aiming for exceeds expectations: all bonus requirements completed.** 


## Programming Approach

This project was based heavily on the Using Sequelize ORM With Express workshop because of the complexity of setting up SQLite to work properly. *Async/Await* patterns are used for data fetching in all routes and middleware is used to handle errors. The app allows the user to create, read, update, and delete books in the library database. Pagination is used to display only 10 records at a time and buttons can clicked to scrolls through the records (**Bonus**). The user can also search for a book by title, author, genre, or year (**Bonus**). 

## Syntax and Conventions

The app is written in ES6 JavaScript. 
