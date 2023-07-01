import { Request, Response } from 'express';
import errorHandler from '../utilities/errorHandler';
import { httpGet, httpPost, httpGetFile } from '../utilities/httpClient';
import * as contentDisposition from 'content-disposition';
import { GenerateGuid } from '../utilities/utils';

export const ListDocuments = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId
        const response = await httpGet<any>(`/projects/${projectId}/register?search_type=PAGED&page_size=500&return_fields=title,filename,docno,versionnumber&show_document_history=true`);
        const transformed = response.data.SearchResults.Document.reduce((g: any, doc: any) => {
            const { DocumentNumber, FileName, Title, VersionNumber } = doc;
            const existingDoc = g.find((item: any) => item.documentNumber === doc.DocumentNumber);
            if (existingDoc) {
                existingDoc.versions.push({ documentId: doc.$.DocumentId, fileName: FileName, version: VersionNumber });
            } else {
                g.push({ documentNumber: DocumentNumber, title: Title, versions: [{ documentId: doc.$.DocumentId, fileName: FileName, version: VersionNumber }] });
            }
            return g;
        }, []);

        return res.status(200).json(transformed);
    }
    catch (error) {
        return errorHandler(error, res);
    }
}

export const MoveDocument = async (req: Request, res: Response) => {
    const { sourceProjectId, destinationProjectId } = req.params;
    if (sourceProjectId === destinationProjectId)
        return res.status(200).json({ message: 'Document moved successfully' });

    try {
        const data = req.body;
        // Fetch the document details
        const documentContent = await GetDocumentDetails(sourceProjectId, data.documentId);

        // Create the Document in the Target Project
        const newDocument = await CreateDocument(destinationProjectId, data, documentContent);

        //// Delete the Document from the Source Project
        //await deleteDocument(sourceProjectId, documentId);
        return res.status(200).json({ message: 'Document moved successfully', data: newDocument.data });
    }
    catch (error) {
        console.log(error);
        return errorHandler(error, res);
    }
}

// Function to retrieve document details
export const GetDocumentDetails = async(projectId: string, documentId: string) => {
    const response = await httpGetFile<any>(`/projects/${projectId}/register/${documentId}/markedup?sizeForceFetch=true`);
    return response;
}

// Function to create the document in the target project
const CreateDocument = async(targetProjectId: string, data: any, document: any) => {
    const fileName = GetFileName(document);

    const boundary = "fileBoundary"

    const xmldata = `<Document>
        <DocumentNumber>${GenerateGuid()}</DocumentNumber>
        <DocumentTypeId>${data.docTypeId}</DocumentTypeId>
        <Title>${data.title}</Title>
        <Revision>${data.revision}</Revision>
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

// Function to delete the document from the source project
async function DeleteDocument(sourceProjectId: string, documentId: string) {
    // Could not find any API to delete document
}

const GetFileName = (document: any): string => {
    let fileName: string = "";
    if (document.headers['content-disposition']) {
        const disposition: contentDisposition.ContentDisposition = contentDisposition.parse(document.headers['content-disposition']);
        if (disposition.parameters && disposition.parameters.filename) {
            fileName = disposition.parameters.filename;
        }
    }
    else
        fileName = GenerateGuid();
    return fileName
}
