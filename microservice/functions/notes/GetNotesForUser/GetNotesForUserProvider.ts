import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import type { GenericInternalServerError } from './middleware/ErrorLibrary';
import { GetNotesForUserAgent } from './GetNotesForUserAgent';

interface Note {
    userId: string;
    title: string;
    content: string;
}

export class GetNotesForUserProvider {
    private agent: GetNotesForUserAgent;

    constructor(agent?: GetNotesForUserAgent) {
        this.agent = agent || new GetNotesForUserAgent();
    }

    public async getNotesForUser(userId: string): Promise<ResultAsync<Note[], GenericInternalServerError>> {
        const op = await this.agent.getNotesForUser(userId);
        if (op.isOk()) {
            const value = op.value.Items || [];
            return okAsync(value as Note[]);
        } else {
            return errAsync(op.error);
        }
    }
}
