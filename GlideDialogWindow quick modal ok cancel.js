// Creating a simple OK / Cancel dialog as a modal form using GlideDialogWindow
// Useful instead of using the browser "alert()" and "confirm()" function, because it happens within
//	ServiceNow and you have greater control, instead of using the browser-based alerts which you lose control of

var okCallback = function() { alert("You clicked on OK") };
var cancelCallback = function() { alert("You clicked on cancel") };

var gdw = new GlideDialogWindow("glide_confirm_standard"); // use the glide_confirm_standard UI page, which is a simple page with "Cancel" and "OK" buttons
gdw.setTitle("Test title"); // Title of the dialog
gdw.setPreference("warning", true); // warning = true means it'll use an X as the icon. Otherwise, it'll be a green tick.
gdw.setPreference("title", "another test title"); // The blurb of the text message
gdw.setPreference("onPromptCancel", cancelCallback ); // Function to execute if the user clicks on Cancel
gdw.setPreference("onPromptComplete", okCallback ); // Function to execute if the user clicks on OK
gdw.render(); // Show the dialog