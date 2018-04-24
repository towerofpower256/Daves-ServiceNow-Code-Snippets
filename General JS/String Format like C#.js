// Similar to prinf / string.format
// Takes a string with placeholders in it {0}, {1}, etc
// Replaces it with the function's parameters
// E.g. StringFormat("{0} is a {1}", "Dave", "great guy") = "Dave is a great guy"

function stringFormat(inputString) {
	var args = Array.prototype.slice.call(arguments, 1); //Get this function's arguments
	
	return inputString.replace(/{(\d+)}/g, function(match, number) { //Regex by {0}
		return (typeof args[number] != undefined ? args[number] : match); //Replace that placeholder, or if the args[number] is undefined, do nothing
	});
}
