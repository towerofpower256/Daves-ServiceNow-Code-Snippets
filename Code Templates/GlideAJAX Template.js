/*
	GlideAjax Template
	By David McDonald 06/07/2021
    
    I'm updating this template to use newer techniques,
    including passing a JSON payload back to the client, instead of XML.
	
    https://developer.servicenow.com/dev.do#!/reference/api/orlando/client/c_GlideAjaxAPI
	
	List of members available to AbstractAjaxProcessor:
	request
	responseXML
	gc
	CALLABLE_PREFIX
	initialize
	process
	newItem
	getParameter
	getDocument
	getRootElement
	getName
	getValue
	getType
	getChars
	setAnswer
	setError
*/

//======= Server Side in Script Include
{
    functionNameHere : function () {
		
		//Read inputs
		var something1 = this.getParameter("sysparm_thing1");
		var something2 = this.getParameter("sysparm_thing2");
		
		try {
            var obj = {} // The response object

            // Do something here

            return JSON.stringify(obj); // Return the stringified JSON object
            
        } catch (ex) {
            //Add error message
            this.setError("It broke");
            thow (ex);
        }
	}
}

//======= Client Side
//REMEMBER: All parameter names MUST begin with 'sysparm', even your custom ones

var ga = new GlideAjax('ScriptIncludeNameHere');
ga.addParam("sysparm_name", "functionNameHere");
ga.addParam("sysparm_thing1", "someValueHere");
ga.getXML(function(response) {
    try {
        //Get error if it has one
        var error = response.responseXML.firstChild.getAttribute("error");
        if (error && error != "") {
            throw ("Response error: "+error);
        }

        //Simple result
        var answer = response.responseXML.firstChild.getAttribute("answer");
        var obj = JSON.parse(answer);

        // Do stuff here
        
    } catch (ex) {
        gs.addErrorMessage("An error occured, please contact your system administrator"); // User friendly error message
        console.error(ex); // Actual error message. If you don't add this, all you get is "Unhandled AJAX exception" in the console.
        throw ex;
    }
});
