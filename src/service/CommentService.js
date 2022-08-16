import { commentRepo } from '../repository/CommentRepository.js'
const commentRepository = commentRepo();

function getCommentsByPostId(commentId, isDeleted) {
    return commentRepository.getCommentsByPostId(commentId, isDeleted);
}

function createComment(comment) {
    comment.createdOn = new Date();
    return commentRepository.createComment(comment);    
}

function updateComment(commentId, comment) {
    comment.modifiedOn = new Date();
    return commentRepository.updateComment(commentId, comment);
}

function deleteComment(commentId) {
    return commentRepository.deleteComment(commentId);
}

export function comment() {
    return {
        createComment: createComment,
        getCommentsByPostId: getCommentsByPostId,
        updateComment: updateComment,
        deleteComment: deleteComment
    }
}