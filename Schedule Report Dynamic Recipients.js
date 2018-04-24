//Put me in the Condition field on the Scheduled Report to dynamically update the list of recepients
//Update the function if need be

function getRecepients(deptName) {
	// Get recepients
	var r = [];

	var gr = new GlideRecord("my_department_report_table");
	gr.addQuery("u_department.name", deptName);
	gr.addNotNullQuery("u_user.email");
	gr.query();
	gs.print("Count: "+gr.getRowCount());
	while (gr.next()) {
		r.push(gr.getValue("email"));
	}

	return r.join(","); // Join the array, comma separated
	// e.g. current.address_list = "some.person@company.com,someother.person@company.com,someone.else@company.com";
}

current.address_list = getRecepients("finance");
// Notice how we didn't save here, but the transient 'current' GlideRecord is still used by the report emailer,
//	so in effect, we've put something in there, it gets used, but we don't actually save back to the record.
//	Cool huh?

