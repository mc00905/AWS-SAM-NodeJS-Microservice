import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from './middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from './middleware/APIGatewayProxyResultResolver';
import { GetNotesForUserProvider } from './GetNotesForUserProvider';

const provider = new GetNotesForUserProvider();

export const getNotesForUser: APIGatewayProxyHandler = async (event) => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    if (normalisedEvent.isErr()) {
        return APIGatewayProxyResultResolver(
            ResponseLibrary.InternalServerError,
            'Something went wrong',
            normalisedEvent.error,
        );
    }
    const { pathParameters } = normalisedEvent.value;
    const userId = pathParameters.userId as string;
    const notes = await provider.getNotesForUser(userId);
    return notes.match(
        (notes) => {
            const body = {
                notes,
            };
            return APIGatewayProxyResultResolver(ResponseLibrary.Success, 'ResourceSuccessfullyFetched', body);
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};
