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

		var ed = gr.getElement(fname).getED();
		var isChoiceField = ed.isChoiceTable();
		var fType = ""+ed.getInternalType();

		// Choice field
		if (isChoiceField) {
			// There's a special function to get the display value of a choice field
			addElement(obj, fname, gr.getValue(fname), gr.getElement(fname).getChoiceValue());
			continue;
		}
		
		// Boolean
		if (fType == "boolean") {
			// Raw boolean values are either a 0 (false) or a 1 (true)
			addElement(obj, fname, gr.getValue(fname) == 1, "");
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
