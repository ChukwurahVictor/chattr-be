import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Match } from 'src/common/match.decorator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\S]+$/, {
    message:
      'Password is too weak! It must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Match('newPassword', { message: 'New password and confirmation do not match' })
  confirmNewPassword: string;
}
