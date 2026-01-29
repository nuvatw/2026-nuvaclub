export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainError';
    }
}

export class NotFoundError extends DomainError {
    constructor(entity: string, id: string) {
        super(`${entity} with ID ${id} not found`);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class UnauthorizedError extends DomainError {
    constructor(message: string = 'Unauthorized access') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends DomainError {
    constructor(message: string = 'Action forbidden') {
        super(message);
        this.name = 'ForbiddenError';
    }
}
