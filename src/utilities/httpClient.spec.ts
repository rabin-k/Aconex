import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { httpGet, httpPost } from './httpClient';

jest.mock('axios');

describe('HTTP Requests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send a GET request', async () => {
        const xmlResponse = '<Books><Book><Author>Rabin</Author><Published>2020</Published></Book><Book><Author>Rabin</Author><Published>2021</Published></Book></Books>';
        const jsonResponse = { "Book": [{ "Author": "Rabin", "Published": "2020" }, { "Author": "Rabin", "Published": "2021" }] };
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: xmlResponse, headers: { "content-type": "application/xml" } });
        const response = await httpGet<AxiosResponse>('/some-url');
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
            'https://ea1.aconex.com/api/some-url',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringContaining('Basic'),
                }),
            })
        );
        expect(response.data).toEqual(jsonResponse);
    });

    it('should send a POST request', async () => {
        const xmlResponse = '<message><status>Success</status><error>0</error></message>';
        const jsonResponse = { "status": "Success", "error": "0" };
        const postData = { foo: 'bar' };
        (axios.post as jest.Mock).mockResolvedValueOnce({ data: xmlResponse, headers: { "content-type": "application/xml" } });

        const response = await httpPost<AxiosResponse>('/another-url', postData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
            'https://ea1.aconex.com/api/another-url',
            postData,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringContaining('Basic'),
                }),
            })
        );
        expect(response.data).toEqual(jsonResponse);
    });
});


