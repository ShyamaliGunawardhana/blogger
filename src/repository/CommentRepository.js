import mongoose from 'mongoose';
import mongooseImmutablePlugin from 'mongoose-immutable-plugin';
import validator from 'validator';

let commentSchema = mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId },
    name: {type: String, required: true },
    email: {type: String, 
        required: true, 
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        } 
    },
    body: {type: String, required: true },
    postId: {type: mongoose.Schema.ObjectId, required: true, ref: 'posts' },
    createdOn: {type: Date },
    modifiedOn: {type: Date },
    isDeleted: {type: Boolean, default: false }
});

commentSchema.plugin(mongooseImmutablePlugin);
const commentModel = mongoose.model('comments', commentSchema);

function getCommentsByPostId(postId, isDeleted = false) {
    return new Promise((resolve, reject) => {
        commentModel.find({postId: postId, isDeleted: isDeleted}).then(comments => {
        resolve(comments);
        }).catch(error => {
            reject(error);
        });
    });
}

function createComment(comment) {
    let createdComment = new commentModel(comment);
    return new Promise((resolve, reject) => {
        createdComment.save(comment).then(newComment => {
            resolve(newComment);
        }).catch(error => {
            reject(error);
        });
    });
}

function updateComment(commentId, comment) {
    return new Promise((resolve, reject) => {
        commentModel.findOneAndUpdate({ _id: commentId }, comment, {returnOriginal:false}).then(updatedComment => {
            resolve(updatedComment);
        }).catch(error => {
            reject(error);
        });
    });
}

function deleteComment(commentId) {
    return new Promise((resolve, reject) => {
        commentModel.findOneAndUpdate({ _id: commentId, isDeleted: false }, {isDeleted: true}, {returnOriginal:false}).then(deletedComment => {
            resolve(deletedComment);
        }).catch(error => {
            reject(error);
        });
    });
}

export function commentRepo() {
    return {
        getCommentsByPostId: getCommentsByPostId,
        createComment: createComment,
        updateComment: updateComment,
        deleteComment: deleteComment
    }
}
