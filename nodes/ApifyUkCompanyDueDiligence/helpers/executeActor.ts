import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest, getResults, isUsedAsAiTool, pollRunStatus } from './genericFunctions';
import { ACTOR_ID } from '../ApifyUkCompanyDueDiligence.node';
import { buildActorInput } from '../ApifyUkCompanyDueDiligence.properties';

export async function runActorApi(
	this: IExecuteFunctions,
	actorId: string,
	input: IDataObject,
	qs: IDataObject,
): Promise<IDataObject> {
	return (await apiRequest.call(this, {
		method: 'POST',
		uri: `/v2/acts/${actorId}/runs`,
		body: input,
		qs,
	})) as IDataObject;
}

/**
 * Runs the Actor for one n8n input item and returns one n8n item per dataset record
 * (one record per company looked up).
 */
export async function runActor(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	// Only the values set in the node are sent; the Actor applies its own defaults.
	// (The Actor's input-schema prefill is deliberately NOT merged in, otherwise a run with
	// only company names would also look up the prefilled example company number.)
	const input = buildActorInput(this, i);

	if (!input.companyNumbers && !input.companyNames) {
		throw new NodeOperationError(
			this.getNode(),
			'Add at least one company number or company name',
			{ itemIndex: i },
		);
	}

	const run = await runActorApi.call(this, ACTOR_ID, input, { waitForFinish: 0 });
	const runData = run?.data as IDataObject | undefined;
	if (!runData?.id) {
		throw new NodeApiError(this.getNode(), {
			message: 'Run ID not found after starting the Actor',
		});
	}

	const lastRunData = await pollRunStatus.call(this, runData.id as string);
	if (lastRunData?.status !== 'SUCCEEDED') {
		throw new NodeApiError(this.getNode(), {
			message: `Apify run ${String(runData.id)} finished with status ${String(lastRunData?.status)}`,
		});
	}

	const records = await getResults.call(this, runData.defaultDatasetId as string);

	if (isUsedAsAiTool(this.getNode().type)) {
		return records;
	}

	// Attach a small run reference to every record so users can trace it back in Apify Console.
	return records.map((record) => ({
		...record,
		json: {
			...record.json,
			apifyRun: {
				runId: lastRunData.id,
				datasetId: lastRunData.defaultDatasetId,
				startedAt: lastRunData.startedAt,
				finishedAt: lastRunData.finishedAt,
			},
		},
	}));
}
