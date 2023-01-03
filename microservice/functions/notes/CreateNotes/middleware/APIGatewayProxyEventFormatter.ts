import type {
    APIGatewayProxyEventHeaders,
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEvent,
} from 'aws-lambda';
import { err, ok, Result } from 'neverthrow';
import { BadRequestError } from './ErrorLibrary';

export interface SimplifiedEvent {
    body: any;
    headers: APIGatewayProxyEventHeaders;
    pathParameters: APIGatewayProxyEventPathParameters;
    queryParameters: APIGatewayProxyEventQueryStringParameters;
}

export const APIGatewayProxyEventFormatter = (
    event: APIGatewayProxyEvent,
): Result<SimplifiedEvent, BadRequestError> => {
    const rawBody = event.body;
    let body = {};
    if (!rawBody) {
        body = {};
    } else {
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            return err(new BadRequestError('Encountered error whilst parsing body: expected JSON', JSON.stringify(e)));
        }
    }
    const headers = event.headers;
    const queryParameters = event.queryStringParameters || {};
    const pathParameters = event.pathParameters || {};
    const simplifiedEvent = {
        body,
        headers,
        queryParameters,
        pathParameters,
    };
    return ok(simplifiedEvent);
};
