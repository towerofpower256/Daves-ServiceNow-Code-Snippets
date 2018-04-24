//Here's how you update the Requested For value while ordering an item,
//  without having to reload the page or submit the form first

g_form.setValue("sc_cart.requested_for", "user_sys_id", "user_display_value");
//If you don't set the display value (3rd parameter), the display doesn't change but the value behind it will
// YOU HAVE BEEN WARNED
