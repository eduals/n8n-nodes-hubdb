import { INodeProperties } from 'n8n-workflow';

export const draftTableOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['draftTable'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve draft version of a table',
				action: 'Get draft table',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update one or more draft tables',
				action: 'Update draft table',
			},
		],
		default: 'get',
	},
];

export const draftTableFields: INodeProperties[] = [
	{
		displayName: 'Table ID',
		name: 'tableId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['draftTable'],
			},
		},
		default: '',
		placeholder: 'e.g. 12345678',
		description: 'The ID of the table',
	},
	{
		displayName: 'Use Column Names',
		name: 'useColumnNames',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['draftTable'],
				operation: ['get'],
			},
		},
		default: false,
		description: 'Whether to use column names instead of IDs',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['draftTable'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Columns',
		name: 'columns',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['draftTable'],
				operation: ['update'],
			},
		},
		default: {},
		placeholder: 'Add Column',
		options: [
			{
				displayName: 'Column',
				name: 'column',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'e.g. columnName',
					},
					{
						displayName: 'Label',
						name: 'label',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'BOOLEAN',
								value: 'BOOLEAN',
							},
							{
								name: 'DATE',
								value: 'DATE',
							},
							{
								name: 'FILE',
								value: 'FILE',
							},
							{
								name: 'IMAGE',
								value: 'IMAGE',
							},
							{
								name: 'MULTISELECT',
								value: 'MULTISELECT',
							},
							{
								name: 'NUMBER',
								value: 'NUMBER',
							},
							{
								name: 'SELECT',
								value: 'SELECT',
							},
							{
								name: 'TEXT',
								value: 'TEXT',
							},
							{
								name: 'URL',
								value: 'URL',
							},
						],
						default: 'TEXT',
					},
					{
						displayName: 'Options',
						name: 'options',
						type: 'string',
						displayOptions: {
							show: {
								type: ['SELECT', 'MULTISELECT'],
							},
						},
						default: '',
						placeholder: 'e.g. Option1, Option2, Option3',
						description: 'Comma-separated list of options for SELECT/MULTISELECT types',
					},
				],
			},
		],
	},
];

export const draftRowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['draftRow'],
			},
		},
		options: [
			{
				name: 'Batch Clone',
				value: 'batchClone',
				description: 'Clone multiple draft rows in a table',
				action: 'Batch clone draft rows',
			},
			{
				name: 'Batch Create',
				value: 'batchCreate',
				description: 'Create multiple draft rows in a table',
				action: 'Batch create draft rows',
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: 'Delete multiple draft rows permanently',
				action: 'Batch delete draft rows',
			},
			{
				name: 'Batch Read',
				value: 'batchRead',
				description: 'Retrieve multiple draft rows from a table',
				action: 'Batch read draft rows',
			},
			{
				name: 'Batch Replace',
				value: 'batchReplace',
				description: 'Replace multiple draft rows in a table',
				action: 'Batch replace draft rows',
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: 'Update multiple draft rows inside a table',
				action: 'Batch update draft rows',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve draft version of a row from a table',
				action: 'Get draft row',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a draft row inside a table',
				action: 'Update draft row',
			},
		],
		default: 'get',
	},
];

export const draftRowFields: INodeProperties[] = [
	{
		displayName: 'Table ID',
		name: 'tableId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['draftRow'],
			},
		},
		default: '',
		placeholder: 'e.g. 12345678',
		description: 'The ID of the table',
	},
	{
		displayName: 'Row ID',
		name: 'rowId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['draftRow'],
				operation: ['get', 'update'],
			},
		},
		default: '',
		placeholder: 'e.g. 98765432',
		description: 'The ID of the row',
	},
	{
		displayName: 'Values',
		name: 'values',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['draftRow'],
				operation: ['update'],
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
				resource: ['draftRow'],
				operation: ['get', 'batchCreate', 'batchRead', 'batchUpdate'],
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
				resource: ['draftRow'],
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
				resource: ['draftRow'],
				operation: ['batchRead', 'batchDelete', 'batchClone'],
			},
		},
		default: '',
		placeholder: 'e.g. 123, 456, 789',
		description: 'Comma-separated list of row IDs',
	},
];