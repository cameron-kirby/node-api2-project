const express = require('express');

const Posts = require('../data/db.js')

const router = express.Router();

router.post('/', (req, res) => {
    const newPost = req.body;
    if(newPost.title.length > 0 && newPost.contents.length > 0){
        Posts.insert(newPost)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message:'Error inserting post' })
        })
    } else {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
    }
});

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const newComment = {...req.body, post_id:id};
    if(Posts.findById(id)){
        if(newComment.text.length > 0){
            Posts.insertComment(newComment)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message:'Error inserting comment' })
            })
        } else {
            res.status(400).json({errorMessage: 'Please provide text for the comment'})
        }
    } else {
        res.status(404).json({message: 'The specified post does not exist'})
    }
    
});

router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving posts',
            });
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Posts.findById(id)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({
                message: 'Could not find post with specified ID'
            })
        })
});

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    Posts.findPostComments(id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({
                message: 'Could not find post with specified ID'
            })
        })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Posts.remove(id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The post has been removed' });
            } else {
                res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error removing the post',
            });
        });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body
    Posts.update(id, changes)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error updating the post',
            });
        });
});

  module.exports = router;