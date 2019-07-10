import { ExceptionFilter, ArgumentsHost, Catch, HttpStatus, HttpException } from "@nestjs/common";

@Catch()
export class SqlExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: `${exception.message} ${exception.detail}`,
        }, 500);
    }

}
