import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting to database';
    constructor() {
        super('Error connecting to DB');

        // Only because we are extending a built in class Obj {
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);        
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ];
    }
}