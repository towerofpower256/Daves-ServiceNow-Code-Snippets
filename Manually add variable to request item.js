//Manually add a variable to an RITM

function AddCatalogVariable(reqItemID, varName, varValue, catItemID) {
	//Find the catalog item variable definition
	var gr_option = new GlideRecord('item_option_new');
	gr_option.addQuery('name', varName);
	gr_option.addQuery('cat_item', catItemID);
	gr_option.query();
	if (gr_option.next()) {
		//Found it
		gs.print("Instantiating variable '"+varName+"' for request item '"+reqItemID+"'");
		
		//Create the option record (the instance of the variable itself)
		var gr_answers = new GlideRecord('sc_item_option');
		gr_answers.initialize();
		gr_answers.item_option_new = gr_option.sys_id;
		gr_answers.value = varValue;
		gr_answers.insert();

		//Relate that variable to the RITM
		var gr_m2m = new GlideRecord('sc_item_option_mtom');
		gr_m2m.initialize();
		gr_m2m.sc_item_option = gr_answers.sys_id;
		gr_m2m.request_item = reqItemID;
		gr_m2m.insert(); 
	} else {
		gs.print("Tried to instantiate a variable named '"+varName+"' for the catItem '"+catItemID+"' but didn't find a variable to match");
	}
},