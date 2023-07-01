import { Response } from 'express';

export default function errorHandler(err: any, res: Response) {
    console.log(err);
    if (err.response && err.response.data) {
        const { status, data } = err.response;
        if (data.message) {
            return res.status(status).send({ message: data.message });
        } else {
            return res.status(status).send({ message: data });
        }
    }
    return res.status(500).send({ message: 'Something went wrong. Please try again later' });
}
