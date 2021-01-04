import { CustomError } from './custom-error'

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor(public message: string) {
        super(message);

        // Only because we are extending a built in class Obj {
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);        
    }

    serializeErrors() {
        return [
            { message: this.message }
        ];
    }
}