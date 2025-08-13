import { COMMON_RES_MESSAGES } from "../constants/commonResMessage.constant";

export interface ResponseType<ContentType = Record<string, any> | Array<any>> {
    message: COMMON_RES_MESSAGES | string,
    data?: {
        content?: ContentType, // response data for frontend
        totalCount?: number,
        // could be more 
    },
    error?: Record<string, any> | Array<any>
}