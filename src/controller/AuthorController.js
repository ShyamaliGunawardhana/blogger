import express from 'express';
import { author }  from '../service/AuthorService.js';
import { configuration } from '../config/config.js';
import { helperUtil } from '../util/healper.js';

const router = express.Router();
const authorService = author();
const config = configuration();
const helper = helperUtil();


router.get('/', getAuthors);
router.get('/:authorId', getAuthorById);

router.post('/', createAuthor);

router.put('/:authorId', updateAuthor);

router.delete('/:authorId', deleteAuthor);

function getAuthors(req, res) {
    const isDeleted = helper.isNullUndefinedOrEmpty(req.query.isDeleted) ? false : req.query.isDeleted;
    authorService.getAuthors(isDeleted).then(author => {
        res.status(config.status.SUCCESS).send(author);
    });
}

function getAuthorById(req, res) {
    const authorId = req.params.authorId;
    if(authorId.match(config.regex.id)) {
        authorService.getAuthorById(authorId).then(author => {
            if(author.length > 0) {
            res.status(config.status.SUCCESS).send({author: author[0]});
            } else {
            res.status(config.status.NOT_FOUND).send({ error: helper.formatString(config.errorMessage.author.NOTFOUND, authorId)});
            return
            }
        });
    } else {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.author.INVALID, authorId)});
    }
}

function createAuthor(req, res) {
    authorService.createAuthor(req.body).then(createdAuthor => {
        if(createdAuthor.err) {
            res.status(config.status.BAD_REQUEST).send(createdAuthor.err);
        }
    res.status(config.status.CREATED).send(createdAuthor);
    }).catch(error => {
        res.status(config.status.BAD_REQUEST).send({ error: error.message });
    });
    
}

function updateAuthor(req, res) {
    const author = req.body;
    const authorId = req.params.authorId;
    if(!authorId.match(config.regex.id)) {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.author.INVALID, authorId)});
        return;
    }
    if( !helper.isNullUndefinedOrEmpty(author.username) || !helper.isNullUndefinedOrEmpty(author.email)) {
        res.status(config.status.BAD_REQUEST).send({ error: config.errorMessage.author.ILLIGAL_MODIFY });
        return;
    }
    authorService.updateAuthor(authorId, req.body).then(updateAuthor => {
        if(updateAuthor !== null) {
            res.status(config.status.UPDATED).send(updateAuthor);
        } else {
            res.status(config.status.BAD_REQUEST).send({error: helper.formatString(config.errorMessage.author.NOTFOUND, authorId) });
        }
    }).catch(error => {
        res.status(config.status.BAD_REQUEST).send({ error: error });
    });
}

function deleteAuthor(req, res) {
    const authorId = req.params.authorId;
    if(!authorId.match(config.regex.id)) {
        res.status(config.status.BAD_REQUEST).send({ error: helper.formatString(config.errorMessage.author.INVALID, authorId)});
        return;
    }
    authorService.deleteAuthor(authorId).then((deleted) => {
        if(deleted !== null) {
            res.status(config.status.SUCCESS).send({error: helper.formatString(config.errorMessage.author.DELETED, authorId) });
        } else {
            res.status(config.status.BAD_REQUEST).send({error: helper.formatString(config.errorMessage.author.NOTFOUND, authorId) });
        }
    }).catch(error => {
        res.status(config.status.BAD_REQUEST).send({ error: error });
    });
}

export default router;