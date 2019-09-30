// Schedule Tester
// By David McDonald 30/09/2019
// Script that I use for testing a schedule to see if it's working as expected.
// The output also serves as a good test output to provide in an as-built or hand-over
// document to demonstrate that it's working, and how it's expected to operate.
// Make adjustments to the scheduleID, testStart, testStop, and testStep variables, and run as a background script.

// Set up some stuff
var scheduleID = "sys_of_schedule";
var testStart = new GlideDateTime("2019-11-01 10:00:00"); // The start date and time of the test
testStart.subtract(testStart.getLocalTime()); // wind back to midnight on that day
var testStop = new GlideDateTime(testStart); // when to stop
testStop.addDaysUTC(1); // wind forward by a day
var testStep = 30 * 60 * 1000; // 30 mins in milliseconds

gs.print("Test start: "+testStart.getDisplayValue());
gs.print("Test stop: "+testStop.getDisplayValue());
gs.print("Test step: "+new GlideDuration(testStep).getDisplayValue());

var gSched = new GlideSchedule(scheduleID);
gs.print("Testing schedule: "+gSched.getName());

while (!testStart.after(testStop)) {
  // Test if this date & time is within the schedule
	gs.print(testStart.getDisplayValue()+" in schedule: "+gSched.isInSchedule(testStart)); 
  
  // Move the test date & time ahead by the size of 'testStep'
	testStart.add(testStep);
}
