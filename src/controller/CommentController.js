import express from 'express';
import { comment }  from '../service/CommentService.js';
import { configuration } from '../config/config.js';
import { helperUtil } from '../util/healper.js';

const router = express.Router();
const commentService = comment();
const config = configuration();
const helper = helperUtil();

router.get('/:postId', getCommentsByPostId);

router.post('/', createComment);

router.put('/:commentId', updateComment);

router.delete('/:commentId', deleteComment);

function getCommentsByPostId(req, res) {
    const postId = req.params.postId;
    const isDeleted = helper.isNullUndefinedOrEmpty(req.query.isDeleted) ? false : req.query.isDeleted;
    if(postId.match(config.regex.id)) {
        commentService.getCommentsByPostId(postId, isDeleted).then(comments => {
            if(comments.length > 0) {
            res.status(config.status.SUCCESS).send({comment: comments});
            } else {
            res.status(config.status.NOT_FOUND).send({ error: helper.formatString(config.errorMessage.comment.NOTFOUND, postId)});
            return
            }
        });
    } else {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.comment.INVALID, postId)});
    }
}

function createComment(req, res) {
    commentService.createComment(req.body).then(createdComment => {
        if(createdComment.err) {
            res.status(config.status.BAD_REQUEST).send(createdComment.err);
        }
    res.status(config.status.CREATED).send(createdComment);
    }).catch(error => {
        res.status(config.status.BAD_REQUEST).send({ error: error.message });
    });
    
}

function updateComment(req, res) {
    //check whether psot is deleted
    const comment = req.body;
    const commentId = req.params.commentId;
    if(!commentId.match(config.regex.id)) {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.author.INVALID, authorId)});
        return;
    }
    commentService.updateComment(commentId, comment).then(updateComment => {
    res.status(config.status.UPDATED).send(updateComment);
    }).catch(error => {
        res.status(config.status.BAD_REQUEST).send({ error: error.message });
    });
}

function deleteComment(req, res) {
    const commentId = req.params.commentId;
    if(!commentId.match(config.regex.id)) {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.author.INVALID, authorId)});
        return;
    }
    commentService.deleteComment(commentId).then(() => {
        res.status(config.status.SUCCESS).send({error: helper.formatString(config.errorMessage.author.NOTFOUND, commentId) });
    });
}

export default router;