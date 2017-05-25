const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create("my first blog post", "here it is!", "mike", "2017");
BlogPosts.create("my second blog post", "more blogging!", "mike", "2017");

router.get('/', (req, res) => {
     res.json(BlogPosts.get());

})

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ["title", "content", "author", "publishDate"];
    const hasMissingField = requiredFields.some(fields => !fields in body)
    if (!body || hasMissingField) {
            const message = `Request body is missing required field "${field}"`
            console.error(message)

            return res.status(400).send(message);
    }

    console.log("Creating new blog post");

    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate)
    res.status(201).json(item)
});

router.delete('/:id', (req, res) => {
    console.log(`deleting blog post ${req.params.id}`)

    BlogPosts.delete(req.params.id)
    res.status(204).end();
})

router.put('/:id', jsonParser, ({params, body}, res) => {
    const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
    const hasMissingField = requiredFields.some(field => !field in body)

    if (hasMissingField) {
        const message = `Request body is missing required field ${fields}`
        console.error(message);

        return res.status(400).send(message);
    }

    if (params.id !== body.id) {
        const message = `Request body id "${body.id}" and request path id "${params.id}" must match`

        return res.status(400).send(message);
    }
    console.log(`Updating blog post with id '${params.id}'`)

    const { id, title, content, author, publishDate } = body;
    const updatedBlogPost = BlogPosts.update({
        id,
        title,
        content,
        author,
        publishDate
    });

    res.status(201).json(updatedBlogPost);
})

module.exports = router;
