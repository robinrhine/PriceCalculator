sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","plentyHolidays/model/models"],function(e,t,s){"use strict";return e.extend("plentyHolidays.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.setModel(s.createDeviceModel(),"device");this.getRouter().initialize();var t=new sap.ui.model.json.JSONModel;t.setSizeLimit(3e3);this.setModel(t,"Vacachi");this.setModel(s.createDeviceModel(),"device")},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!t.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});