import { Request, Response } from 'express';
import errorHandler from '../utilities/errorHandler';
import { httpGet } from '../utilities/httpClient';

export const ListProjects = async (req: Request, res: Response) => {
    try {
        const response = await httpGet<any>('/projects');
        const data = response.data.searchResults.map((p: any) => {
            return { "ProjectName": p.projectName, "ProjectId": p.projectID };
        });

        return res.status(200).json(data);
    }
    catch (error) {
        return errorHandler(error, res);
    }
}

export const ListDocTypes = async (req: Request, res: Response) => {
    try {
        const response = await httpGet<any>(`/projects/${req.params.projectId}/register/schema`);

        const docTypesField = response.data.SearchSchemaFields.MultiValueSchemaField.find((sf: any) => sf.Identifier == "doctype");
        const docTypes = docTypesField.SchemaValues.SchemaValue;
        return res.status(200).send(docTypes);
    }
    catch (error) {
        return errorHandler(error, res);
    }
}
