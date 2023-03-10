import { ErrorWrapper400, ErrorWrapper404, ErrorWrapper500 } from './ErrorWrapper';

export enum ErrorLibrary {
    DocumentNotFoundError = 'DocumentNotFound',
    GenericInternalServerError = 'InternalServerError',
    RouteNotFoundError = 'RouteNotFound',
    BadRequestError = 'BadRequest',
}

export class GenericInternalServerError extends ErrorWrapper500 {
    constructor(message: string, details: string) {
        super(ErrorLibrary.GenericInternalServerError, message, details);
    }
}

export class RouteNotFoundError extends ErrorWrapper404 {
    constructor(message: string, details?: string) {
        super(ErrorLibrary.RouteNotFoundError, message, details);
    }
}

export class DocumentNotFoundError extends ErrorWrapper404 {
    constructor(message: string, details?: string) {
        super(ErrorLibrary.DocumentNotFoundError, message, details);
    }
}

export class BadRequestError extends ErrorWrapper400 {
    constructor(message: string, details?: string) {
        super(ErrorLibrary.BadRequestError, message, details);
    }
}
