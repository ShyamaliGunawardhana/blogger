import express from "express";
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import loginController  from './controller/LoginController.js';
import authorController  from './controller/AuthorController.js';
import postController  from './controller/PostController.js';
import commentController  from './controller/CommentController.js';
import { configuration } from './config/config.js';
import { tokenAtuhentication } from './middleware/authenticate.js'

let app = express();
const config = configuration();
const PORT = config.PORT;
mongoose.connect(config.DB_URL);

mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/login', loginController);
app.use('/author', tokenAtuhentication, authorController);
app.use('/post', tokenAtuhentication, postController);
app.use('/comment', tokenAtuhentication, commentController);

app.use('/health', (req, res) => {
    res.status(config.status.SUCCESS).send("OK");
});

app.use((req, res) => {
    res.status(config.status.NOT_FOUND).send(config.errorMessage.login.URL_NOTFOUND);
});

app.listen(PORT, (error) =>{
    if(!error) {
        console.log('Blogger is Successfully Running. listening on port', PORT)
    } else {
        console.log('Server cannot start. Error occurred while starting, error', error);
    }
});