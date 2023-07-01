import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import xml2js from 'xml2js';

const BASE_URL: String = "https://ea1.aconex.com/api";
const credentials = "poleary:Auth3nt1c"

const base64Cred = () => Buffer.from(credentials).toString('base64');

export const httpGet = async <T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
            ...config?.headers,
            Authorization: `Basic ${base64Cred()}`,
        },
    };

    const response = await axios.get(BASE_URL + url, requestConfig);
    const data = await parseResponse(response);
    response.data = data
    return response as any;
};

export const httpGetFile = async <T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        ...config,
        responseType: "arraybuffer",
        headers: {
            ...config?.headers,
            Authorization: `Basic ${base64Cred()}`,
        },
    };

    const response = await axios.get(BASE_URL + url, requestConfig);
    const data = await parseResponse(response);
    response.data = data
    return response as any;
};

export const httpPost = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
            ...config?.headers,
            Authorization: `Basic ${base64Cred()}`,
        },
    };

    const response = await axios.post(BASE_URL + url, data, requestConfig);
    const parsedData = await parseResponse(response);
    response.data = parsedData
    return response as any;
};

const parseResponse = async (response: AxiosResponse) => {
    if (response?.headers['content-type']?.includes('xml')) {
        return await xml2js.parseStringPromise(response.data, { explicitArray: false, explicitRoot: false });
    }
    return response.data;
};
