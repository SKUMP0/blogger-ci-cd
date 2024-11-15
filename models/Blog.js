
class Blog {
    constructor(title, content, author) {
        this.title = title;
        this.content = content;
        this.author = author;

        const timestamp = new Date().getTime(); 
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}

module.exports = { Blog };

