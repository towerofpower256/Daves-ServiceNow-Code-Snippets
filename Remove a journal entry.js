//Use this on a sys_history line
//Works best if done from a UI Action from a sys_history line
//https://www.servicenowguru.com/system-definition/remove-activity-log-journal-entries/

// =========================== Start UI Action Bits

function confirmDelete(){
   if(confirm('Are you sure you want to permanently delete this history line and all corresponding audit history?\n\nTHIS ACTION CANNOT BE UNDONE!')){
      //Call the UI Action and skip the 'onclick' function
      gsftSubmit(null, g_form.getFormElement(), 'delete_history_line'); //MUST call the 'Action name' set in this UI Action
   }
   else{
      return false;
   }
}

//Code that runs without 'onclick'
//Ensure call to server-side function with no browser errors
if(typeof window == 'undefined')
   deleteHistoryLineServer();

function deleteHistoryLineServer() {
	RemoveJournalEntry(current);
	gs.addInfoMessage(current.label + " entry '" + current.field + "' deleted.");
}

// =========================== End UI Action Bits

function RemoveJournalEntry (grLine /* GlideRecord of sys_history_line */) {
	if (grLine.getRecordClassName() != "sys_history_line")
		throw "grLine is not a history line!";
	
	var fieldName = grLine.field;
	var fieldValue = grLine.getValue("new"); //Breaks if you use grLine.new
	
	//Clean up the sys_audit record
	var grAudit = new GlideRecord('sys_audit');
	grAudit.addQuery('documentkey', grLine.set.id);
	grAudit.addQuery('fieldname', fieldName);
	grAudit.addQuery('newvalue', fieldValue);
	grAudit.query();
	if(grAudit.next()){
		gs.print("Deleting associated sys_audit record: "+grAudit.sys_id);
		grAudit.deleteRecord();
	} else {
		gs.print("No associated sys_audit record found, no audit record deleted");
	}
	
	//Clean up the sys_journal_field entry
	var grJE = new GlideRecord("sys_journal_entry");
	grJE.addQuery('element_id', grLine.set.id);
	grJE.addQuery('element', fieldName);
	grJE.addQuery('value', fieldValue);
	grJE.query();
	if(grJE.next()){
		gs.print("Deleting associated sys_journal_entry record: "+grJE.sys_id);
		grJE.deleteRecord();
	} else {
		gs.print("No associated sys_journal_entry record found, no journal entry record deleted");
	}
	
	//All done
	gs.print("Deleting sys_history_line record: "+grLine.sys_id);
	grLine.deleteRecord();
}