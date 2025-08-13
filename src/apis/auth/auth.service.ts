import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ResponseType } from 'src/interfaces/responseType';
import { USER_RES_MESSAGES } from 'src/constants/userResMessage.constant';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Session } from './entities/session.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpUserDto, LoginUserDto, LogoutUserDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Session.name) private sessionModel: Model<Session>,
        private jwtService: JwtService
    ) { }

    private async createAndSaveToken(jwtPayload: { userId: string, [x: string]: any }, jwtSignOptions?: JwtSignOptions) {

        const access_token = await this.jwtService.signAsync(jwtPayload, jwtSignOptions);

        // create session
        await this.sessionModel.create({
            userId: jwtPayload.userId,
            token: access_token
        });

        return access_token;
    }

    async signup(signUpUserDto: SignUpUserDto): Promise<ResponseType> {
        // Check if user already exists
        const existingUser = await this.userModel.findOne({ email: signUpUserDto.email });
        if (existingUser) {
            const res: ResponseType = { message: USER_RES_MESSAGES.ALREADY_EXIST }
            throw new ConflictException(res);
        }

        // Create new user (for now, store password as-is, you should hash it in production)
        const newUser = await this.userModel.create({
            ...signUpUserDto,
            isActive: true
        });

        return {
            message: USER_RES_MESSAGES.CREATED,
            data: {
                content: {
                    user: {
                        id: newUser._id,
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName
                    }
                }
            }
        };
    }

    async login(loginUserDto: LoginUserDto): Promise<ResponseType> {

        // check for account
        const user = await this.userModel.findOne({
            email: loginUserDto.email
        }).select('email firstName lastName _id isActive password');

        if (!user) {
            const res: ResponseType = { message: USER_RES_MESSAGES.NOT_EXIST }
            throw new NotFoundException(res);
        }
        if (!user.isActive) {
            const res: ResponseType = { message: USER_RES_MESSAGES.NOT_EXIST }
            throw new ConflictException(res);
        }

        // For now, simple password check (you should implement proper hashing)
        if (user.password !== loginUserDto.password) {
            const res: ResponseType = { message: USER_RES_MESSAGES.INVALID_CREDS }
            throw new UnauthorizedException(res);
        }

        // delete existing session
        await this.sessionModel.deleteMany({ userId: user._id });

        const jwtPayload = {
            userId: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
        const access_token = await this.createAndSaveToken(jwtPayload);

        return {
            message: USER_RES_MESSAGES.LOGIN,
            data: {
                content: {
                    token: access_token,
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                }
            }
        };
    }

    async logout(logoutUserDto: LogoutUserDto): Promise<ResponseType> {

        await this.sessionModel.deleteMany({
            userId: logoutUserDto.userId
        });

        return {
            message: USER_RES_MESSAGES.LOGOUT
        }
    }
}
