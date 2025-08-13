import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { COMMON_RES_MESSAGES } from 'src/constants/commonResMessage.constant';
import { ResponseType } from 'src/interfaces/responseType';

@Injectable()
export class ExceptionHandler {
    catchException(error: any) {
        console.error("catch block => ", error?.name);
        // filter and handles exceptions
        if (error instanceof HttpException) {
            throw error;
        }
        // if (error instanceof QueryFailedError) {
        //     // to do : add alerts
        //     console.error(error)
        // }
        // for unknown exception
        const res: ResponseType = {
            message: COMMON_RES_MESSAGES.SERVER_ERR,
        };
        throw new InternalServerErrorException(res);
    }
}
