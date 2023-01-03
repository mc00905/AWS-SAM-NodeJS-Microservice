import type { Handler } from 'aws-lambda';

enum Effect {
    allow = 'Allow',
    deny = 'Deny',
}

const generatePolicy = (principalId: string, effect: Effect, resource: string) => {
    const context = {};
    const pol = {
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Resource: resource + `users/${principalId}/*`,
                    Effect: effect,
                },
            ],
        },
        principalId,
        context,
    };
    return pol;
};
export const authorize: Handler = async (event, context, callback) => {
    const token = event.authorizationToken.substring(7);
    const tmp = event.methodArn.split(':');
    const apiGatewayArnTmp = tmp[5].split('/');
    const baseApiArn =
        'arn:aws:execute-api:' +
        tmp[3] +
        ':' +
        tmp[4] +
        ':' +
        apiGatewayArnTmp[0] +
        '/' +
        apiGatewayArnTmp[1] +
        '/' +
        '*' +
        '/';
    switch (token) {
        case 'allow':
            return generatePolicy('user', Effect.allow, baseApiArn);
        case 'deny':
            return generatePolicy('user', Effect.deny, '*');
        default:
            callback('Unauthorized');
    }
};
