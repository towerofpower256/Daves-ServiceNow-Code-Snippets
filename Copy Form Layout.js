//In this example, I'm copying a form that I've already got (by it's sys_id) for the Server CI table, to the Unix Server CI table
//But first, it removes any forms there to begin with, so it doesn't double up
//RemoveForms("cmdb_ci_unix_server");
//RemoveSections("cmdb_ci_unix_server");
CopyForm("d536a8384f617200b7a29dde0310c7f0", "cmdb_ci_unix_server");
CopyForm("d536a8384f617200b7a29dde0310c7f0", "cmdb_ci_linux_server");
CopyForm("d536a8384f617200b7a29dde0310c7f0", "cmdb_ci_aix_server");
CopyForm("d536a8384f617200b7a29dde0310c7f0", "cmdb_ci_esx_server");
CopyForm("d536a8384f617200b7a29dde0310c7f0", "cmdb_ci_win_server");

function CopyForm(sourceFormID, newTableName, newViewName) {
	function _log(msg) {
		gs.print(msg);
	}
	
	//Settings
	formFieldsToCopy = [
		"roles",
		"sys_user",
		"view_name",
		"sys_domain" //Domain separation support
	];
	
	//Get form record
	_log("Getting the existing form record");
	var grFormOld = new GlideRecord("sys_ui_form");
	if (!grFormOld.get(sourceFormID)) throw ("Failed to get form record by ID: "+sourceFormID);
	
	//Get view record
	var grView = new GlideRecord("sys_ui_view");
	if (JSUtil.nil(newViewName)) {
		_log("No view defined, will use source form's view");
		grView.get(grFormOld.getValue("view"));
	} else {
		_log("Getting view record");
		grView.get("name", newViewName);
	}
	if (!grView.isValidRecord()) throw ("Failed to get view record by name: "+newViewName);
	
	//Copy form record
	_log("Creating the new the form record");
	var grFormNew = new GlideRecord("sys_ui_form");
	grFormNew.initialize();
	grFormNew.setValue("view", grView.sys_id);
	grFormNew.setValue("name", newTableName); //WARNING: No table name validation! Don't get it wrong
	if (!grFormOld.view_name.nil()) grFormNew.setValue("view_name", newViewName); //Only populate the field view_name if the source had one
	QuickCopyFields(grFormOld, grFormNew, formFieldsToCopy); //Copy all the standard fields
	if (JSUtil.nil(grFormNew.insert())) throw "Failed to create new form record";
	
	//We've got our form record, loop through the section M2M and replicate them & the sections
	_log("Copying sections");
	var grOldM2M = new GlideRecord("sys_ui_form_section");
	grOldM2M.addQuery("sys_ui_form", grFormOld.sys_id);
	grOldM2M.query();
	while (grOldM2M.next()) {
		_log("Section: "+grOldM2M.sys_ui_section.getDisplayValue());
		var grNewM2M = new GlideRecord("sys_ui_form_section");
		grNewM2M.initialize();
		grNewM2M.setValue("sys_ui_form", grFormNew.sys_id);
		QuickCopyFields(grOldM2M, grNewM2M, ["position", "sys_domain"] );
		
		//Copy section
		grNewM2M.setValue("sys_ui_section", CopySection(grOldM2M.getValue("sys_ui_section"), newTableName));
		
		grNewM2M.insert();
	}
	
	//Done
	_log("Form copy complete");
}

