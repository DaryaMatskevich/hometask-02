import { ResultStatus } from "./resultCode";

export function resultCodeToHttpException(status: ResultStatus): number {
    switch (status) {
        case ResultStatus.Success:
            return 204; // OK
        case ResultStatus.BadRequest:
            return 400; // Bad Request
        case ResultStatus.Unauthorized:
            return 401; // Unauthorized
        case ResultStatus.Forbidden:
            return 403; // Forbidden
        case ResultStatus.NotFound:
            return 404; // Not Found
     
            default:
            const exhaustiveCheck: never = status;
            throw new Error(`Unhandled result status: ${exhaustiveCheck}`);
    }
}