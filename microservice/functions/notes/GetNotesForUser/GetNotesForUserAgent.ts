import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, QueryCommandOutput, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

import { ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from './middleware/ErrorLibrary';

export class GetNotesForUserAgent {
    private dynamoClient: DynamoDBClient;
    private dynamoDocumentClient: DynamoDBDocument;
    private tableName?: string;

    constructor(dynamoClient?: DynamoDBClient, dynamoDocumentClient?: DynamoDBDocument, tableName?: string) {
        this.dynamoClient = dynamoClient || new DynamoDBClient({ region: process.env.AWS_REGION });
        this.dynamoDocumentClient = dynamoDocumentClient || DynamoDBDocument.from(this.dynamoClient);
        this.tableName = tableName || process.env.TABLE_NAME;
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
}
