import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { SignUpUserDto, LoginUserDto, LogoutUserDto } from "./dtos/auth.dto";
import { AuthService } from './auth.service';
import { ExceptionHandler } from "src/utils/exceptionHandler";
import { AuthGuard, Public } from "src/guards";

@Controller('user/auth')
@UseGuards(AuthGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly exceptionHandler: ExceptionHandler,
    ) { }

    @Post("/signup")
    @HttpCode(201)
    @Public()
    async signUp(@Body() signUpUserDto: SignUpUserDto) {
        try {
            return this.authService.signup(signUpUserDto);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    @Post("/signin")
    @HttpCode(200)
    @Public()
    async signIn(@Body() loginUserDto: LoginUserDto) {
        try {
            return this.authService.login(loginUserDto);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    @Post("/signout")
    @HttpCode(200)
    async signOut(@Body() logoutUserDto: LogoutUserDto) {
        try {
            return this.authService.logout(logoutUserDto);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }
}