import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	tableOperations,
	tableFields,
} from './descriptions/TableDescription';

import {
	rowOperations,
	rowFields,
} from './descriptions/RowDescription';

import {
	draftTableOperations,
	draftTableFields,
	draftRowOperations,
	draftRowFields,
} from './descriptions/DraftDescription';

import * as tableOps from './operations/table.operations';
import * as rowOps from './operations/row.operations';
import * as draftOps from './operations/draft.operations';

export class HubDb implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HubSpot HubDB',
		name: 'hubDb',
		icon: 'file:hubspot.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with HubSpot HubDB API v3',
		defaults: {
			name: 'HubSpot HubDB',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'hubDbApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Table',
						value: 'table',
					},
					{
						name: 'Row',
						value: 'row',
					},
					{
						name: 'Draft Table',
						value: 'draftTable',
					},
					{
						name: 'Draft Row',
						value: 'draftRow',
					},
				],
				default: 'table',
			},
			...tableOperations,
			...tableFields,
			...rowOperations,
			...rowFields,
			...draftTableOperations,
			...draftTableFields,
			...draftRowOperations,
			...draftRowFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'table') {
					const result = await tableOps.tableOperations.call(this, i);
					returnData.push(...result);
				} else if (resource === 'row') {
					const result = await rowOps.rowOperations.call(this, i);
					returnData.push(...result);
				} else if (resource === 'draftTable') {
					const result = await draftOps.draftTableOperations.call(this, i);
					returnData.push(...result);
				} else if (resource === 'draftRow') {
					const result = await draftOps.draftRowOperations.call(this, i);
					returnData.push(...result);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: {
							error: errorMessage,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

