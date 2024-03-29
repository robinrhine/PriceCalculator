sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"plentyHolidays/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("plentyHolidays.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// create the views based on the url/hash
			this.getRouter().initialize();
			
			var PlentyHolidaysModel = new sap.ui.model.json.JSONModel();
				PlentyHolidaysModel.setSizeLimit(3000);
				this.setModel(PlentyHolidaysModel, "Vacachi");
			

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		
		getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			}

	});
});