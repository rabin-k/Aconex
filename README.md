# Transfer documents between 2 Aconex projects

## Description
This project can be used to transfer documents between two API enabled Aconex projects.
A sample demo can be seen by running the project. The landing page serves `index.html` which is a simple web-page written using HTML, bootstrap and jQuery that allows to select the source and destination project, other dependent fields and finally, move the document to destination project.

url: `/document/move/{sourceProjectId}/{destinationProjectId}`
method: `post`
sample payload:
```json
{
	"documentId": "123456789",
	"docTypeId": "1234",
	"title": "Document 1",
	"revision": "10"
}
```

## Other Routes
- `/project/list`: List all the available projects
- `/project/doctype/{projectId}`: List the document types for the project
- `/document/list/{projectId}`: List documents available in the project

## Limitations
- `/project/list` lists all the project whether they are API enabled or not
- Only doctype is included in this project but there could be other required fields depending on projects which could be retrieved from document schema and populated accordingly.
- As of now, `/document/list/{projectId}` retrieves only first 500 documents (This could be enhanced by incorporating a auto-complete field which filters the data based on what user types)
- The document is copied to destination project but is not deleted from source project (No API was found in the documentation for document deletion).

## Execution
- Run the project (dev): `npm run start`
- Build: `npm run build`
- Start the project (prod): `npm run start:prod`
- Run unit tests: `npm run test:unit`
- Run integration tests: `npm run test:int`

** `npm run test:cov` to calculate test coverage

## Dependencies
|Package|Version|
|-|-|
|`axios`|`^0.21.1`|
|`bootstrap`|`^5.3.0`|
|`content-disposition`|`^0.5.4`|
|`express`|`^4.18.2`|
|`jquery`|`^3.7.0`|
|`nodemon`|`^2.0.22`|
|`ts-node`|`^10.9.1`|
|`tsconfig-paths`|`^4.2.0`|
|`tslint`|`^6.1.3`|
|`typescript`|`^5.1.5`|
|`xml2js`|`^0.6.0`|

## Dev Dependencies
|Package|Version|
|-|-|
|`@types/content-disposition`|`^0.5.5`|
|`@types/express`|`^4.17.17`|
|`@types/jest`|`^29.5.2`|
|`@types/moxios`|`^0.4.15`|
|`@types/node`|`^20.3.2`|
|`@types/supertest`|`^2.0.12`|
|`@types/xml2js`|`^0.4.11`|
|`jest`|`^29.5.0`|
|`moxios`|`^0.4.0`|
|`supertest`|`^6.3.3`|
|`ts-jest`|`^29.1.0`|

