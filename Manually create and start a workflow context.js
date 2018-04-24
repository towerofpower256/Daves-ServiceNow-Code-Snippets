//Manually create and start a workflow context

//Imagine we're starting a workflow on an Incident
StartWorkflow(grIncident, someWorkflowID, {parm1 : "asdasd", parm2 : "12345"});

function StartWorkflow(grTargetRecord, workflowID, parms)
	//Check that a workflow with that ID exists
	var grWorkflow = new GlideRecord("workflow");
	if (grWorkflow.get(workflowID)) {
		gs.print("Starting workflow for "+grTargetRecord.getDisplayValue(), parms);
		var w = new Workflow();
		var context = w.startFlow(grWorkflow.sys_id, target, grTargetRecord.operation());
		if (grTargetRecord.hasField("context")) grTargetRecord.context = context; //Put the new WF context ID in the record's "context" field
	} else {
		gs.print("A workflow by that ID doesn't exist");
	}
}