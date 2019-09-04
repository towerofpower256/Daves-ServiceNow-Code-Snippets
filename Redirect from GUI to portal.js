// Redirect from regular GUI to portal
// By David McDonald 2019
// Use this script as a "UI Script" (set to be global) when you want to redirect
// users from within the regular ServiceNow GUI to somewhere else, such as a
// Service Portal or a CMS portal.
//
// Although you can achieve this using the "getFirstPage()" script, this does not
// work if the user logs in via an SSO or if the user navigates somewhere within the
// regular GUI.
// This script will cover those situations.
//
// Note that this script will run for every page in the regular GUI, including inside
// and outside of iFrames.
//
// Create a new UI Script.
// Set 'Global' to true.
// Copy & paste the script in.
// Update the check conditions to what you require.
// Update the redirection new URL to what you require.

// Have the script execute when the page loads.
addLoadEvent(endUserRedirectionCheck);

// The function to redirect users that should be redirected.
// Default: check when the user opens the home page, 
//  and redirect them to the default SP if they do not have the 'itil' role.
function endUserRedirectionCheck() {
	
	// MAIN
	if (_checkIfShouldRedirectUser()) {
		_redirectUser();
	}
	
	// FUNCTIONS
  
  // Check if the user should be redirected
	function _checkIfShouldRedirectUser() {
		// Check if we're on a desired page
		if (window.location.href.indexOf("/home.do") > -1) {
			if (typeof(g_user) == "undefined") return false; // Cannot see g_form, likely within a UI component that we don't care about.
			
			return g_user.hasRole('itil') == false;
		}
		
		return false;
	}
	
  // Perform the redirection
	function _redirectUser() {
		// Redirect the user to the Service Portal (sp)
		// Frame bust
		var newUrl = "/sp";
		var w = _getTopWindow();
		w.location.replace(newUrl);
	}
	
	// Function to get the top frame.
	// Used for frame busting
	function _getTopWindow() {
		var loopLimit = 10;
		var w = window;
		
		for (var i=0; i < loopLimit; i++) {
			if (top == window) {
				break; // Found the top window
			}
			else
			{
				w = top;
			}
		}
		
		return w;
	}
}
