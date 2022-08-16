import express from 'express';
import jwt from 'jsonwebtoken';
import { author }  from '../service/AuthorService.js';
import { login }  from '../service/LoginService.js';
import { configuration } from '../config/config.js';
import { helperUtil } from '../util/healper.js';

const router = express.Router();
const authorService = author();
const loginService = login();
const config = configuration();
const helper = helperUtil();

router.post('/', authenticate);

function authenticate(req, res) {
    const user = req.body;
    if(helper.isNullUndefinedOrEmpty(user.password)) {
    res.status(config.status.BAD_REQUEST).send({ error: config.errorMessage.login.PASSWORD_NOTFOUND });
        return;
    }
    let creds = {
        password: user.password,
        isDeleted: false
    };
    if( !helper.isNullUndefinedOrEmpty(user.username) || !helper.isNullUndefinedOrEmpty(user.email)) {
        if(!helper.isNullUndefinedOrEmpty(user.username)) {
            creds.username = user.username;
        } else if(!helper.isNullUndefinedOrEmpty(user.email)) {
            creds.email = user.email;
        }
    } else {
        res.status(config.status.AUTHENTICATION_FALIED).send({ error: config.errorMessage.login.AUTHENTICATION_FALIED });
        return;
    }
    loginService.login(user).then(author => {
        if(helper.isNullUndefinedOrEmpty(author[0])) {
            res.status(config.status.BAD_REQUEST).send({ error: 
            helper.formatString(config.errorMessage.login.AUTHENTICATION_FALIED, 
                !helper.isNullUndefinedOrEmpty(creds.username) ? 'username' : 'email') });
        } else {
            const token = jwt.sign({user}, config.JWT_TOKEN);
            res.status(config.status.SUCCESS).send({token : token});
        }
        
    });
}

export default router;