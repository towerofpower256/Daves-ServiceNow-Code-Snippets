// In the client script or UI Action script, create and show the GlideModal using the below
// https://developer.servicenow.com/dev.do#!/reference/api/orlando/client/c_GlideModalClientSideV3API
// https://community.servicenow.com/community?id=community_question&sys_id=34574369db1cdbc01dcaf3231f961924
// https://community.servicenow.com/community?id=community_question&sys_id=2268c7eddb1cdbc01dcaf3231f9619bc

// new GlideModal(String id, Boolean readOnly, Number width)
// id - The UI page to load into the modal.
// readOnly - When true, hides the close button.
// width - The width in pixels.
var gm = new GlideModal('my_awesome_ui_page');
gm.setTitle("My modal's title");
gm.setSize(750);
gm.setPreference('sysparm_table', 'incident');
gm.setPreference('sysparm_sys_id', g_form.getUniqueValue());
gm.render(); // Show it

// Using the GlideModal preferences in the UI Page's HTML / Jelly
<j:set var="jvar_my_preference" value="${sysparm_my_preference}"/>

<span>My preference value is ${sysparm_my_preference}</span>

// Using the GlideModal preferences in the UI Page's client script
// ${JS:preference_name}
var thatPreference = "${JS:sysparm_that_preference}";

// Alternatively in the Client Script, you can create a GlideModal object, and use that within the Client Script.
function onCancel() {
	var o = GlideModal.prototype.get('name_of_this_ui_page_goes_here');
	o.destroy();
}
