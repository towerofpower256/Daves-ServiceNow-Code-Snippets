/*
  UI Action code template
  by David McDonald 2016
  
  Good code to use for a UI action when you want to do stuff both client-side, and then server-side.
  E.g. Do a check. If it pases, save and do server stuff. If it fails, add a client-side error message.
*/
  

if (typeof window == 'undefined')
	UiActionName_server();

function UiActionName_client() {
	
	//Do client stuff here
	
	gsftSubmit(null, g_form.getFormElement(), 'button_action_name');
}

function UiActionName_server() {
	
	//Do server stuff here
	
	action.setRedirectURL(current);
};
