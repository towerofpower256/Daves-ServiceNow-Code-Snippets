/*
  Maintenance Lockout mode
  by David McDonald 2016
  
  By adding a replacement Installation Exit, you can override the login
  functionality and prevent anyone (except admins) from logging in.
  You can even return a message, like "We are currently closed for maintenance".
  
  Installation Exits can also be enabled and disabled, so you can toggle the lockout.
  
  Note that it won't affect Single Sign-On.
  
  Note that it won't affect anyone that's already logged in, so you'll have to
  force them to log out via the "Logged in users" table.
  
  HOW TO DO IT
  1. Create a new Installation Exit record.
  2. Call it something meaningful, such as 'LoginMaintenanceMode'.
  3. Copy-paste the following code into the script field.
  4. Set 'active' to FALSE so that it starts off disabled
  5. Give it a good description, such as;
    User login authentication, that refuses login for all users except admins.
    For use in locking down an instance during in-depth maintenance.
  6. Set the 'overrides' field to 'Login' so that it replaces the standard Login process
  
*/

gs.include("PrototypeServer");

var LoginMaintenanceMode = Class.create();
LoginMaintenanceMode.prototype = {
	initialize : function() {
	},
		//NOTE: Doesn't work for SSO, that seems to bypass this lockout
        process : function() {
          // the request is passed in as a global
          var userName = request.getParameter("user_name");
          var userPassword = request.getParameter("user_password");
			
          var user = GlideUser; 
          var authed = user.authenticate(userName, userPassword);
          if (authed) {
			  //Admin check
			//Check if the user has the Admin role
			var ugr = new GlideRecord("sys_user");
			ugr.addQuery('user_name', userName);
			ugr.addQuery("roles", "admin");
			ugr.setLimit(1);
			ugr.query();
		  	
			if (ugr.hasNext() || userName != "admin") { //include the admin user account to prevent irrecoverable lockout, just in case the maintenance messes up the roles 
				//passed admin check and is authed, allow user through
				return user.getUser(userName);
			} else {
				//If no results found, user doesn't have admin. NO LOGIN FOR YOU
				gs.addErrorMessage("ServiceNow is currently undergoing maintenance and is unavailable");
				return "login.failed";
			}
			
		  } else {
			  //Didn't auth, fail
			  this.loginFailed();
			  return "login.failed";
		  }

          
        },

        loginFailed : function() {
		  if (GlideController.exists("glide.ldap.error.connection")) {
			  var ldapConnError = GlideController.getGlobal("glide.ldap.error.connection");
			  if ( GlideStringUtil.notNil(ldapConnError) )
			      GlideSession.get().addErrorMessage(ldapConnError);
		  } else {
              var message = GlideSysMessage.format("login_invalid");
              GlideSession.get().addErrorMessage(message);
		  }
	
       }

}
