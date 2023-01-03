import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { NotesAgent } from '../../data-layer/data-agents/NotesAgent';
import { Note } from '../../types/Note';

export class NotesProvider {
    private agent: NotesAgent;

    constructor(agent?: NotesAgent) {
        this.agent = agent || new NotesAgent();
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
