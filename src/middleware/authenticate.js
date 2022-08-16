import { configuration } from '../config/config.js';
const config = configuration();
import { helperUtil } from '../util/healper.js';

const helper = helperUtil();

export function tokenAtuhentication(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(!helper.isNullUndefinedOrEmpty(bearerHeader)) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(config.status.AUTHENTICATION_FALIED).send(config.errorMessage.login.UNAUTHORIZED);
    }
}
