import { HttpStatus } from '@Adera/common-enums';

export interface AderaErrorBody {
  code: string;
  errorText: string;
  errorScope: string;
  statusCode: HttpStatus;
}

export class AderaError extends Error {
  body: AderaErrorBody;

  constructor(body: AderaErrorBody) {
    super(body.errorText);
    this.name = 'AderaError';
    this.body = body;
  }
}

export function isAderaErrorBody(body: AderaErrorBody | null | undefined): body is AderaErrorBody {
  return !!(body as AderaErrorBody | null)?.errorScope && !!(body as AderaErrorBody | null)?.statusCode;
}
