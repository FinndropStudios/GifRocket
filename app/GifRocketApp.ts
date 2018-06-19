import {
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IRead,
} from '@rocket.chat/apps-ts-definition/accessors';
import {App} from '@rocket.chat/apps-ts-definition/App';
import {IAppInfo} from '@rocket.chat/apps-ts-definition/metadata';
import {ISetting, SettingType} from '@rocket.chat/apps-ts-definition/settings';

import {GiphyCommand} from './commands/GiphyCommand';
import {GiphyGetter} from './getters/GiphyGetter';
import {SettingToHttpHeader} from './handlers/SettingToHttpHeader';

export class GifRocketApp extends App {
    private readonly apiKeySettingid: string;
    private readonly resultLimit: string;
    private readonly giphyRating: string;
    private readonly giphyGetter: GiphyGetter;

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
        this.apiKeySettingid = 'api-key';
        this.resultLimit = 'result-limit';
        this.giphyRating = 'giphy-rating';
        this.giphyGetter = new GiphyGetter();
    }

    public getGiphyGetter(): GiphyGetter {
        return this.giphyGetter;
    }

    public getGiphyApiKey(): string {
        return this.apiKeySettingid;
    }

    public getResultLimit(): string {
        return this.resultLimit;
    }

    public getGiphyRating(): string {
        return this.giphyRating;
    }

    public async onEnable(environmentRead: IEnvironmentRead, configModify: IConfigurationModify): Promise<boolean> {
        const setting = await environmentRead.getSettings().getValueById(this.apiKeySettingid);
        if (!setting) {
            await configModify.slashCommands.disableSlashCommand('guggy');
        }

        return true;
    }

    // tslint:disable-next-line:max-line-length
    public async onSettingUpdated(setting: ISetting, configModify: IConfigurationModify, read: IRead, http: IHttp): Promise<void> {
        switch (setting.id) {
            case this.apiKeySettingid:
                await this.handleApiKeySettingHandle(setting, configModify, http);
                break;
        }
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configuration.settings.provideSetting({
            id: this.apiKeySettingid,
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'Giphy_Api_Key',
            i18nDescription: 'Giphy_Api_Key_Description',
        });

        configuration.http.provideDefaultHeader('Content-Type', 'application/json');
        configuration.http.providePreRequestHandler(new SettingToHttpHeader(this.apiKeySettingid));

        configuration.slashCommands.provideSlashCommand(new GiphyCommand(this));
    }

    private async handleApiKeySettingHandle(setting: ISetting, configModify: IConfigurationModify, http: IHttp): Promise<void> {
        if (setting.value) {
            try {
                this.giphyGetter.getSingleGif(http, 'testing', this.apiKeySettingid);
                this.getLogger().log('Enabling the slash command.');
                await configModify.slashCommands.enableSlashCommand('giphy');
            } catch (e) {
                // The api key is not valid
                this.getLogger().log('Disabling the slash command because the api key isnt valid.');
                await configModify.slashCommands.disableSlashCommand('giphy');
            }
        } else {
            // There is no value, so remove the command
            this.getLogger().log('Disabling the slash command because there is no setting value defined.');
            await configModify.slashCommands.disableSlashCommand('giphy');
        }
    }
}
