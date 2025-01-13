var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 6060;
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});

const { addBlog, viewBlogs } = require('./utils/BlogUtil.js');
app.get('/view-resources', viewBlogs);  // For GET /view-resources
app.post('/add-resource', addBlog);    // For POST /add-resource

// Add an alias route for the frontend
app.post('/add-blog', addBlog);        // Alias for add-resource

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };
