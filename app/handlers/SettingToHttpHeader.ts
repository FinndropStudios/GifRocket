import {
    IHttpPreRequestHandler,
    IHttpRequest,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-ts-definition/accessors';

export class SettingToHttpHeader implements IHttpPreRequestHandler {
    private readonly apiHeaderKey: string;

    constructor(private readonly apiKeyId: string) {
        this.apiHeaderKey = 'apiKey';
    }

    // tslint:disable-next-line:max-line-length
    public async executePreHttpRequest(url: string, request: IHttpRequest, read: IRead, persistence: IPersistence): Promise<IHttpRequest> {
        const apiKey = await read.getEnvironmentReader().getSettings().getValueById(this.apiKeyId);

        if (typeof apiKey !== 'string' || apiKey.length === 0) {
            throw new Error('Invalid Giphy Api Key!');
        }

        if (typeof request.headers === 'undefined') {
            request.headers = { };
        }

        request.headers[this.apiHeaderKey] = apiKey;

        return request;
    }
}
