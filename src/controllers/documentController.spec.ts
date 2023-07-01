import * as http from '../utilities/httpClient';
import { createMockApp } from '../utilities/mockServer';
import request from "supertest";

jest.mock('../utilities/httpClient');

describe('documentController Tests', () => {
    const app = createMockApp();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ListDocuments should return transformed documents', (done) => {
        const mockedResponse = {
            data: {
                SearchResults: {
                    Document: [
                        {
                            $: { DocumentId: "123456" },
                            DocumentNumber: 'doc123',
                            FileName: 'file1.txt',
                            Title: 'Document 1',
                            VersionNumber: "1"
                        },
                    ]
                }
            }
        };
        (http.httpGet as jest.Mock).mockResolvedValueOnce(mockedResponse);

        request(app)
            .get('/document/list/123')
            .expect(200, done)
    });

    it('MoveDocument should move the document to the target project', (done) => {
        const documentId = 'doc123';
        const data = { documentId, docTypeId: 'type1', title: 'Document 1', revision: 'A' };
        const documentContent = {
            data: Buffer.from('Document content here', 'binary'),
            headers: { "content-disposition": `attachment; filename="110kb.pdf"; filename*=UTF-8''110kb.pdf`}
        };
        const newDocument = {
            data: { /* New document data */ }
        };

        (http.httpGetFile as jest.Mock).mockResolvedValueOnce(documentContent);
        (http.httpPost as jest.Mock).mockResolvedValueOnce(newDocument);

        request(app)
            .post('/document/move/111/222')
            .send(data)
            .expect(200, done)
    });

});
