import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	NodeApiError,
} from 'n8n-workflow';

export async function tableOperations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('hubDbApi');
	const baseUrl = 'https://api.hubapi.com/cms/v3/hubdb';
	const operation = this.getNodeParameter('operation', index) as string;
	const resource = this.getNodeParameter('resource', index) as string;

	const headers: IDataObject = {
		'Content-Type': 'application/json',
	};

	// HubSpot API token (pode ser accessToken ou apiKey dependendo da configuração)
	const token = (credentials.accessToken as string) || (credentials.apiKey as string);
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// Portal ID (pode vir das credenciais ou ser necessário adicionar)
	const portalId = (credentials.portalId as string) || (credentials.hubId as string);

	let returnData: IDataObject[] = [];

		try {
		if (operation === 'getAll') {
			const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
			const limit = this.getNodeParameter('limit', index, 50) as number;

			let responseData;
			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			do {
				responseData = await this.helpers.request({
					method: 'GET',
					url: `${baseUrl}/tables`,
					headers,
					qs,
				});

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
			const tableId = this.getNodeParameter('tableId', index) as string;
			const useColumnNames = this.getNodeParameter('useColumnNames', index, false) as boolean;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}
			if (useColumnNames) {
				qs.useColumnNames = 'true';
			}

			const responseData = await this.helpers.request({
				method: 'GET',
				url: `${baseUrl}/tables/${tableId}`,
				headers,
				qs,
			});

			returnData.push(responseData);

		} else if (operation === 'create') {
			const name = this.getNodeParameter('name', index) as string;
			const label = this.getNodeParameter('label', index, '') as string;
			const columns = this.getNodeParameter('columns.column', index, []) as IDataObject[];

			const body: IDataObject = {
				name,
			};

			if (label) {
				body.label = label;
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

			const responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			returnData.push(responseData);

		} else if (operation === 'update') {
			const tableId = this.getNodeParameter('tableId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
			const columns = this.getNodeParameter('columns.column', index, []) as IDataObject[];

			const body: IDataObject = {};

			if (additionalFields.name) {
				body.name = additionalFields.name;
			}
			if (additionalFields.label) {
				body.label = additionalFields.label;
			}
			if (additionalFields.useForPages !== undefined) {
				body.useForPages = additionalFields.useForPages;
			}
			if (additionalFields.allowPublicApiAccess !== undefined) {
				body.allowPublicApiAccess = additionalFields.allowPublicApiAccess;
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

			const responseData = await this.helpers.request({
				method: 'PATCH',
				url: `${baseUrl}/tables/${tableId}`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			returnData.push(responseData);

		} else if (operation === 'delete') {
			const tableId = this.getNodeParameter('tableId', index) as string;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			await this.helpers.request({
				method: 'DELETE',
				url: `${baseUrl}/tables/${tableId}`,
				headers,
				qs,
			});

			returnData.push({ success: true, tableId });

		} else if (operation === 'clone') {
			const tableId = this.getNodeParameter('tableId', index) as string;
			const newTableName = this.getNodeParameter('newTableName', index, '') as string;

			const body: IDataObject = {};
			if (newTableName) {
				body.newTableName = newTableName;
			}

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			const responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/clone`,
				headers,
				qs,
				body: JSON.stringify(body),
			});

			returnData.push(responseData);

		} else if (operation === 'publish') {
			const tableId = this.getNodeParameter('tableId', index) as string;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			const responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/publish`,
				headers,
				qs,
			});

			returnData.push(responseData);

		} else if (operation === 'unpublish') {
			const tableId = this.getNodeParameter('tableId', index) as string;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			const responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/unpublish`,
				headers,
				qs,
			});

			returnData.push(responseData);

		} else if (operation === 'resetDraft') {
			const tableId = this.getNodeParameter('tableId', index) as string;

			const qs: IDataObject = {};
			if (portalId) {
				qs.portalId = portalId;
			}

			const responseData = await this.helpers.request({
				method: 'POST',
				url: `${baseUrl}/tables/${tableId}/reset-draft`,
				headers,
				qs,
			});

			returnData.push(responseData);
		}

		return this.helpers.returnJsonArray(returnData);

	} catch (error) {
		if (this.continueOnFail()) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return [{ json: { error: errorMessage } }];
		}
		throw error;
	}
}

