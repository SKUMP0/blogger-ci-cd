const { Blog } = require('../models/Blog');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function addBlog(req, res) {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const author = req.body.author;

        if (author.length < 1) {
            return res.status(500).json({ message: 'Please enter your Username. ' });
        } else if (content.length < 3) {
            return res.status(500).json({ message: 'Content is too short. ' });
        } else if (title.length < 3) {
            return res.status(500).json({ message: 'Title is too short. ' });
        } else {
            const newBlog = new Blog(title, content, author);
            const updatedBlog = await writeJSON(newBlog, 'utils/blogs.json');
            return res.status(201).json(updatedBlog);
        }   
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewBlogs(req, res) {
    try {
        const allBlogs = await readJSON('utils/blogs.json');
        return res.status(201).json(allBlogs);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


module.exports = {
    readJSON, writeJSON, addBlog, viewBlogs
};