import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from './middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from './middleware/APIGatewayProxyResultResolver';
import { CreateNotesProvider } from './providers/CreateNotesProvider';

const provider = new CreateNotesProvider();

export const createNote: APIGatewayProxyHandler = async (event) => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    if (normalisedEvent.isErr()) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Bad Request Body', normalisedEvent.error);
    }
    const { body, pathParameters } = normalisedEvent.value;
    const userId = pathParameters.userId as string;
    const content = body.content;
    const title = body.title;
    const note = await provider.createNote(userId, title, content);
    return note.match(
        (note) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.SuccessCreated, 'ResourceSuccessfullyCreated', note);
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};
