//Create a new Catalog Request Item from a Hardware Model
// From: ui_page.publish_to_product_catalog
// https://instancename.service-now.com/nav_to.do?uri=sys_ui_page.do?sys_id=2050880137303000158bbfc8bcbe5dd9

function CreateHardwareModelCatalogItem(grHardwareModel, sc_category_id) {
	if (!JSUtil.instance_of(grHardwareModel, GlideRecord)) throw "grHardwareModel is not a GlideRecord";
	if (!grHardwareModel.instanceOf("cmdb_model")) throw "grHardwareModel is not a GlideRecord of the table cmdb_model";
	
	grHardwareModel.product_catalog_item = 
		(new ProductCatalogUtils()).createProductCatalog(
		gr,
		sc_category_id,
		"model" /* type: model, vendor, ??? */,
		"pc_hardware_cat_item" /* catalog name: pc_hardware_cat_item, pc_software_cat_item, pc_product_cat_item */);
	grHardwareModel.update();
}