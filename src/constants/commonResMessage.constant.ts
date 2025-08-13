export enum RES_STATUS {
    // Exception Class	                 Status Code	Description
    // ---------------------------------------------------------------------------------------
    // created                            201           Resource created (e.g. insert or add).
    // success                            200           Successfully executed.
    // ---------------------------------------------------------------------------------------
    // BadRequestException	              400           Invalid input or malformed data
    // UnauthorizedException	          401           Auth required or failed
    // ForbiddenException	              403           Authenticated but no permission
    // NotFoundException	              404           Resource not found
    // MethodNotAllowedException	      405           HTTP method not allowed
    // NotAcceptableException	          406           Content not acceptable
    // RequestTimeoutException	          408           Request timed out
    // ConflictException	              409           Resource conflict (e.g.already active)
    // GoneException	                  410           Resource no longer available
    // PayloadTooLargeException	          413           Request body too large
    // UnsupportedMediaTypeException	  415           Content type not supported
    // UnprocessableEntityException	      422           Validation errors(semantic)
    // InternalServerErrorException	      500           Unexpected server error
    // NotImplementedException	          501           Method not implemented
    // BadGatewayException	              502           Upstream server error
    // ServiceUnavailableException	      503           Server temporarily unavailable
    // GatewayTimeoutException	          504           Upstream timeout

    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    REQUEST_TIMEOUT = 408,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503
}

export enum COMMON_RES_MESSAGES {
    DB_ERR = "Oops! Something went wrong while communicating with database. Plz try later.",
    UNKNOWN_ERR = "Oops! Something went wrong plz try later.",
    SERVER_ERR = "Oops! Something went wrong while listening to your request on server. Plz try later.",
    VALIDATION_ERR = "Validation failed, invalid payload.",
    UNAUTHORIZED_ERR = "Unauthorized api call.",
    PASSWORD_HASHING_ERR = "Oops something"
}
