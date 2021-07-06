/*
	GlideAjax Template

	By David McDonald 16/05/2017
	
	http://wiki.servicenow.com/index.php?title=GlideAjax
	
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
		
		// Do something here
		
		//Add error message
		this.simpleError("It broke");
		
		//Returning multiple results
		this.addResult("result1", 1);
		this.addResult("result2", "2");
		this.addResult("result3", true);
		
		//Returning simple result
		return "that thing";
	},
	
	simpleError : function (msg) {
		this.setError(msg);
	},
	
	addResult : function (n, v) {
		var newItem = this.newItem("result");
		newItem.setAttribute("name", n);
		newItem.setAttribute("value", v);
	},
}

//======= Client Side
//REMEMBER: All parameter names MUST begin with 'sysparm', even your custom ones
var ga = new GlideAjax('ScriptIncludeNameHere');
ga.addParam("sysparm_name", "functionNameHere");
ga.addParam("sysparm_custom_1", "someValueHere");
ga.getXML(function(response) {
	//Get error if it has one
	var error = response.responseXML.firstChild.getAttribute("error");
	if (error && error != "") {
		//error handling here
	}
	
	//Simple result
	var answer = response.responseXML.firstChild.getAttribute("answer");
	
	//Multiple answer & loop
	var results = response.responseXML.getElementsByTagName("result");
	for (var i=0; i < results.length; i++) {
		var name = results[i].getAttribute("name");
		var value = results[i].getAttribute("value");
	}
});

//WARNING: This will stop EVERYTHING on the page until it either fails, or gets a response
ga.getXMLWait();
var simpleAnswer = ga.getAnswer();
//Can't remember how to get the answer XML
