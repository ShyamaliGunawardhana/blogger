import { authorRepo } from '../repository/AuthorRepository.js'
const authorRepository = authorRepo();

function getAuthors(isDeleted) {
    return authorRepository.getAuthors(isDeleted);
}

function getAuthorById(authorId) {
    return authorRepository.getAuthorById(authorId);
}

function createAuthor(author) {
    author.createdOn = new Date();
    return new Promise((resolve, reject) => {
        authorRepository.createAuthor(author).then(created => {
            let author = created.toObject();
            delete author['password'];
            resolve(author);
        }).catch(error => {
            reject(error);
        });;    
    });    
}

function updateAuthor(authorId, author) {
    author.modifiedOn = new Date();
    return new Promise((resolve, reject) => {
        authorRepository.updateAuthor(authorId, author).then(updated => {
            let author = updated.toObject();
            delete author['password'];
            resolve(author);
        }).catch(error => {
            reject(error);
        });;    
    }); 
}

function deleteAuthor(authorId) {
    return authorRepository.deleteAuthor(authorId);
}

export function author() {
    return {
        getAuthors: getAuthors,
        createAuthor: createAuthor,
        getAuthorById: getAuthorById,
        updateAuthor: updateAuthor,
        deleteAuthor: deleteAuthor
    }
}