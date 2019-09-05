// Script an import and transform
// By David McDonald 05/09/2019
//
// Here is an example of how to use a script to insert data into
// an import table under a single import set, and run
// a transform map across the entire set.
//
// My use case was to import data from a REST call, parsing a JSON
// data payload, and importing the data using a transform map instead of
// "reinventing the wheel" and writing my own import logic.
//
// This example import takes in a task number and a randomly generated note.
// A transform map coalesces on the task and adds the note as 
// a comment.
//
// Inspiration taken from the ServiceNow business rules:
// - Set synchronous import set
// - Transform synchronously

// Generate some dummy data
var data = _generateDummyData();

// Create the import set
var iSet = new GlideImportSet("u_test_scripted_import");
var iSetId = iSet.create();
_debug("Import set ID: "+iSetId);

// Insert the data into the staging table, and associate it with the new import set
_debug("Inserting data into the staging table");
for (var iRow = 0; iRow < data.length; iRow++) {
	var d = data[iRow];
	
	var grRow = new GlideRecord("u_test_scripted_import");
	grRow.initialize();
	grRow.sys_import_set = iSetId;
	grRow.sys_import_row = iRow;
	grRow.u_task = d.task;
	grRow.u_comment = d.comment;
	grRow.insert();
}

_debug("Running the transform");

// Get ready to run the transform
var importSetGr = new GlideRecord("sys_import_set");
importSetGr.get(iSetId);
var importSetId = importSetGr.getUniqueValue();
var importSetRun = new GlideImportSetRun(importSetId);
var importLog = new GlideImportLog(importSetRun, "My test transform");
var ist = new GlideImportSetTransformer();
ist.setLogger(importLog);
ist.setImportSetRun(importSetRun);
ist.setImportSetID(importSetId);
ist.setSyncImport(true);

// Run the transform
//ist.transformAllMaps(importSetGr, grRow.getUniqueValue()); // Include the row sys_id to transform just on that row.
ist.transformAllMaps(importSetGr); // Exclude the row sys_id to transform the entire import set


function _generateDummyData() {
	// Generate some test data
	// A random task number, and a comment with a randomly generated stamp
  // "Task0000123456", "I am a test note - ba1cd588dbf33300facdf7af299619b6"
  
	var data = [];
	
	var grTask = new GlideRecord("task");
	grTask.setLimit(5);
	grTask.query();

	while (grTask.next()) {
		data.push({
			task : ""+grTask.number,
			comment : "I am a test note - "+gs.generateGUID()
		});
	}
	
	// Debugging
	_debug("Generated data");
	for (var i=0; i < data.length; i++) {
		_debug(""+data[i].task+" - "+data[i].comment);
	}
	
	return data;
}

function _debug(msg) {
	gs.print(msg);
}
