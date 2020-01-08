// This will get a GlideRecord as a mostly flat(ish) object.
// Intended to get a GlideRecord's details that are ready to be turned into a JSON message.

// gr = The GlideRecord to work on.
// fields = a string array of fields to include in the object from the glide record.
// Returns an object, ready to be JSON-ified.
function getGrObject (gr, fields) {	
	var obj = {};

	for (var iField=0; iField < fields.length; iField++) {
		var fname = fields[iField];
		if (!gr.isValidField(fname)) {
			addElement(obj, fname, "", ""); // field doesn't exist, just add blank
			continue;
		} 

		var fType = ""+gr.getElement(fname).getED().getInternalType();

		// Boolean
		if (fType == "boolean") {
			addElement(obj, fname, Boolean(gr.getValue(fname)), "");
			continue;
		}

		// Fields that should return a value and a display value
		var displayValueFields = ["reference", "glide_date", "glide_time", "glide_date_time"];
		if (displayValueFields.indexOf(fType) > -1) {
			addElement(obj, fname, gr.getValue(fname), gr.getDisplayValue(fname));
			continue;
		}

		// Ordinary fields
		addElement(obj, fname, gr.getValue(fname), "");
	}

	function addElement(obj, fname, value, displayValue) {
		obj[fname] = {};
		obj[fname]["value"] = value || "";
		obj[fname]["display_value"] = displayValue || "";
	}
}
