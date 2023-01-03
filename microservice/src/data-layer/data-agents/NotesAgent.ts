import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocument,
    PutCommandInput,
    QueryCommandOutput,
    QueryCommandInput,
    DeleteCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { Note } from '../../types/Note';

export class NotesAgent {
    private dynamoClient: DynamoDBClient;
    private dynamoDocumentClient: DynamoDBDocument;
    private tableName?: string;

    constructor(dynamoClient?: DynamoDBClient, dynamoDocumentClient?: DynamoDBDocument, tableName?: string) {
        this.dynamoClient = dynamoClient || new DynamoDBClient({ region: process.env.AWS_REGION });
        this.dynamoDocumentClient = dynamoDocumentClient || DynamoDBDocument.from(this.dynamoClient);
        this.tableName = tableName || process.env.TABLE_NAME;
    }

    public saveNote(note: Note): ResultAsync<void, GenericInternalServerError> {
        const params: PutCommandInput = {
            TableName: this.tableName,
            Item: note,
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.dynamoDocumentClient.put(params);
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to create in Dynamo', JSON.stringify(e));
            },
        );
    }

    public getNotesForUser(userId: string): ResultAsync<QueryCommandOutput, GenericInternalServerError> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: '#userId= :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
            ExpressionAttributeNames: {
                '#userId': 'userId',
            },
        };
        return ResultAsync.fromPromise(this.dynamoDocumentClient.query(params), (e) => {
            return new GenericInternalServerError('Failed to fetch from Dynamo', JSON.stringify(e));
        });
    }

    public deleteNotesForUser(userId: string): ResultAsync<void, GenericInternalServerError> {
        const params: DeleteCommandInput = {
            TableName: this.tableName,
            Key: {
                userId,
            },
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.dynamoDocumentClient.delete(params);
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to delete from Dynamo', JSON.stringify(e));
            },
        );
    }
}
