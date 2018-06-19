import {HttpStatusCode, IHttp} from '@rocket.chat/apps-ts-definition/accessors';

import {GiphyPreview} from '../helpers/GiphyPreview';

export class GiphyGetter {
    private readonly url = 'https://api.giphy.com/v1/gifs/';

    public async searchGif(http: IHttp, search: string, key: string, limit: string, rating: string): Promise<Array<GiphyPreview>> {
        // TODO: Maybe error out when they don't provide us with something?

        const response = await http.get(`${ this.url }search?api_key=${ key }&q=${ search }&limit=${ limit }&rating=${ rating }&offset=0&lang=en`);

        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.data) {
            throw new Error('Unable to retrieve gifs.');
        } else if (!Array.isArray(response.data.data)) {
            throw new Error('Data is in a format we don\'t understand.');
        }

        return response.data.data.map((r) => new GiphyPreview(r));
    }

    public async getTrendingGifs(http: IHttp, key: string, limit: string, rating: string): Promise<Array<GiphyPreview>> {
        const response = await http.get(`${ this.url }trending?api_key=${ key }&limit=${ limit }&rating=${ rating }`);

        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.data) {
            throw new Error('Unable to retrieve gifs.');
        } else if (!Array.isArray(response.data.data)) {
            throw new Error('Data is in a format we don\'t understand.');
        }

        return response.data.data.map((r) => new GiphyPreview(r));
    }

    public async getRandomGif(http: IHttp, key: string, rating: string): Promise<Array<GiphyPreview>> {
        const response = await http.get(`${ this.url }random?api_key=${ key }&rating=${ rating }`);

        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.data) {
            throw new Error('Unable to retrieve the gif.');
        } else if (typeof response.data.data !== 'object') {
            throw new Error('Data is in a format we don\'t understand.');
        }

        return response.data.data.map((r) => new GiphyPreview(r));
    }

    public async getSingleGif(http: IHttp, gifId: string, key: string): Promise<Array<GiphyPreview>> {
        const response = await http.get(`${ this.url }${ gifId }?api_key=${ key }`);

        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.data) {
            throw new Error('Unable to retrieve the gif.');
        } else if (typeof response.data.data !== 'object') {
            throw new Error('Data is in a format we don\'t understand.');
        }

        return response.data.data.map((r) => new GiphyPreview(r));
    }
}
