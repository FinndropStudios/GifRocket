import {IHttp, IModify, IPersistence, IRead} from '@rocket.chat/apps-ts-definition/accessors';
import {
    ISlashCommand,
    ISlashCommandPreview,
    ISlashCommandPreviewItem,
    SlashCommandContext,
} from '@rocket.chat/apps-ts-definition/slashcommands';

import {GifRocketApp} from '../GifRocketApp';
import {GiphyPreview} from '../helpers/GiphyPreview';

export class GiphyCommand implements ISlashCommand {
    public command: string;
    public i18nParamsExample: string;
    public i18nDescription: string;
    public providesPreview: boolean;

    constructor(private readonly app: GifRocketApp) {
        this.command = 'giphy';
        this.i18nParamsExample = '';
        this.i18nDescription = 'Giphy_Command_Description';
        this.providesPreview = true;
    }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        let gifs: Array<GiphyPreview>;
        let items: Array<ISlashCommandPreviewItem>;

        this.app.getLogger().log('executor');

        if (!context.getArguments() || context.getArguments()[0] === 'random') {
            this.app.getLogger().log('command: random');
            try {
                gifs = await this.app.getGiphyGetter().getRandomGif(http, this.app.getGiphyApiKey(), this.app.getGiphyRating());
                items = gifs.map((gif) => gif.toPreviewItem());
            } catch (e) {
                this.app.getLogger().error('Failed on something:', e);
            }
        } else if (context.getArguments()[0] === 'trending') {
            this.app.getLogger().log('command: trending');
            try {
                gifs = await this.app.getGiphyGetter().getTrendingGifs(http, this.app.getGiphyApiKey(), this.app.getResultLimit(), this.app.getGiphyRating());
                items = gifs.map((gif) => gif.toPreviewItem());
            } catch (e) {
                this.app.getLogger().error('Failed on something:', e);
            }
        } else if (context.getArguments()[0] === 'id') {
            this.app.getLogger().log('command: id');
            try {
                const query: string = context.getArguments().slice(1).join(' ');
                gifs = await this.app.getGiphyGetter().getSingleGif(http, query, this.app.getGiphyApiKey());
                items = gifs.map((gif) => gif.toPreviewItem());
            } catch (e) {
                this.app.getLogger().error('Failed on something:', e);
            }
        } else {
            this.app.getLogger().log('command: search');
            try {
                gifs = await this.app.getGiphyGetter().searchGif(http, context.getArguments().join(' '), this.app.getGiphyApiKey(), this.app.getResultLimit(),
                    this.app.getGiphyRating());
                items = gifs.map((gif) => gif.toPreviewItem());
            } catch (e) {
                this.app.getLogger().error('Failed on something:', e);
            }
        }
    }

    public async previewer(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<ISlashCommandPreview> {
        let gifs: Array<GiphyPreview>;
        let items: Array<ISlashCommandPreviewItem>;

        this.app.getLogger().log('previewer');

        try {
            gifs = await this.app.getGiphyGetter().searchGif(http, context.getArguments().join(' '), this.app.getGiphyApiKey(),
                this.app.getResultLimit(), this.app.getGiphyRating());
            items = gifs.map((gif) => gif.toPreviewItem());
        } catch (e) {
            this.app.getLogger().error('Failed on something:', e);
            return {
                i18nTitle: 'TODO ERROR',
                items: [],
            };
        }

        return {
            i18nTitle: 'TODO',
            items,
        };
    }

    public async executePreviewItem(item: ISlashCommandPreviewItem, context: SlashCommandContext, read: IRead,
                                    modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const builder = modify.getCreator().startMessage().setSender(context.getSender()).setRoom(context.getRoom());

        this.app.getLogger().log('executePreviewItem');

        try {
            this.app.getLogger().log('get single gif by ID');

            const gif = await this.app.getGiphyGetter().getSingleGif(http, item.id, this.app.getGiphyApiKey());
            builder.addAttachment({
                title: {
                    value: gif[0].title,
                },
                imageUrl: gif[0].originalUrl,
            });

            await modify.getCreator().finish(builder);
        } catch (e) {
            this.app.getLogger().error('Failed getting a gif', e);
            builder.setText('An error occured when trying to send the gif :disappointed_relieved:');

            modify.getNotifer().notifyUser(context.getSender(), builder.getMessage());
        }
    }
}
