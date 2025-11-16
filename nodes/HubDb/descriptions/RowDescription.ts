import { INodeProperties } from 'n8n-workflow';

export const rowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['row'],
			},
		},
		options: [
			{
				name: 'Batch Clone',
				value: 'batchClone',
				description: 'Clone multiple rows',
				action: 'Batch clone rows',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple rows',
				action: 'Batch create rows',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple rows',
				action: 'Batch delete rows',
			},
			{
				name: 'Batch Read',
				value: 'batchRead',
				description: 'Read multiple rows',
				action: 'Batch read rows',
			},
			{
				name: 'Batch Replace',
				value: 'batchReplace',
				description: 'Replace multiple rows',
				action: 'Batch replace rows',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple rows',
				action: 'Batch update rows',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new row',
				action: 'Create a row',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a row',
				action: 'Delete a row',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific row',
				action: 'Get a row',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many rows from a table',
				action: 'Get many rows',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a row',
				action: 'Update a row',
			},
		],
		default: 'getAll',
	},
];

export const rowFields: INodeProperties[] = [
	{
		displayName: 'Table ID',
		name: 'tableId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
			},
		},
		default: '',
		description: 'The ID of the table',
	},
	{
		displayName: 'Row ID',
		name: 'rowId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the row',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Sort By',
		name: 'sort',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Column name to sort by (e.g., "columnName" or "-columnName" for descending)',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Query string to filter rows (e.g., "columnName__eq=value")',
	},
	{
		displayName: 'Values',
		name: 'values',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['create', 'update'],
			},
		},
		default: '{}',
		description: 'JSON object with column values',
	},
	{
		displayName: 'Use Column Names',
		name: 'useColumnNames',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['get', 'getAll', 'create', 'update'],
			},
		},
		default: false,
		description: 'Whether to use column names instead of IDs',
	},
	{
		displayName: 'Rows',
		name: 'rows',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['batchCreate', 'batchUpdate', 'batchReplace'],
			},
		},
		default: '[]',
		description: 'JSON array of row objects',
	},
	{
		displayName: 'Row IDs',
		name: 'rowIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['row'],
				operation: ['batchRead', 'batchDelete', 'batchClone'],
			},
		},
		default: '',
		description: 'Comma-separated list of row IDs',
	},
];