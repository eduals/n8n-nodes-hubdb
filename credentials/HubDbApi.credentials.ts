import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HubDbApi implements ICredentialType {
	name = 'hubDbApi';
	displayName = 'HubSpot HubDB API';
	documentationUrl = 'https://developers.hubspot.com/docs/api/cms/hubdb';
	properties: INodeProperties[] = [
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'API Key (Private App)',
					value: 'apiKey',
				},
				{
					name: 'Access Token + Client Secret (Legacy App)',
					value: 'legacyApp',
				},
			],
			default: 'apiKey',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			displayOptions: {
				show: {
					authentication: ['apiKey'],
				},
			},
			default: '',
			description: 'Your HubSpot Private App API Key',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			displayOptions: {
				show: {
					authentication: ['legacyApp'],
				},
			},
			default: '',
			description: 'Your HubSpot Access Token (from legacy app)',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			displayOptions: {
				show: {
					authentication: ['legacyApp'],
				},
			},
			default: '',
			description: 'Your HubSpot Client Secret (from legacy app)',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken || $credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.hubapi.com',
			url: '/cms/v3/hubdb/tables',
			method: 'GET',
		},
	};
}
