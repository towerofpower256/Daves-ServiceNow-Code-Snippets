// Function to get the value of a ServiceNow dot-walking string, like the values used in "Field selector" type fields.
// By David McDonald 2020
// The valuePath is a list of fields, separated by a '.' period.
// E.g. assigned_to.department.dept_head
// This function will take that path and try to get the value from a GlideRecord.
// It works by walking down the objects by the property's name.
// This works even for invalid paths, because the dot-walking just returns 'undefined',
// instead of throwing an exception that'd make the whole thing fail.

function getDotWalkValueFromGr(valuePath, gr) {
	var r = null;
	
	valuePath = ""+valuePath; // Force it into a string
	valuePathSplit = valuePath.split(".");
	for (var iPath=0; iPath < valuePathSplit.length; iPath++) {
		var pathSegment = valuePathSplit[iPath].trim();
		
		//gs.print("Segment: "+pathSegment);
		
		if (pathSegment == "") continue; // Skip empty segments
		
		if (r == null) r = gr[pathSegment];
		else r = r[pathSegment];
		
		//gs.print("r: "+r);
	}

	return r;
}

// === DEBUG ===
var gr = new GlideRecord("incident");
gr.get("552c48888c033300964f4932b03eb092");
gs.print(gr.getDisplayValue());

var testPath = "assigned_to.department.dept_head";
gs.print("Result: "+getDotWalkValueFromGr(testPath, gr));

// Output for an incident assigned to Beth Anglin
// INC0010112
// Segment: assigned_to
// r: 46d44a23a9fe19810012d100cca80666
// Segment: department
// r: 221db0edc611228401760aec06c9d929
// Segment: dept_head
// r: 06826bf03710200044e0bfc8bcbe5d6f
// Result: 06826bf03710200044e0bfc8bcbe5d6f
