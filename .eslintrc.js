module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['n8n-nodes-base'],
	extends: ['plugin:n8n-nodes-base/nodes'],
	rules: {
		'n8n-nodes-base/node-dirname-against-convention': 'error',
		'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
		'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
		'n8n-nodes-base/node-class-description-missing-subtitle': 'error',
		'n8n-nodes-base/node-execute-block-wrong-error-thrown': 'error',
	},
	overrides: [
		{
			files: ['*.ts'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-non-null-assertion': 'off',
			},
		},
	],
	ignorePatterns: ['package.json'],
};

