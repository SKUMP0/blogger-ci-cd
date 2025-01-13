const { Blog } = require('../models/Blog');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        console.log(`Reading from file: ${filename}`);
        const data = await fs.readFile(filename, 'utf8');
        console.log(`File content:`, data);
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading from ${filename}:`, err);
        throw err;
    }
}

async function writeJSON(object, filename) {
    try {
        console.log(`Attempting to write to ${filename}`);
        const allObjects = await readJSON(filename);
        console.log(`Existing objects before write:`, allObjects);

        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects, null, 2), 'utf8');
        console.log(`Successfully wrote to ${filename}`);
        return allObjects;
    } catch (err) {
        console.error(`Error writing to ${filename}:`, err);
        throw err;
    }
}

async function addBlog(req, res) {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const author = req.body.author;

        console.log('Received request body:', req.body);

        if (!author || author.length < 1) {
            console.error('Validation failed: author missing or empty');
            return res.status(500).json({ message: 'Please enter your Username.' });
        } else if (!content || content.length < 3) {
            console.error('Validation failed: content too short');
            return res.status(500).json({ message: 'Content is too short.' });
        } else if (!title || title.length < 3) {
            console.error('Validation failed: title too short');
            return res.status(500).json({ message: 'Title is too short.' });
        } else {
            const newBlog = new Blog(title, content, author);
            const updatedBlog = await writeJSON(newBlog, 'utils/blogs.json');
            return res.status(201).json(updatedBlog);
        }
    } catch (error) {
        console.error('Error in addBlog:', error);
        return res.status(500).json({ message: error.message });
    }
}

async function viewBlogs(req, res) {
    try {
        const allBlogs = await readJSON('utils/blogs.json');
        return res.status(201).json(allBlogs);
    } catch (error) {
        console.error('Error in viewBlogs:', error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    addBlog,
    viewBlogs,
};
