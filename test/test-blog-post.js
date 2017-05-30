const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server')

const should = chai.should();

chai.use(chaiHttp);

describe('blog post', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it("should retrieve all the blog posts on get", function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            res.should.have.status(200)
            res.should.be.json;
            res.body.should.be.a("array");
            res.body.length.should.be.at.least(1)
            const expectedKeys = ["title", "content", "author", "publishDate", "id"]
            res.body.forEach(function(post) {
                post.should.be.a('object');
                post.should.have.all.keys(expectedKeys)
            });
        });
    });

    it("should add a blog post on post", function() {
        const newBlogPost = {title: 'blog post 3', content: 'more posts', author: 'mike', publishDate: 2017};
        const expectedKeys = ['id'].concat(Object.keys(newBlogPost))
        return chai.request(app)
        .post('/blog-posts')
        .send(newBlogPost)
        .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.all.keys(expectedKeys)
            res.body.title.should.equal(newBlogPost.title);
            res.body.author.should.equal(newBlogPost.author);
            res.body.content.should.equal(newBlogPost.content)
        })
    })

    it("should err if missing expectd keys on post", function() {
        const badRequestData = {};
        return chai.request(app)
        .post('/blog-posts')
        .send(badRequestData)
        .then(function(res) {
            res.should.have.status(400)
        });
    });

    it('should update a blog post on put', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            const updatedPost = Object.assign(res.body[0], {title: "new post title", content: "new post content"});
        })
        return chai.request(app)
        .put(`/blog-posts/${res.body[0].id}`)
        .send(updatedPost)
        .then(function(res) {
            res.should.have.status(204);
            res.should.be.json;
        })
    })
    it('should delete posts on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
  });
});
