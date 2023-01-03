import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from '../../middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from '../../middleware/APIGatewayProxyResultResolver';
import { NotesProvider } from '../../service-layer/providers/NotesProvider';

const provider = new NotesProvider();

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
