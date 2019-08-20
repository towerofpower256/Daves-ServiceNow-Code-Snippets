// The HTML that ServiceNow generates for a journal field in an email
// such as comment or work notes, is pretty bland and doesn't look good.
// This is how you would generate it yourself.
// Create an email script and use the below.

(function runMailScript(/* GlideRecord */ current, /* TemplatePrinter */ template,
          /* Optional EmailOutbound */ email, /* Optional GlideRecord */ email_action,
          /* Optional GlideRecord */ event) {

    
	var fieldName = "comments"; // Change this to a different field if you want to
  var entryLimit = gs.getProperty("glide.email.journal.lines", 3); // How many entries to include
	
	// Get the comments
	var entries = [];
	var grJE = new GlideRecord("sys_journal_field");
	grJE.addQuery("element", fieldName);
	grJE.addQuery("name", current.getRecordClassName());
	grJE.addQuery("element_id", current.getUniqueValue());
	grJE.orderByDesc("sys_created_on");
	grJE.setLimit(entryLimit);
	grJE.query();
	while (grJE.next()) {
		entries.push({
			text : ""+grJE.value,
			element_label : ""+resolveFieldLabel(current, grJE.element),
			created_by : ""+resolveUsername(grJE.sys_created_by),
			created_on : ""+grJE.sys_created_on
		});
	}
	
	// Print to email
	template.print("<hr />");
	for (var i=0; i < entries.length; i++) {
		var entry = entries[i];
		template.print("<div style=''>");
		template.print("<div style='font-weight: bold; float: left;'>"+entry.created_on+" - "+entry.created_by+"</div>");
		template.print("&nbsp;");
		template.print("<div style='float: right; font-size: small;'>"+entry.element_label+"</div>");
		template.print("</div>");
		template.print("<div style='word-wrap: break-word; display: block;'>");
		template.print(entry.text.replace(/$/gm, "<br />"));
		template.print("</div>");
		template.print("<hr />");
	}
	
  // Function to resolve a username to a user's full name.
  // Wrapped in this function so that names that have already been resolved don't
  // need to be re-resolved.
  var resolvedUserNames = {};
	function resolveUsername(username) {
		if (resolvedUserNames.indexOf(username) > -1) return resolvedUserNames[username];
		
		// Try to get a user by that username
		var gu = gs.getUser().getUserByID(username);
		if (gu.exists()) {
			var displayName = gu.getDisplayName();
			resolvedUserNames[username] = displayName;
			return displayName;
		}
		else
		{
			return username;
		}
	}
	
  // Function to resolve a field's label, or to use the raw "element" value in the journal entry record.
	function resolveFieldLabel(current, fieldName) {
		if (current.isValidField(fieldName))
      return current[fieldName].getLabel();
		else
      return fieldName;
	}

})(current, template, email, email_action, event);
