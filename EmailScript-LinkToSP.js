// Here is an email script that you can use instead of ${URI_REF}
// to add a link to the current record in the service portal
// instead of in the regular ServiceNow GUI.
// Thanks to https://community.servicenow.com/community?id=community_question&sys_id=79d187a9db98dbc01dcaf3231f961933

(function runMailScript(/* GlideRecord */ current, /* TemplatePrinter */ template,
/* Optional EmailOutbound */ email, /* Optional GlideRecord */ email_action,
/* Optional GlideRecord */ event) {

	// Get a service portal URL to this record
	var pageName = "ticket"; // The service portal page to use, "ticket" by default, could also be "form"
	var linkText = current.getDisplayValue(); // Use the record's display value as the link text. E.g. INC00123456
	var url = '<a href="' + gs.getProperty('glide.servlet.uri') + 'sp?id=' + pageName + '&table=' + current.sys_class_name + '&sys_id=' + current.sys_id + '">' + linkText + '</a>';

	// Put the link on the email
	template.print(url);

})(current, template, email, email_action, event);
