import { INodeProperties } from 'n8n-workflow';

export const tableOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['table'],
			},
		},
		options: [
			{
				name: 'Clone',
				value: 'clone',
				description: 'Clone a table',
				action: 'Clone a table',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new table',
				action: 'Create a table',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a table',
				action: 'Delete a table',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific table',
				action: 'Get a table',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tables',
				action: 'Get many tables',
			},
			{
				name: 'Publish',
				value: 'publish',
				description: 'Publish a draft table',
				action: 'Publish a table',
			},
			{
				name: 'Reset Draft',
				value: 'resetDraft',
				description: 'Reset draft table to published version',
				action: 'Reset draft table',
			},
			{
				name: 'Unpublish',
				value: 'unpublish',
				description: 'Unpublish a table',
				action: 'Unpublish a table',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a table',
				action: 'Update a table',
			},
		],
		default: 'getAll',
	},
];

export const tableFields: INodeProperties[] = [
	{
		displayName: 'Table ID',
		name: 'tableId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['get', 'update', 'delete', 'clone', 'publish', 'unpublish', 'resetDraft'],
			},
		},
		default: '',
		description: 'The ID of the table',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['table'],
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
				resource: ['table'],
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
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the table',
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The label of the table',
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
				resource: ['table'],
				operation: ['create', 'update'],
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
						description: 'Comma-separated list of options for SELECT/MULTISELECT types',
					},
				],
			},
		],
	},
	{
		displayName: 'Use Column Names',
		name: 'useColumnNames',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['get'],
			},
		},
		default: false,
		description: 'Whether to use column names instead of IDs in the response',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['table'],
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
			{
				displayName: 'Use For Pages',
				name: 'useForPages',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Allow Public API Access',
				name: 'allowPublicApiAccess',
				type: 'boolean',
				default: false,
			},
		],
	},
	{
		displayName: 'New Table Name',
		name: 'newTableName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['table'],
				operation: ['clone'],
			},
		},
		default: '',
		description: 'Name for the cloned table',
	},
];