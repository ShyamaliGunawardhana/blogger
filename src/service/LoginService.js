import { authorRepo } from '../repository/AuthorRepository.js'
const authorRepository = authorRepo();

function authenticate(author) {
    author.isDeleted = false;
    return authorRepository.login(author);
}

export function login() {
    return {
        login: authenticate
    }
}