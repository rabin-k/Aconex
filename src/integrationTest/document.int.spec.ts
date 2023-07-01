import request from "supertest";
import { GetDocumentDetails } from "../controllers/documentController";
import { httpPost } from '../utilities/httpClient';
import { createMockApp } from "../utilities/mockServer";
import { GenerateGuid } from '../utilities/utils';

// Source project (Breeze Tower - Phase 3)
const sourceProjectId = "1879048422";

// Source project (Hotel VIP Resort & Spa)
const destinationProjectId = "1879048400";

describe('documentController integration Tests', () => {
    const app = createMockApp();

    it('Should create documents in source and move to target', async () => {
        // Create documents in the source project
        const newDocumentIds = await CreateTestDocuments()
        for (let [_, documentId] of newDocumentIds.entries()) {
            const data = {
                documentId: documentId,
                docTypeId: '1879048435',
                title: `Moved Document (Prev document Id: ${documentId}`,
                revision: 'rev - 2'
            };

            const response = await request(app)
                .post(`/document/move/${sourceProjectId}/${destinationProjectId}`)
                .send(data);

            const docResponse = await GetDocumentDetails(destinationProjectId, response.body.data.RegisterDocument);
            const docData = Buffer.from(docResponse.data, "binary").toString();

            expect(docResponse.status).toBe(200);
            expect(docData).toContain("Integration Test Document");
        }
    });
});

const CreateTestDocuments = async (count: number = 5): Promise<string[]> => {
    const newDocumentIds: string[] = [];

    for (let i = 1; i <= count; i++) {
        const fileName = `Int Test File - ${i}`;
        const data = {
            docTypeId: 1879048228, // Technical Data
            title: `Document ${i}`,
            revision: `rev - 1`
        };
        const document = {
            data: Buffer.from(`Integration Test Document ${i}`, 'binary'),
            headers: { "content-disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${fileName}` }
        };

        const resp = await CreateDocument(sourceProjectId, data, document, fileName);
        newDocumentIds.push(resp.data.RegisterDocument);
    }
    return newDocumentIds;
}

const CreateDocument = async (targetProjectId: string, data: any, document: any, fileName: string) => {
    const boundary = "fileBoundary"

    const xmldata = `<Document>
        <DocumentNumber>${GenerateGuid()}</DocumentNumber>
        <DocumentTypeId>${data.docTypeId}</DocumentTypeId>
        <Title>${data.title}</Title>
        <Revision>${data.revision}</Revision>
        <Discipline>Acoustics</Discipline>
        <DocumentStatusId>1879048345</DocumentStatusId>
        <HasFile>true</HasFile>
    </Document>`;

    const fileData = Buffer.from(document.data, "binary").toString("base64");

    const postData = Buffer.concat([
        Buffer.from(`--${boundary}\r\n\r\n`),
        Buffer.from(xmldata),
        Buffer.from(`\r\n--${boundary}\r\nX-Filename: ${fileName}\r\n\r\n`),
        Buffer.from(fileData),
        Buffer.from(`\r\n\r\n--${boundary}--`),
    ]);

    const headers = {
        'Content-Type': `multipart/mixed; boundary="${boundary}"`,
        'Content-Length': postData.length,
    };

    const response = await httpPost<any>(`/projects/${targetProjectId}/register`, postData, { headers: headers });
    return response;
}
