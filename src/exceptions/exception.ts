import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ValidationError,
} from '@nestjs/common';

type ErrorOption = {
  cause?: string;
};

export class ErrorHandler {
    static readonly badRequest = (message?: string, option?: ErrorOption) => {
    return new BadRequestException({ message, cause: option?.cause });
  };

  static readonly forbidden = (message?: string, option?: ErrorOption) => {
    return new ForbiddenException({ message, cause: option?.cause });
  };

  static readonly unauthorized = (message?: string, option?: ErrorOption) => {
    return new UnauthorizedException({ message, cause: option?.cause });
  };

  static readonly notFound = (message?: string, option?: ErrorOption) => {
    return new NotFoundException({ message, cause: option?.cause });
  };

  static readonly validationError = (message?: string, option?: { cause: ValidationError }) => {
    return new ValidationErrorException({ message: String(message), cause: option?.cause });
  };

  static readonly internalServerError = (message?: string, option?: ErrorOption) => {
    return new InternalServerErrorException({ message, cause: option?.cause });
  };
}


export class ValidationErrorException extends InternalServerErrorException {
  constructor(args: { message?: string; cause: ValidationError }) {
    super({ message: args.message, cause: args.cause });
  }
}
