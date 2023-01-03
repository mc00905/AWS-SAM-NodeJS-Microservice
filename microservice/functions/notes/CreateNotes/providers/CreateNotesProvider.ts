import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../middleware/ErrorLibrary';
import { CreateNotesAgent } from '../data-agents/CreateNotesAgent';

interface Note {
    userId: string;
    title: string;
    content: string;
}

export class CreateNotesProvider {
    private agent: CreateNotesAgent;

    constructor(agent?: CreateNotesAgent) {
        this.agent = agent || new CreateNotesAgent();
    }

    public async createNote(
        userId: string,
        title: string,
        content: string,
    ): Promise<ResultAsync<Note, GenericInternalServerError>> {
        const note: Note = {
            userId,
            title,
            content,
        };
        const op = await this.agent.saveNote(note);
        if (op.isOk()) {
            return okAsync(note);
        } else {
            return errAsync(op.error);
        }
    }
}
