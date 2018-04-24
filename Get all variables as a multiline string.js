//Get all variables into a string
//In the object, they should be in order
function GetVariables(gr) {
	var r = [];
	if (gr.variables == undefined) {
		gs.print("Record has no variables to return");
		return ""; //No variables to return
	}
	
	//Variable types to ignore, usually involved with formatting
	//Yes, they're numbers... No, I don't know why...
	var disallowedVariableTypes = [
		11, //Label
		12, //Break
		14, //Macro
		15, //UI Page
		17, //Macro with label
		19, //COntainer start
		20, //Container end
		24, //Container split
		25, //Masked
	];
	
	for (var v in gr.variables) {
		var vgo = gr.variables[v].getGlideObject();
		var vtype = vgo.getType();
		gs.print("Type: "+vtype);
		var vlabel = vgo.getQuestion().getLabel();
		gs.print("Label: "+vlabel);
		var vvalue = gr.variables[v].getDisplayValue();
		gs.print("Value: "+vvalue);
		if (disallowedVariableTypes.indexOf(vtype) == -1) { //Only if it's NOT one of the disallowed variables
			r.push(""+vlabel+" : "+vvalue);
		}
		
	}
	
	//Return as Name : Value
	//Each on its own line
	return r.join("\r\n");
},