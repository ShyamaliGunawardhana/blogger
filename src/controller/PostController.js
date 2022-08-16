import express from 'express';
import { post }  from '../service/PostService.js';
import { configuration } from '../config/config.js';
import { helperUtil } from '../util/healper.js';

const router = express.Router();
const postService = post();
const config = configuration();
const helper = helperUtil();


router.get('/', getPosts);
router.get('/:postId', getPostById);

router.post('/', createPost);

router.put('/:postId', updatePost);

router.delete('/:postId', deletePost);

function getPosts(req, res) {
    const isDeleted = helper.isNullUndefinedOrEmpty(req.query.isDeleted) ? false : req.query.isDeleted;
    postService.getPosts(isDeleted).then(post => {
        res.status(config.status.SUCCESS).send(post);
    });
}

function getPostById(req, res) {
    const postId = req.params.postId;
    if(postId.match(config.regex.id)) {
        postService.getPostById(postId).then(post => {
            if(post.length > 0) {
            res.status(config.status.SUCCESS).send({post: post[0]});
            } else {
            res.status(config.status.NOT_FOUND).send({ error: helper.formatString(config.errorMessage.post.NOTFOUND, postId)});
            return
            }
        });
    } else {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.post.INVALID, postId)});
    }
}

function createPost(req, res) {
    postService.createPost(req.body).then(createdPost => {
        if(createdPost.err) {
            res.status(config.status.BAD_REQUEST).send(createdPost.err);
        }
    res.status(config.status.CREATED).send(createdPost);
    }).catch(error => {
        res.status(config.status.BAD_REQUEST).send({ error: error.message });
    });
    
}

function updatePost(req, res) {
    const post = req.body;
    const postId = req.params.postId;
    if(!postId.match(config.regex.id)) {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.author.INVALID, authorId)});
        return;
    }
    if(!helper.isNullUndefinedOrEmpty(post.authorId)) {
        res.status(config.status.BAD_REQUEST).send({ error: config.errorMessage.post.ILLIGAL_MODIFY });
        return;
    }
    postService.updatePost(postId, post).then(updatePost => {
    res.status(config.status.UPDATED).send(updatePost);
    }).catch(error => {
        res.status(config.status.BAD_REQUEST).send({ error: error.message });
    });
}

function deletePost(req, res) {
    const postId = req.params.postId;
    if(!postId.match(config.regex.id)) {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.author.INVALID, authorId)});
        return;
    }
    postService.deletePost(postId).then(() => {
        res.status(config.status.SUCCESS).send({error: helper.formatString(config.errorMessage.author.NOTFOUND, postId) });
    });
}

export default router;