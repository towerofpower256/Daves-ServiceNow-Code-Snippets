
function parseBool(a, trueValues) {
	if (trueValues == undefined) {
		//Default list of values that are TRUE
		trueValues = [
			"true",
			"1",
			"yes"
		];
	}
	
	a = (""+a).trim().toLowerCase();
	return (trueValues.indexOf(a) != -1); //If 'a' is found in the list of values that represent TRUE, return TRUE, else return FALSE
}
