const express = require('express');

const Posts = require('./data/db.js')
const postsRouter = require('./posts/posts-router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.json({message: 'Connection to server was successful'});
});

server.use('/api/posts', postsRouter);

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

server.listen(4000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});