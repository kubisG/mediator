import { HttpException, HttpStatus } from "@nestjs/common";

const DB_UNIQUE_CONSTRAINT = "23505";
const DB_FOREIGN_KEY_CONSTRAINT = "23503";

export class DbException extends HttpException {
    constructor(ex, message?) {
        const code = ex.code ? ex.code : -1;
        const err = { message: ex.message, statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
        switch (code) {
            case DB_UNIQUE_CONSTRAINT: {
                err.message = `entity ${message ? message : ""} already exists`;
                break;
            }
            case DB_FOREIGN_KEY_CONSTRAINT: {
                err.message = `entity ${message ? message : ""} is referenced by some other object`;
                break;
            }
        }
        super(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
