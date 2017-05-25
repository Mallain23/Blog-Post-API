const express = require('express');
const morgan = require('morgan')

const blogPostRouter = require('./blogPostRouter')
const app = express();



app.use(morgan('common'));


app.get('/', (req, res) => {
  res.send(__dirname + '/index.html');
});

app.use('/blog-posts', blogPostRouter);


app.listen(process.env.PORT || 8080, () => {
  console.log(`you are listening on ${process.env.PORT || 8080}`)
})
