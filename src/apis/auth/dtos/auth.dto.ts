import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, IsUUID, ValidationOptions } from 'class-validator';

export class SignUpUserDto {
    @IsEmail()
    @Length(1, 50)
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoginUserDto {
    @IsOptional()
    @IsEmail()
    @Length(1, 50)
    email?: string;


    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LogoutUserDto {
    @IsUUID()
    userId: string;
}
