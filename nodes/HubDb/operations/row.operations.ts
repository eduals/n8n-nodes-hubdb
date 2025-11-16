import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	NodeApiError,
} from 'n8n-workflow';

// Helper function to parse JSON strings to objects
function parseJsonResponse(data: any): any {
	if (typeof data === 'string') {
		try {
			return JSON.parse(data);
		} catch {
			return data;
		}
	}
	return data;
}

export async function rowOperations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('hubDbApi');
	const baseUrl = 'https://api.hubapi.com/cms/v3/hubdb';
	const operation = this.getNodeParameter('operation', index) as string;
	const tableId = this.getNodeParameter('tableId', index) as string;

	// HubSpot API token (pode ser accessToken ou apiKey dependendo da configuração)
	const token = (credentials.accessToken as string) || (credentials.apiKey as string);
	if (!token) {
		throw new NodeApiError(this.getNode(), {
			message: 'Missing authentication credentials. Please configure API Key or Access Token in node credentials.',
		});
	}

	const headers: IDataObject = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	// Portal ID (pode vir das credenciais ou ser necessário adicionar)
	const portalId = (credentials.portalId as string) || (credentials.hubId as string);

	let returnData: IDataObject[] = [];

	try {
		if (operation === 'getAll') {
			const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
			const limit = this.getNodeParameter('limit', index, 100) as number;
			const sort = this.getNodeParameter('sort', index, '') as string;
			const query = this.getNodeParameter('query', index, '') as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (sort) {
				qs.sort = sort;
			}
			if (query) {
				qs.q = query;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			let responseData;
			do {
				responseData = await this.helpers.request({
					method: 'GET',
					url: `${baseUrl}/tables/${tableId}/rows`,
					headers,
					qs,
				});

				// Parse JSON string if needed
				responseData = parseJsonResponse(responseData);

				if (responseData.results) {
					returnData.push(...responseData.results);
				} else {
					returnData.push(...(Array.isArray(responseData) ? responseData : [responseData]));
				}

				if (!returnAll && returnData.length >= limit) {
					returnData = returnData.slice(0, limit);
					break;
				}

				if (responseData.paging?.next?.after) {
					qs.after = responseData.paging.next.after;
				} else {
					break;
				}
			} while (responseData.paging?.next?.after);

		} else if (operation === 'get') {
			const rowId = this.getNodeParameter('rowId', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			let responseData = await this.helpers.request({
				method: 'GET',
				url: `${baseUrl}/tables/${tableId}/rows/${rowId}`,
				headers,
				qs,
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'create') {
			const valuesJson = this.getNodeParameter('values', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			let values: IDataObject;
			try {
				values = typeof valuesJson === 'string' ? JSON.parse(valuesJson) : valuesJson;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Invalid JSON in values field';
				throw new NodeApiError(this.getNode(), { message: errorMessage });
			}

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			const body: IDataObject = { values };

			let responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/rows`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'update') {
			const rowId = this.getNodeParameter('rowId', index) as string;
			const valuesJson = this.getNodeParameter('values', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			let values: IDataObject;
			try {
				values = typeof valuesJson === 'string' ? JSON.parse(valuesJson) : valuesJson;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Invalid JSON in values field';
				throw new NodeApiError(this.getNode(), { message: errorMessage });
			}

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			const body: IDataObject = { values };

			let responseData = await this.helpers.request({
				method: 'PATCH',
				url: `${baseUrl}/tables/${tableId}/rows/${rowId}`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'delete') {
			const rowId = this.getNodeParameter('rowId', index) as string;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			await this.helpers.request({
				method: 'DELETE',
				url: `${baseUrl}/tables/${tableId}/rows/${rowId}`,
				headers,
				qs,
			});

			returnData.push({ deleted: true });

		} else if (operation === 'batchCreate') {
			const rowsJson = this.getNodeParameter('rows', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			let rows: IDataObject[];
			try {
				rows = typeof rowsJson === 'string' ? JSON.parse(rowsJson) : rowsJson;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Invalid JSON in rows field';
				throw new NodeApiError(this.getNode(), { message: errorMessage });
			}

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			const body: IDataObject = { inputs: rows };

			let responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/rows/batch/create`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'batchUpdate') {
			const rowsJson = this.getNodeParameter('rows', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			let rows: IDataObject[];
			try {
				rows = typeof rowsJson === 'string' ? JSON.parse(rowsJson) : rowsJson;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Invalid JSON in rows field';
				throw new NodeApiError(this.getNode(), { message: errorMessage });
			}

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			const body: IDataObject = { inputs: rows };

			let responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/rows/batch/update`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'batchRead') {
			const rowIdsStr = this.getNodeParameter('rowIds', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			const rowIds = rowIdsStr.split(',').map((id: string) => id.trim());

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			const body: IDataObject = { inputs: rowIds };

			let responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/rows/batch/read`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'batchDelete') {
			const rowIdsStr = this.getNodeParameter('rowIds', index) as string;

			const rowIds = rowIdsStr.split(',').map((id: string) => id.trim());

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			const body: IDataObject = { inputs: rowIds };

			let responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/rows/batch/purge`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'batchClone') {
			const rowIdsStr = this.getNodeParameter('rowIds', index) as string;

			const rowIds = rowIdsStr.split(',').map((id: string) => id.trim());

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			const body: IDataObject = { inputs: rowIds };

			let responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/rows/batch/clone`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'batchReplace') {
			const rowsJson = this.getNodeParameter('rows', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			let rows: IDataObject[];
			try {
				rows = typeof rowsJson === 'string' ? JSON.parse(rowsJson) : rowsJson;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Invalid JSON in rows field';
				throw new NodeApiError(this.getNode(), { message: errorMessage });
			}

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			const body: IDataObject = { inputs: rows };

			let responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/rows/batch/replace`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);
		}

		return this.helpers.returnJsonArray(returnData);

	} catch (error) {
		if (this.continueOnFail()) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return [{ json: { error: errorMessage } }];
		}
		
		// Improve error handling according to n8n guidelines
		if (error instanceof NodeApiError) {
			throw error;
		}
		
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeApiError(this.getNode(), { message: errorMessage });
	}
}

