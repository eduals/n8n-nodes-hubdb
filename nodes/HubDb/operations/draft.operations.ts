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

export async function draftTableOperations(
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
		if (operation === 'get') {
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
				url: `${baseUrl}/tables/${tableId}/draft`,
				headers,
				qs,
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'update') {
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
			const columns = this.getNodeParameter('columns.column', index, []) as IDataObject[];

			const body: IDataObject = {};

			if (additionalFields.name) {
				body.name = additionalFields.name;
			}
			if (additionalFields.label) {
				body.label = additionalFields.label;
			}

			if (columns.length > 0) {
				body.columns = columns.map((col) => {
					const column: IDataObject = {
						name: col.name,
						type: col.type,
					};
					if (col.label) {
						column.label = col.label;
					}
					if (col.options && (col.type === 'SELECT' || col.type === 'MULTISELECT')) {
						column.options = (col.options as string).split(',').map((opt: string) => ({
							label: opt.trim(),
							value: opt.trim().toLowerCase().replace(/\s+/g, '_'),
						}));
					}
					return column;
				});
			}

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			let responseData = await this.helpers.request({
				method: 'PATCH',
				url: `${baseUrl}/tables/${tableId}/draft`,
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

export async function draftRowOperations(
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
		if (operation === 'get') {
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
				url: `${baseUrl}/tables/${tableId}/rows/${rowId}/draft`,
				headers,
				qs,
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

		} else if (operation === 'update') {
			const rowId = this.getNodeParameter('rowId', index) as string;
			const valuesJson = this.getNodeParameter('values', index) as string;

			let values: IDataObject;
			try {
				values = typeof valuesJson === 'string' ? JSON.parse(valuesJson) : valuesJson;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Invalid JSON in values field';
				throw new NodeApiError(this.getNode(), { message: errorMessage });
			}

			const body: IDataObject = { values };

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			let responseData = await this.helpers.request({
				method: 'PATCH',
				url: `${baseUrl}/tables/${tableId}/rows/${rowId}/draft`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			// Parse JSON string if needed
			responseData = parseJsonResponse(responseData);
			returnData.push(responseData);

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
				url: `${baseUrl}/tables/${tableId}/rows/draft/batch/create`,
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
				url: `${baseUrl}/tables/${tableId}/rows/draft/batch/read`,
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
				url: `${baseUrl}/tables/${tableId}/rows/draft/batch/update`,
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
				url: `${baseUrl}/tables/${tableId}/rows/draft/batch/purge`,
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
				url: `${baseUrl}/tables/${tableId}/rows/draft/batch/clone`,
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
				url: `${baseUrl}/tables/${tableId}/rows/draft/batch/replace`,
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

