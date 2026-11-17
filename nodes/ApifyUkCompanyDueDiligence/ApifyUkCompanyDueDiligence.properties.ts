import { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

// Helper functions for parameter extraction
function getFixedCollectionParam(
	context: IExecuteFunctions,
	paramName: string,
	itemIndex: number,
	optionName: string,
	transformType: 'passthrough' | 'mapValues',
): IDataObject {
	const param = context.getNodeParameter(paramName, itemIndex, {}) as {
		[key: string]: IDataObject[];
	};
	if (!param?.[optionName]?.length) return {};

	let result: unknown[] = param[optionName];
	if (transformType === 'mapValues') {
		result = param[optionName]
			.map((item) => String(item.value ?? '').trim())
			.filter((value) => value !== '');
		if (!result.length) return {};
	}
	return { [paramName]: result } as IDataObject;
}

export function buildActorInput(context: IExecuteFunctions, itemIndex: number): IDataObject {
	return {
		// Company numbers (companyNumbers)
		...getFixedCollectionParam(context, 'companyNumbers', itemIndex, 'values', 'mapValues'),
		// Company names (companyNames)
		...getFixedCollectionParam(context, 'companyNames', itemIndex, 'values', 'mapValues'),
		// Include financials (includeFinancials)
		includeFinancials: context.getNodeParameter('includeFinancials', itemIndex),
		// Accounts filings to check (accountsFilings)
		accountsFilings: context.getNodeParameter('accountsFilings', itemIndex),
		// Max financial periods (maxPeriods)
		maxPeriods: context.getNodeParameter('maxPeriods', itemIndex),
		// Include officers (includeOfficers)
		includeOfficers: context.getNodeParameter('includeOfficers', itemIndex),
		// Active officers only (activeOfficersOnly)
		activeOfficersOnly: context.getNodeParameter('activeOfficersOnly', itemIndex),
		// Max officers (maxOfficers)
		maxOfficers: context.getNodeParameter('maxOfficers', itemIndex),
		// Include persons with significant control (includePsc)
		includePsc: context.getNodeParameter('includePsc', itemIndex),
		// Include charges (includeCharges)
		includeCharges: context.getNodeParameter('includeCharges', itemIndex),
		// Max charges (maxCharges)
		maxCharges: context.getNodeParameter('maxCharges', itemIndex),
		// Max companies (maxCompanies)
		maxCompanies: context.getNodeParameter('maxCompanies', itemIndex),
		// Max concurrency (maxConcurrency)
		maxConcurrency: context.getNodeParameter('maxConcurrency', itemIndex),
		// Requests per second (requestsPerSecond)
		requestsPerSecond: context.getNodeParameter('requestsPerSecond', itemIndex),
	};
}

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const actorProperties: INodeProperties[] = [
	{
		displayName: 'Company Numbers',
		name: 'companyNumbers',
		description:
			'UK Companies House company numbers to look up, e.g. 00445790 (England & Wales), SC123456 (Scotland), NI012345, OC300001 (LLP). Leading zeros are added automatically if missing (445790 -> 00445790). Invalid formats return an error record instead of failing the run.',
		default: {},
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'values',
				displayName: 'Values',
				values: [
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Company Names',
		name: 'companyNames',
		description:
			'Optional company names to resolve via the Companies House search. The first ACTIVE match is used (falls back to the top match). Prefer company numbers when you have them - names can be ambiguous.',
		default: {},
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'values',
				displayName: 'Values',
				values: [
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Include Financials',
		name: 'includeFinancials',
		description: 'Whether to parse key figures (turnover, profit, net assets, cash, employees etc.) from machine-readable iXBRL accounts. Companies that file PDF/paper accounts (common for large groups) return filing links but no figures.',
		default: true,
		type: 'boolean',
	},
	{
		displayName: 'Accounts Filings to Check',
		name: 'accountsFilings',
		description:
			'How many of the most recent annual accounts filings to look at per company (each filing usually also contains the prior-year comparatives)',
		default: 2,
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 5,
		},
	},
	{
		displayName: 'Max Financial Periods',
		name: 'maxPeriods',
		description:
			'Maximum number of fiscal year-ends to return in financials.periods (newest first)',
		default: 4,
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 10,
		},
	},
	{
		displayName: 'Include Officers',
		name: 'includeOfficers',
		description:
			'Whether to return directors and secretaries (name, role, appointed/resigned dates, nationality, occupation, country of residence)',
		default: true,
		type: 'boolean',
	},
	{
		displayName: 'Active Officers Only',
		name: 'activeOfficersOnly',
		description:
			'Whether to return only currently serving officers (off = resigned officers are included too)',
		default: true,
		type: 'boolean',
	},
	{
		displayName: 'Max Officers',
		name: 'maxOfficers',
		description: 'Maximum officers returned per company',
		default: 50,
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
	},
	{
		displayName: 'Include Persons with Significant Control',
		name: 'includePsc',
		description:
			'Whether to return persons with significant control (beneficial owners) and any PSC statements/exemptions',
		default: true,
		type: 'boolean',
	},
	{
		displayName: 'Include Charges',
		name: 'includeCharges',
		description:
			'Whether to return registered charges (mortgages/secured debt) with outstanding/satisfied status and lender names',
		default: true,
		type: 'boolean',
	},
	{
		displayName: 'Max Charges',
		name: 'maxCharges',
		description: 'Maximum charges returned per company',
		default: 25,
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
	},
	{
		displayName: 'Max Companies',
		name: 'maxCompanies',
		description: 'Hard cap on the number of companies processed in this run (after de-duplication)',
		default: 1000,
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
	},
	{
		displayName: 'Max Concurrency',
		name: 'maxConcurrency',
		description:
			'Companies processed in parallel (1-10). Requests to Companies House are rate limited regardless.',
		default: 3,
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 10,
		},
	},
	{
		displayName: 'Requests per Second',
		name: 'requestsPerSecond',
		description: 'Polite request rate to the Companies House register (capped at 2.0)',
		default: 1.6,
		type: 'number',
		typeOptions: {
			minValue: 0.2,
			maxValue: 2,
		},
	},
];

export const properties: INodeProperties[] = [...actorProperties, ...authenticationProperties];
