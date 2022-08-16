import mongoose from 'mongoose';
import mongooseImmutablePlugin from 'mongoose-immutable-plugin';

let postSchema = mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId },
    title: {type: String, required: true },
    body: {type: String, required: true },
    authorId: {type: mongoose.Schema.ObjectId, required: true, ref: 'authors' },
    createdOn: {type: Date },
    modifiedOn: {type: Date },
    isDeleted: {type: Boolean, default: false }
});

postSchema.plugin(mongooseImmutablePlugin);
const postModel = mongoose.model('posts', postSchema);

function getPostById(postId) {
    return new Promise((resolve, reject) => {
        postModel.find({_id: postId, isDeleted: false}).then(post => {
            resolve(post);
        }).catch(error => {
            reject(error);
        });
    });
}
    
function getPosts(isDeleted = false) {
    return new Promise((resolve, reject) => {
        postModel.find({isDeleted: isDeleted}).then(posts => {
            resolve({posts : posts});
        }).catch(error => {
            reject(error);
        });
    });
}

function getPostByProperty(property) {
    return new Promise((resolve, reject) => {
        postModel.find(property).then(post => {
            resolve(post);
        }).catch(error => {
            reject(error);
        });
    });
}

function createPost(post) {
    let createdPost = new postModel(post);
    return new Promise((resolve, reject) => {
        createdPost.save(post).then(newPost => {
            resolve(newPost);
        }).catch(error => {
            reject(error);
        });
    });
}

function updatePost(postId, post) {
    return new Promise((resolve, reject) => {
        postModel.findOneAndUpdate({ _id: postId }, post, {returnOriginal:false}).then(updatedPost => {
            resolve(updatedPost);
        }).catch(error => {
            reject(error);
        });
    });
}

function deletePost(postId) {
    return new Promise((resolve, reject) => {
        postModel.findOneAndUpdate({ _id: postId, isDeleted: false }, {isDeleted: true}, {returnOriginal:false}).then(deletedPost => {
            resolve(deletedPost);
        }).catch(error => {
            reject(error);
        });
    });
}

export function postRepo() {
    return {
        getPostById: getPostById,
        getPosts: getPosts,
        createPost: createPost,
        updatePost: updatePost,
        getPostByProperty: getPostByProperty,
        deletePost: deletePost
    }
}
