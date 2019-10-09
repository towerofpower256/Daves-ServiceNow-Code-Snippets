

// After a clone, the MID servers attached to the source will not exist in the target.
// This means that an LDAP server configuration that has a MID server set against it
// won't work anymore, because the MID server it wants to use 
// doesn't exist in the cloned-over instance.
// 
// This script will replace any invalid MID server values on active LDAP servers
// with the first appropriate MID server found right after the clone.
//
// You may need to modify the grMid query if you have multiple MID servers
// and want to use a specific MID server, rather than just using the first
// appropriate MID server found.

fixInvalidLdapMidServers();

function fixInvalidLdapMidServers() {
	
	var replacementMidId = "";

	// Get the first available MID server to use as a replacement.
	// MID servers are not replaced after a clone, and should be available to query
	// immediately after a clone, as opposed to waiting for the MID server to
	// authenticate with the instance after cloning and creating a new MID server record.
	var grMid = new GlideRecord("ecc_agent");
	grMid.addQuery("validated", true);
	grMid.setLimit(1);
	grMid.query();
	if (!grMid.next()) {
		log("No appropriate MID server found as a replacement");
		return false;
	} else {
		replacementMidId = grMid.getUniqueValue();
		log("Found replacement MID: "+grMid.getDisplayValue()+" - "+replacementMidId);
	}

	// Update LDAP servers with invalid MID server values
	var grLS = new GlideRecord("ldap_server_config");
	grLS.addQuery("active", true);
	grLS.addNotNullQuery("mid_server");
	grLS.query();

	while (grLS.next()) {
		var grMidCheck = new GlideRecord("ecc_agent");
		if (!grMidCheck.get(grLS.mid_server)) { // A mid server didn't exist with that sys_id
			log(""+grLS.getDisplayValue()+": MID server '"+grLS.mid_server+"' doesn't exist, replacing with: "+replacementMidId);
			grLS.mid_server = replacementMidId;
			grLS.update();
		}
	}
	
	function log(msg) {
		gs.log(msg, "FixInvalidLdapMid");
	}
}
