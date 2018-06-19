import { ISlashCommandPreviewItem, SlashCommandPreviewItemType } from '@rocket.chat/apps-ts-definition/slashcommands';

export class GiphyPreview {
    public id: string;
    public title: string;
    public previewUrl: string;
    public originalUrl: string;

    // Returns data we care about from the gif endpoints
    constructor(data?: any) {
        if (data) {
            this.id = data.id as string;
            this.title = data.title as string;
            this.previewUrl = data.images.fixed_height_small.url as string;
            this.originalUrl = data.images.original.url as string;
        }
    }

    public toPreviewItem(): ISlashCommandPreviewItem {
        if (!this.id || !this.previewUrl) {
            throw new Error('Invalid result');
        }

        return {
            id: this.id,
            type: SlashCommandPreviewItemType.IMAGE,
            value: this.previewUrl,
        };
    }
}
