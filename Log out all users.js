// Log out all users
// By David McDonald 2018
// Run this script to log out all users that do not have the 'admin' role.
// Useful for when you're about to begin some in-depth maintenance and no one should be logged in.
// Works well with the 'Maintenance Mode' which prevents non-admin users from logging back in.

logOutAllUsers();

function logOutAllUsers() {
	var grSession = new GlideRecord("v_user_session");
	grSession.addQuery("user", "!=", "admin"); // Don't kick out the admin user
	grSession.query();
	
	while (grSession.next()) {
		gs.print("##############");
		var username = grSession.user;
		gs.print("User: "+username);
		
		// Try to find the user record, based on their username. Only match those that don't have the admin role.
		var grUser = new GlideRecord("sys_user");
		grUser.addQuery("roles", "!=", "admin");
		grUser.addQuery("user_name", username);
		grUser.setLimit(1);
		grUser.query();
		
		if (!grUser.next()) {
			gs.print("Couldn't find user, or user should be ignored. Not locking out this session.");
		} else {
			gs.print("Locking out session");
			
			// Method of ending session inspired by the UI Action "Lock Out Session" on the v_user_session table
			grSession.locked = true;
			//grSession.update();
		}
	}
}
	
