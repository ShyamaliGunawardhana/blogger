import mongoose from 'mongoose';
import mongooseImmutablePlugin from 'mongoose-immutable-plugin';
import validator from 'validator';

let authorSchema = mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId },
    name: {type: String, required: true },
    username: {type: String, required: true, unique: true, immutable: true },
    password: { type: String, required: true},
    email: {type: String, 
        required: true, 
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        } 
    },
    address: {type: String },
    createdOn: {type: Date },
    modifiedOn: {type: Date },
    isDeleted: {type: Boolean, default: false }
});

authorSchema.plugin(mongooseImmutablePlugin);
const authorModel = mongoose.model('authors', authorSchema);

function getAuthorById(authorId) {
    return new Promise((resolve, reject) => {
        authorModel.find({_id: authorId, isDeleted: false}).select("-password").then(author => {
            resolve(author);
        }).catch(error => {
            reject(error);
        });
    });
}

function getAuthors(isDeleted = false) {
    return new Promise((resolve, reject) => {
        authorModel.find({isDeleted: isDeleted}).then(authors => {
            resolve({authors : authors});
        }).catch(error => {
            reject(error);
        });
    });
}

function createAuthor(author) {
    let createdAuthor = new authorModel(author);
    return new Promise((resolve, reject) => {
        createdAuthor.save(author).then(newAuthor => {
            resolve(newAuthor);
        }).catch(error => {
            reject(error);
        });
    });
}

function updateAuthor(authorId, author) {
    return new Promise((resolve, reject) => {
        authorModel.findOneAndUpdate({ _id: authorId, isDeleted: false }, author, {returnOriginal:false}).then(updatedAuthor => {
            resolve(updatedAuthor);
        }).catch(error => {
            reject(error);
        });
    });
}

function deleteAuthor(authorId) {
    return new Promise((resolve, reject) => {
        authorModel.findOneAndUpdate({ _id: authorId, isDeleted: false }, {isDeleted: true}, {returnOriginal:false}).then(deletedAuthor => {
            resolve(deletedAuthor);
        }).catch(error => { 
            reject(error);
        });
    });
}

function login(author) {
    return new Promise((resolve, reject) => {
        authorModel.find(author).then(author => {
            resolve(author);
        }).catch(error => {
            reject(error);
        });
    });
}

export function authorRepo() {
    return {
        getAuthorById: getAuthorById,
        getAuthors: getAuthors,
        createAuthor: createAuthor,
        updateAuthor: updateAuthor,
        deleteAuthor: deleteAuthor,
        login: login
    }
}
