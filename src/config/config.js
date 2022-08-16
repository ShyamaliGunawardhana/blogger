export function configuration() {
    return {
        errorMessage: {
            author: {
                NOTFOUND: 'cannot find author with id {}',
                INVALID: 'Invalid author id {}',
                ILLIGAL_MODIFY: 'username and email cannot be modified',
                DELETED: 'Author is successfully deleted',
                INVALID_EMAIL: 'Invalid email provided {}'
            },
            post: {
                NOTFOUND: 'cannot find post with id {}',
                INVALID: 'Invalid post id {}',
                DELETED: 'Post is successfully deleted',
                ILLIGAL_MODIFY: 'Author cannot be modified'
            },
            comment: {
                NOTFOUND: 'cannot find comments for post with id {}',
                INVALID: 'Invalid post id {}',
                DELETED: 'Comment is successfully deleted',
                INVALID_EMAIL: 'Invalid email provided {}'
            },
            login: {
                NOTFOUND: 'email or username should be provided',
                PASSWORD_NOTFOUND: 'password should be provided',
                AUTHENTICATION_FALIED: 'Invalid {} or password',
                UNAUTHORIZED: 'User not Authorized',
                URL_NOTFOUND: "Requested URL not found"
            }
        },
        status: {
            CREATED: 201,
            UPDATED: 200,
            SUCCESS: 200,
            BAD_REQUEST: 400 ,
            AUTHENTICATION_FALIED: 403,
            NOT_FOUND: 404,
            INTERNAL_SERVER_ERROR: 500
        },
        regex: {
            id: '^([0-9a-zA-Z]{24})$'
        },
        DB_URL: 'mongodb://localhost:27017/blogger',
        PORT: 3000,
        JWT_TOKEN: 'blogger_secret_key'
    }
}