function CopySection(sectionID, newTableName, newViewName) {
	
	function _log(msg) {
		gs.print(msg);
	}
	
	//Settings
	var sectionFieldsToCopy = [
		"caption",
		"header",
		"roles",
		"sys_user",
		"title",
		"sys_domain" //Domain separation support
	];
	var elementFieldsToCopy = [
		"element",
		"position",
		"sys_ui_formatter",
		"sys_user",
		"type"
	];
	
	//Get section record
	var grSectionOld = new GlideRecord("sys_ui_section");
	if (!grSectionOld.get(sectionID)) throw ("Failed to find section record by the ID: "+sectionID);
	_log("Got section record");
	
	//Get view record
	var grView = new GlideRecord("sys_ui_view");
	if (JSUtil.nil(newViewName)) {
		_log("No view defined, will use source form's view");
		grView.get(grSectionOld.getValue("view"));
	} else {
		_log("Getting view record");
		grView.get("name", newViewName);
	}
	if (!grView.isValidRecord()) throw ("Failed to get view record by name: "+newViewName);
	
	//Copy the section
	_log("Copying section record");
	var grSectionNew = new GlideRecord("sys_ui_section");
	grSectionNew.initialize();
	grSectionNew.setValue("name", newTableName); //WARNING: no table name validation! Don't get it wrong
	grSectionNew.setValue("view", grView.sys_id);
	if (!grSectionOld.view_name.nil()) grSectionNew.setValue("view_name", newViewName); //Only populate the field view_name if the source had one
	QuickCopyFields(grSectionOld, grSectionNew, sectionFieldsToCopy); //Copy all the standard fields
	
	if (JSUtil.nil(grSectionNew.insert())) throw "Failed to insert the new section record";
	
	//Have inserted the new section, copy the old one's elements
	_log("Copying section elements");
	var grElementOld = new GlideRecord("sys_ui_element");
	grElementOld.addQuery("sys_ui_section", grSectionOld.sys_id);
	grElementOld.query();
	while (grElementOld.next()) {
		//Copy what's found
		_log("Element: "+(grElementOld.element || grElementOld.type));
		var grElementNew = new GlideRecord("sys_ui_element");
		grElementNew.initialize();
		grElementNew.setValue("sys_ui_section", grSectionNew.sys_id);
		QuickCopyFields(grElementOld, grElementNew, elementFieldsToCopy); //Copy all the standard fields
		if (JSUtil.nil(grElementNew.insert())) throw "Failed to insert a new element";
	}
	
	_log("Section copy complete");
	return grSectionNew.getValue("sys_id"); //Return the new section's sys_id
}

function QuickCopyFields(grSource, grTarget, fieldArr) {
	for (var i=0; i < fieldArr.length; i++) {
		var fname = fieldArr[i];
		grTarget.setValue(fname, grSource.getValue(fname));
	}
}

function RemoveForms(tableName, viewName) {
	if (viewName == undefined) viewName = "";
	gs.print("WARNING: You are now removing all form records with the table name '"+tableName+"' and the view name '"+viewName+"'");
	gs.print("Note that this will NOT remove sections automatically");
	var grForm = new GlideRecord("sys_ui_form");
	grForm.addQuery("name", tableName);
	grForm.addQuery("view.name", viewName)
	grForm.query();
	if (!grForm.hasNext()) gs.print("No form records to remove, nothing changed");
	while (grForm.next()) {
		gs.print("Removing form record: "+grForm.sys_id);
		grForm.deleteRecord();
	}
}

function RemoveSections(tableName, viewName) {
	if (viewName == undefined) viewName = "";
	gs.print("WARNING: You are now removing all section records with the table name '"+tableName+"' and the view name '"+viewName+"'");
	gs.print("Note that this WILL remove Form Section M2M records automatically");
	var grSection = new GlideRecord("sys_ui_section");
	grSection.addQuery("name", tableName);
	grSection.addQuery("view.name", viewName)
	grSection.query();
	if (!grSection.hasNext()) gs.print("No section records to remove, nothing changed");
	while (grSection.next()) {
		gs.print("Removing any form section M2M records for the section: "+grSection.sys_id);
		var grM2M = new GlideRecord("sys_ui_form_section");
		grM2M.addQuery("sys_ui_section", grSection.sys_id);
		grM2M.query();
		if (!grM2M.hasNext()) gs.print("No M2M records for this section");
		while (grM2M.next()) {
			gs.print("Deleting M2M record: "+grM2M.sys_id);
			gs.print("For form: "+grM2M.sys_ui_form.getDisplayValue());
			grM2M.deleteRecord();
		}
		
		gs.print("Removing section record: "+grSection.sys_id);
		grSection.deleteRecord();
	}
}