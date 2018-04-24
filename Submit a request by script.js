/*
* Submit a new Request
* By David McDonald 2018-01-18
* 
* Nice and simple, submits a new Catalog Request with Requested Items,
* and gets ServiceNow to do all the hard work with putting it all together
* https://docs.servicenow.com/bundle/jakarta-application-development/page/script/server-scripting/reference/r_ServiceCatalogScriptAPI.html
*/

// Initialize the cart
var cartId = GlideGuid.generate(null);
var cartReqForUserId = gs.getUserId();
var cart = new Cart(cartId, cartReqForUserId); // The user ID is optional, but that's how you change the Requested For

// == Cart members:
// cartName
// userID
// cart
// initialize
// getCart
// clearCart
// deleteCart
// addItem
// prepVariables
// setVariable
// placeOrder

// Create the items
var item1ItemId = "sys ID of a catalog item goes here";
var item1 = cart.addItem(item1ItemId);
cart.setVariable(item1, 'variable_a', 'some value');

var item2ItemId = "sys ID of a catalog item goes here";
var item2 = cart.addItem(item2ItemId);
cart.setVariable(item2, 'variable_a', 'some value');
cart.setVariable(item2, 'variable_b', 'some other value');

// Submit the request
var grRequest = cart.placeOrder(); // Returns the GlideRecord of the request, if it worked
gs.print("Request submitted: "+grRequest.getDisplayValue());
