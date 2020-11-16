// Check the user's distinguished name during an LDAP import transform.
// Check to see if the user object is directly under the desired OU by checking:
// - if it's in or under the desired OU
// - if it's in the same level as the desired OU
// I used this for a requirement to only import users that are located directly
// in an OU, and not in any sub-folders.
// By David McDonald 2020
// Return TRUE if it's OK, FALSE if it's not OK
function checkDN(dn, desiredOu) {
	dn = ""+dn;
	gs.print("dn: "+dn);

	// Want to ensure that the user is in the OU "OU=Staff,OU=User_Objects"
	// and NOT in any of the sub-OU's
	var desiredOu = "OU=01_Staff,OU=01_User_Objects,";
	//var desiredOuLevelMatch = regCountOuLevel.match(desiredOu);
	var desiredOuLevelMatch = desiredOu.match(/OU=/gi);
	if (desiredOuLevelMatch == null) {
		log.error("Could not determine level of desired OU");
		return false; // Failed to count the times that "OU=" appears in the desired OU
	}
	var desiredOuLevel = desiredOuLevelMatch.length; // How many times does "OU="" appear in the DN?
	gs.print("desiredOuLevel: "+desiredOuLevel);

	var currentOuLevelMatch = dn.match(/OU=/gi);
	var currentOuLevel = (currentOuLevelMatch || []).length;
	gs.print("currentOuLevelMatch: "+currentOuLevelMatch);
	gs.print("currentOuLevel: "+currentOuLevel);

	var isInDesiredOu = dn.indexOf(desiredOu) != -1;
	var isInSameLevel = currentOuLevel == desiredOuLevel;

	return (isInDesiredOu && isInSameLevel);
}

// === DEBUG, DON'T INCLUDE IN TRANSFORM SCRIPT ===

log = {
	error : function(msg) {gs.log(msg);},
};

var tests = [
	"CN=David McDonald,OU=Staff,OU=User_Objects,DN=test,DN=local",
	"CN=Barry Test,OU=Test users,OU=Staff,OU=User_Objects,DN=test,DN=local"
];

var desiredOu = "OU=Staff,OU=User_Objects,";
for (var i=0; i < tests.length; i++) {
	gs.print("##################");
	var test = tests[i];
	gs.print(test);
	gs.print(checkDN(test), desiredOu);
}
