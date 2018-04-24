/*
	Background Worker template
	David McDonald
	05/05/2017
	
	Inspired by:
	http://servicenowcookbook.com/w/index.php/Creating_Background_Processes
	
	OOTB Caller (see checkSMTP): https://d3manageddev.service-now.com/nav_to.do?uri=sys_script_include.do?sys_id=151a8bce97410100715a390ddd2975c3
	OOTB Worker: https://d3manageddev.service-now.com/nav_to.do?uri=sys_script_include.do?sys_id=f618a4560a0005fc00241045226973a4
	
	OOTB Worker: https://d3manageddev.service-now.com/nav_to.do?uri=sys_script_include.do?sys_id=e9be19f10a0a0b54003a4347ef53acbb
	
	GOLD! AjaxExecutionTracker, AJAX calls for tracking ExecutionTracker objects, which appear to be really similar to Progress Workers. The same, but rebranded?
	https://d3manageddev.service-now.com/nav_to.do?uri=sys_script_include.do?sys_id=fc262533ff322100956cffffffffff8f
	
	UI Pages:
	Monitor a worker: https://d3manageddev.service-now.com/nav_to.do?uri=sys_ui_page.do?sys_id=d8e412320a0a0b69002312e21d081f96
	Dialog to start & watch a worker: https://d3manageddev.service-now.com/nav_to.do?uri=sys_ui_page.do?sys_id=d90bb7950a0a0b690048008f7018f6fd
	The UI Macro: https://d3manageddev.service-now.com/nav_to.do?uri=sys_ui_macro.do?sys_id=cdeedebe0a0a0b5000b14a601dba6950
	
	A background progress worker is a block of code that's run, which you don't want to force the user to wait for.
	Such as previewing an update set or importing data into an import set.
	In short, the way Background processes work in ServiceNow is that the code is run inside a GlideScriptedProgressWorker code block,
		and a record in the Progress Worker (sys_progress_worker) table created for the code to output messages and status updates to
	This also means that a user's computer can die mid-way, and the tracking of a progress worker can be picked up, uninterrupted, when they recover
*/


//Starting the background worker
// Basically just does:
//	new MyScriptInclude().process(parameters,get,put,in,here);
function StartWorker() {
	//var worker = new Packages.com.glide.worker.ScriptedProgressWorker(); //Old call
	var worker = new GlideScriptedProgressWorker(); //New call
	worker.setProgressName("Doing the thing"); //Whatever you want to call it
	worker.setName('MyScriptInclude'); //Script Include name
	worker.addParameter("params");
	worker.addParameter("go");
	worker.addParameter("here");
	worker.setBackground(true);
	worker.start();
	
	var workerID = worker.getProgressID();
}

//Worker Function
// Will be inside your ScriptInclude
// 'worker' variablte accessable when run by GlideScriptedProgressWorker, don't worry, it's there.
{
	process : function(param1, param2, param3) { //parameters can be called whatever you like, but will be recieved in the order that you called worker.addParameter()
		
		var gdtStarted = new GlideDateTime(); //Good practice
		
		//Do Stuff
		
		//Safely cancel
		while (looping) {
			if (!worker.isCancelled()) {
				//Keep doing stuff
			}
		}
		
		worker.setProgressState("complete");
		var gdtFinished = new GlideDateTime(); //Good practice
		worker.addMessage("I deeed it! :3\n I took "+(GlideDateTime.subtract(gdtStarted, gdtFinished).getDisplayValue()));
	}
}

//Useful 'worker' functions
//Get
getOutputSummary(); //Get the Output Summary. DOesn't look like it's actually used
getProgressID(); //Once the process has been started, this will get the sys_id of the progress worker record
getProgressMessage(); //Get the contents of the message field of the progress worker
getProgressState(); //Gets the process's current state
getProgressTable(); // ??? Could be sort of a fallback in case the sys_progress_worker table ever changes table
getWorkerThreadID(); // ???
isBackground(); // Returns bool, is it a background worker?
isCancelled();
isError();
isFailed();
isPending();
isStarting();
isUncancelable();

//Set
addParameter("I am some data"); //Adds a parameter that'll be added when calling the MyScriptInclude.process(); function IN THE ORDER THAT THEY ARE ADDED
setBackground(bool); //Is this a background script? Don't know what the difference is, if it's false
setCannotCancel(bool); //Should the use be able to cancel this worker
setName("MyScriptInclude"); //Set the name of the script include that the worker will execute
setProgressError("I died because I can't take it"); //Sets the worker error message
setProgressErrorState(); //???
setProgressMessage(); //Sets the Message field of the progress worker
setProgressName("I'm doing ok"); // Sets the descriptive name for the progress work
setProgressState("running"); //Update the Progress Worker (sys_progress_worker) record. Options: starting, running, complete, cancelled, unknown
setProgressStateCode("success"); //Sets the Completion State / Code field. Options: success, cancelled, error
cancel("cancel reason"); //Sets cancelled and updates the Message field
fail("fail reason"); //Sets failed and updates the Message field
success("success message"); //Sets successful and updates the Message field




//UI Page for monitoring a Progress Worker:
<g:ui_form>
	<table cellpadding="0" cellspacing="0" width="500px">
		<g:ui_progress_worker worker_id="${sysparm_pworker_sysid}" show_cancel="false"/>
	</table>
</g:ui_form>
