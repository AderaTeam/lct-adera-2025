import { IsString, Validate } from 'class-validator';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidFileName } from 'src/common/utils/validation';

@ValidatorConstraint({ name: 'IsValidFileName', async: false })
export class IsValidFileNameConstraint implements ValidatorConstraintInterface {
  validate(fileName: string): boolean {
    return isValidFileName(fileName);
  }

  defaultMessage(): string {
    return 'wrong file name';
  }
}

export class PutPresignedUrlDto {
  @IsString()
  @Validate(IsValidFileNameConstraint)
  fileName: string;
}
