import { postRepo } from '../repository/PostRepository.js'
const postRepository = postRepo();postRepository

function getPosts(isDeleted) {
    return postRepository.getPosts(isDeleted);
}

function getPostById(postId) {
    return postRepository.getPostById(postId);
}

function createPost(post) {
    post.createdOn = new Date();
    return postRepository.createPost(post);    
}

function updatePost(postId, post) {
    post.modifiedOn = new Date();
    return postRepository.updatePost(postId, post);
}

function deletePost(postId) {
    return postRepository.deletePost(postId);
}

export function post() {
    return {
        getPosts: getPosts,
        createPost: createPost,
        getPostById: getPostById,
        updatePost: updatePost,
        deletePost: deletePost
    }
}