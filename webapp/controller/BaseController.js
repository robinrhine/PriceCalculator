sap.ui.define([
		"sap/ui/core/mvc/Controller"
	], function (Controller) {
		"use strict";

		return Controller.extend("plentyHolidays.controller.BaseController", {
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			 ampmTo24:function(time)
			{
			  var hours = Number(time.match(/^(\d+)/)[1]);
			  var minutes = Number(time.match(/:(\d+)/)[1]);
			  var AP = time.match(/\s(.*)$/);
			  if (!AP){ AP = time.slice(-2);}
			  else{ AP = AP[1];}
			  if(AP === "PM" && hours < 12) {hours = hours + 12; }
			  if(AP === "AM" && hours === 12){ hours = hours - 12; }
			  var Hours24 = hours.toString();
			  var Minutes24 = minutes.toString();
			  if(hours < 10){ Hours24 = "0" + Hours24;}
			  if(minutes < 10){ Minutes24 = "0" + Minutes24 ;}
			
			  return Hours24 + ":" + Minutes24;
			},
			 dateDiff:function( str1, str2 ) {
			    var diff = Date.parse( str2 ) - Date.parse( str1 ); 
			    return isNaN( diff ) ? NaN : {
			        diff : diff,
			        ms : Math.floor( diff            % 1000 ),
			        s  : Math.floor( diff /     1000 %   60 ),
			        m  : Math.floor( diff /    60000 %   60 ),
			        h  : Math.floor( diff /  3600000 %   24 ),
			        d  : Math.floor( diff / 86400000        )
			    };
			},
			 
			 convertTodateValue: function(value) {
				if (value) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy.MM.dd"
					});
					return oDateFormat.format(value);
				} else {
					return value;
				}
			},
			 converttoNewdateFormat:function(value){
				/*if (value) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd,MMMM,yyyy",
						style:"long"
					});
					return oDateFormat.format(value);
				} else {
					return value;
				}*/
			if (value) 
			{	
				//console.log(value);
				
				/*var oDate = new Date(value);
				
				var options = { year: "numeric", month: "long", day: "numeric" };
				return oDate.toLocaleDateString("en-EN", options);*/
				
				//var event = new Date("2019.08.30");
				//var event = new Date(Date.UTC(2012, 11, 20, 0, 0, 0));
				var event = new Date(Date.UTC(parseInt(value.split(".")[0],10), parseInt(value.split(".")[1],10) - 1 , parseInt(value.split(".")[2],10), 0, 0, 0));

				var options = { year: 'numeric', month: 'long', day: 'numeric' };
				return event.toLocaleDateString("en-EN", options);
				
				
			}else {
					return value;
				}
			},
			
			onShareEmailPress : function () {
				var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},
			
			/*onShowDateDiff:function( str2, str1 ) {
			    var diff = Date.parse( str2 ) - Date.parse( str1 ); 
			    return isNaN( diff ) ? NaN : {
			        diff : diff,
			        ms : Math.floor( diff            % 1000 ),
			        s  : Math.floor( diff /     1000 %   60 ),
			        m  : Math.floor( diff /    60000 %   60 ),
			        h  : Math.floor( diff /  3600000 %   24 ),
			        d  : Math.floor( diff / 86400000        )
			    };
			},*/
			
			/*onShowTotalDuration:function(diff){
				return isNaN( diff ) ? NaN : {
			        diff : diff,
			        ms : Math.floor( diff            % 1000 ),
			        s  : Math.floor( diff /     1000 %   60 ),
			        m  : Math.floor( diff /    60000 %   60 ),
			        h  : Math.floor( diff /  3600000  )
			        //d  : Math.floor( diff / 86400000        )
			    };
			},*/
			
			
			
		
			
		
			onFormatDHM:function(oDurationObject)
			{
					var oDHM = "";
					if(oDurationObject.d > 0){
							oDHM = oDurationObject.d + "D";
						} 
						if(oDurationObject.h > 0){
							oDHM += " " + oDurationObject.h + " H";
						}
						if(oDurationObject.m > 0){
							oDHM += " " + oDurationObject.m + " M";
						}
					return oDHM;
			},
			
			generateUUID:function() {
			    var d = new Date().getTime();
			    if(Date.now){
			        d = Date.now(); //high-precision timer
			    }
			    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			        var r = (d + Math.random() * 16) % 16 | 0;
			        d = Math.floor(d / 16);
			        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
			    });
			    return uuid;
			},
			numberWithCommas:function(x) {
    			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			},
			removeCommas:function(x){
				
				return parseInt(x.replace(/,/g, ""),10);
			},
			onGetrandomNumber:function(){
				return Math.floor((Math.random() * 10000) + 1000000);	
			},
			onNumberFormat:function(oValue){
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				  maxFractionDigits: 2,
				  groupingEnabled: true,
				  groupingSeparator: ",",
				  decimalSeparator: "."
				});
				
				return oNumberFormat.parse(oValue);
			},
			
			
			onGetToday:function(){
				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();
				
				today = dd + "-" + mm + "-" + yyyy;
				return today; 
				
			},
			
			onDeleteObject:function(oEvent,oObject){   
				
				var oItem = oEvent.getSource().getParent().getParent().getParent(),
					oTable = oEvent.getSource().getParent().getParent().getParent().getParent(),
					oIndex = oTable.indexOfItem(oItem);
				
				if(oObject.ObjectType === "Flight")
				{
					this.onFlightDelete(oEvent,oIndex,oObject,oTable);
				}else if(oObject.ObjectType === "Hotel")
				{
					this.onHotelDelete(oEvent,oIndex,oObject,oTable);
				}else if(oObject.ObjectType === "Activity")
				{
					this.onActivityDelete(oEvent,oIndex,oObject,oTable);
				}else if(oObject.ObjectType === "Transfer"){
					this.onCarDelete(oEvent,oIndex,oObject,oTable);
				}else if(oObject.ObjectType === "Visa"){
					this.onVisaDelete(oEvent,oIndex,oObject,oTable);
				}else if(oObject.ObjectType === "Freeday"){
					this.onFreedayDelete(oEvent,oIndex,oObject,oTable);
				}

			},
			
			
			
			
			onFreedayDelete:function(oEvent,oCurrentIndex,oFreeday,oTable)
			{
				
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				oArray.splice(oCurrentIndex,1);
				this.getModel("mainView").setProperty("/SortedTourList",oArray);
				this.getModel("mainView").setProperty("/TotalTourCost",0);
				
				this.onLoadDataForTripDetailsNew();
			},
			
			onVisaDelete:function(oEvent,oCurrentIndex,oVisa,oTable)
			{
				
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				oArray.splice(oCurrentIndex,1);
				this.getModel("mainView").setProperty("/SortedTourList",oArray);
				this.getModel("mainView").setProperty("/TotalTourCost",0);
				
				this.onLoadDataForTripDetailsNew();
			},
			
			onActivityDelete:function(oEvent,oCurrentIndex,oActivity,oTable)
			{
				
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				oArray.splice(oCurrentIndex,1);
				this.getModel("mainView").setProperty("/SortedTourList",oArray);
				this.getModel("mainView").setProperty("/TotalTourCost",0);
				
				this.onLoadDataForTripDetailsNew();
			},
			
			onHotelDelete:function(oEvent,oCurrentIndex,oHotel,oTable)
			{
				
				var oAnotherIndex = -1;
				oAnotherIndex = this.onGetIndexFromArrayTableForHotel(oHotel.ObjectId,oCurrentIndex);
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				oArray.splice(oCurrentIndex,1);
				if(oCurrentIndex < oAnotherIndex  &&  oAnotherIndex !== -1)
				{
					oArray.splice(oAnotherIndex - 1,1);	
				}else if(oCurrentIndex > oAnotherIndex &&  oAnotherIndex !== -1)
				{
					oArray.splice(oAnotherIndex,1);
				}
				
				this.getModel("mainView").setProperty("/SortedTourList",oArray);
				this.getModel("mainView").setProperty("/TotalTourCost",0);
				this.getModel("mainView").setProperty("/RoundHotels",[]);
			
				this.onLoadDataForTripDetailsNew();
			},
			
			onCarDelete:function(oEvent,oCurrentIndex,oCar,oTable)
			{
				
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				oArray.splice(oCurrentIndex,1);
				
				this.getModel("mainView").setProperty("/SortedTourList",oArray);
				this.getModel("mainView").setProperty("/TotalTourCost",0);
				this.onLoadDataForTripDetailsNew();
			},
			
			onFlightDelete:function(oEvent,oCurrentIndex,oFlight,oTable)
			{
				var oAnotherIndex = -1;
				if(oFlight.FlightType === "round")
				{
				  oAnotherIndex = this.onGetIndexFromArrayTableForFlight(oFlight.FlightType,oFlight.ObjectId,oCurrentIndex);
				}
				
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				oArray.splice(oCurrentIndex,1);
				if(oCurrentIndex < oAnotherIndex  &&  oAnotherIndex !== -1)
				{
					oArray.splice(oAnotherIndex - 1,1);	
				}else if(oCurrentIndex > oAnotherIndex &&  oAnotherIndex !== -1)
				{
					oArray.splice(oAnotherIndex,1);
				}
				
				this.getModel("mainView").setProperty("/SortedTourList",oArray);
				this.getModel("mainView").setProperty("/TotalTourCost",0);
				this.getModel("mainView").setProperty("/RoundFlights",[]);
				//this.getModel("mainView").setProperty("/RoundCarServices",[]);
				this.onLoadDataForTripDetailsNew();
			},
			
			
			onGetIndexFromArrayTableForFlight:function(oFlightType,oFlightID,FirstIndex)
			{
				var oFindIndex = -1;
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				for(var i = 0; i < oArray.length; i++)
				{
					if(oArray[i].type === "Flight" &&  oArray[i].flighttype === "round" && i !== FirstIndex)
					{
						if(oArray[i].objectid === oFlightID ){
						
							oFindIndex = i;
							
						}
					}
				}
				
				return oFindIndex;
			},
			
			onGetIndexFromArrayTableForHotel:function(oHotelID,FirstIndex)
			{
				var oFindIndex = -1;
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				for(var i = 0; i < oArray.length; i++)
				{
					if(oArray[i].type === "Hotel"  && i !== FirstIndex)
					{
						if(oArray[i].objectid === oHotelID ){
						
							oFindIndex = i;
							
						}
					}
				}
				
				return oFindIndex;
			},
			
			onFindFirstIndexForRoundFlight:function(oFlightID){
				var oFindIndex = -1;
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				for(var i = 0; i < oArray.length; i++)
				{
					if( oArray[i].flighttype === "round" && oArray[i].objectid === oFlightID)
					{
							oFindIndex = i;
							break; 
					}
				}
				
				return oFindIndex;
			},
			
			onFindFirstIndexForHotel:function(oHotelID){
				var oFindIndex = -1;
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				for(var i = 0; i < oArray.length; i++)
				{
					if(oArray[i].objectid === oHotelID)
					{
							oFindIndex = i;
							break; 
					}
				}
				
				return oFindIndex;
			},
		
			
			findWithAttr:function(array, attr, value) {
    			for(var i = 0; i < array.length; i += 1) {
        				if(array[i][attr] === value) {
            			return i;
        			}
    			}
    			return -1;
			},
			
			
			onLoadVisaTemplateForInvoice:function(oVisaObj){
					var oControl  = new sap.ui.layout.Grid({ 
						content:
						[
														new sap.m.HBox({
															items:
															[
																new sap.ui.core.Icon({
																src:"sap-icon://visits"
																}).addStyleClass("sapUiSmallMarginEnd"),
																new sap.m.ObjectIdentifier({
																		title:oVisaObj.PlanningDate,
																		active:false
																}).addStyleClass("sapUiSmallMarginBegin")
																
															]
														}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L12 M12 S12",
																		visibleS:true
														})),

													
														new sap.m.ObjectIdentifier({
																title:"Country",
																	text:oVisaObj.CountryName,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M4 S12"
														})),
														new sap.m.ObjectIdentifier({
																title:"No Adult",
																	text: oVisaObj.NumberOfAdult,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4"
														})),
														new sap.m.ObjectIdentifier({
																title:"Price",
																	text: oVisaObj.Fees,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S5"
														})),
														new sap.m.ObjectIdentifier({
																	title:"",
																	text:"",
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S2",
																    visibleS:false
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Total",
																	text: oVisaObj.Price,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3"
														}))
														
							
						]
						
						
					}).setLayoutData(
						new sap.ui.layout.GridData({
											span: "L12 M12 S12"
					}));
					
					return oControl;
			},
			
			onLoadCarTemplateForInvoice:function(oCarObj){
				
					var oControl  = new sap.ui.layout.Grid({ 
						content:
						[
														new sap.m.HBox({
															items:
															[
																new sap.ui.core.Icon({
																src:"sap-icon://car-rental"
																}).addStyleClass("sapUiSmallMarginEnd"),
																new sap.m.ObjectIdentifier({
																		title:oCarObj.PlanningDate,
																		active:false
																}).addStyleClass("sapUiSmallMarginBegin")
																
															]
														}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L12 M12 S12",
																		visibleS:true
														})),

														new sap.m.ObjectIdentifier({
																title:"From",
																	text:oCarObj.Origin,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S6",
																    active:false
														})),
														new sap.m.ObjectIdentifier({
																	title:"To",
																	text:oCarObj.Destination,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S6"
														})),
														new sap.m.ObjectIdentifier({
																title:"Vehicle Type",
																	text:oCarObj.VehicleType,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M4 S12"
														})),
														new sap.m.ObjectIdentifier({
																title:"No Vehicle",
																	text: oCarObj.NumberofVehicle,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4"
														})),
														new sap.m.ObjectIdentifier({
																title:"Price",
																	text: oCarObj.IndividualPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S5"
														})),
														new sap.m.ObjectIdentifier({
																	title:"",
																	text:"",
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S2",
																    visibleS:false
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Total",
																	text: oCarObj.Price,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3"
														})),
														new sap.m.ObjectAttribute({
																	
																	title:"Remarks",
																	text:oCarObj.Remarks,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12 S12",
														    visibleXL: oCarObj.Remarks.length > 0 ? true : false,
															visibleL:  oCarObj.Remarks.length > 0 ? true : false,
															visibleM:  oCarObj.Remarks.length > 0 ? true : false,
															visibleS:  oCarObj.Remarks.length > 0 ? true : false
														}))
							
						]
						
						
					}).setLayoutData(
						new sap.ui.layout.GridData({
											span: "L12 M12 S12"
					}));
					
					return oControl;
				
			},
			
			onLoadFreeDayTemplate:function(oFreedayObj){
				var that = this;
				var oControl = new sap.ui.layout.Grid({
					content:[
									new sap.ui.layout.Grid({
											content:[
												
													new sap.ui.core.Icon({
														src:"sap-icon://add-process"
													})
													.addStyleClass("sapUiTinyMarginTop TourDetailsIcon")
													.setLayoutData(new sap.ui.layout.GridData({
																span: "L3 M3 S3",
																	visibleS:true
													})),
													
													new sap.m.ObjectIdentifier({
																	title:oFreedayObj.PlanningDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S6"
														})).addStyleClass("MakeTextAlign"),
													
													new sap.m.Button({
														icon:"sap-icon://delete",
														press:function(evt){
															that.onDeleteObject(evt,oFreedayObj);
														}
													}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S3"
													})).addStyleClass("TourDetailsDeleteButton"),
													
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Suggestion:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.Text({
																	text: oFreedayObj.Suggestion
																	
																})
														
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L11 M11 S11"
														})),
														
														new sap.ui.core.Icon({
														src:"sap-icon://edit",
														visible:true,
														press:function(evt){
															that.onEditObject(evt,oFreedayObj);
														}
														})
														.addStyleClass("sapUiTinyMarginTop TourDetailsIcon TourDetailsDeleteButton")
														.setLayoutData(new sap.ui.layout.GridData({
																		span: "L1 M1 S1"
																		
														}))
														
														
														
												]
									}).addStyleClass("sapUiNoPadding CheckING")
									.setLayoutData(new sap.ui.layout.GridData({
											span: "L12 M12 S12"
									}))
						]
				});
				
				return oControl;
			},
			onLoadVisaTemplate:function(oVisaObj){
				var that = this;
				var oControl = new sap.ui.layout.Grid({
					content:[
									new sap.ui.layout.Grid({
											content:[
												
													new sap.ui.core.Icon({
														src:"sap-icon://visits"
													})
													.addStyleClass("sapUiTinyMarginTop TourDetailsIcon")
													.setLayoutData(new sap.ui.layout.GridData({
																span: "L3 M3 S3",
																	visibleS:true
													})),
													
													new sap.m.ObjectIdentifier({
																	title:oVisaObj.PlanningDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S6"
														})).addStyleClass("MakeTextAlign"),
													
													new sap.m.Button({
														icon:"sap-icon://delete",
														press:function(evt){
															that.onDeleteObject(evt,oVisaObj);
														}
													}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S3"
													})).addStyleClass("TourDetailsDeleteButton"),
													
														new sap.m.ObjectIdentifier({
																title:"Country Name",
																	text:oVisaObj.CountryName,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
														})),
														
														new sap.m.ObjectIdentifier({
																title:"No Of Adult",
																	text:oVisaObj.Adult,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Fees",
																	text:oVisaObj.Fees,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
														})),
														
														/*new sap.m.ObjectAttribute({
																	
																	title:"Pickup Time",
																	text:oCarObj.PickupTime,
																	active:false
																}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12S12"
														})),*/
														
														/*new sap.m.ObjectAttribute({
																	
																	title:"Pickup Zone",
																	text:oCarObj.PickupZone,
																	active:false
																}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12S12"
														})),*/
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Price:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.ObjectNumber({
																	number:oVisaObj.TotalPrice,
																	unit:oVisaObj.Currency
																})
														
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L11 M11 S11"
														})),
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Calculation:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.Text({
																	text: oVisaObj.Fees + " X " + oVisaObj.Adult
																	
																})
														
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L11 M11 S11"
														})),
														
														new sap.ui.core.Icon({
														src:"sap-icon://edit",
														visible:true,
														press:function(evt){
															that.onEditObject(evt,oVisaObj);
														}
														})
														.addStyleClass("sapUiTinyMarginTop TourDetailsIcon TourDetailsDeleteButton")
														.setLayoutData(new sap.ui.layout.GridData({
																		span: "L1 M1 S1"
																		
														}))
														
														/*new sap.m.ObjectAttribute({
																	
																	title:"Remarks",
																	text:oCarObj.Remarks,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12 S12",
														    visibleXL: oCarObj.Remarks.length > 0 ? true : false,
															visibleL:  oCarObj.Remarks.length > 0 ? true : false,
															visibleM:  oCarObj.Remarks.length > 0 ? true : false,
															visibleS:  oCarObj.Remarks.length > 0 ? true : false
														}))*/
														
												]
									}).addStyleClass("sapUiNoPadding CheckING")
									.setLayoutData(new sap.ui.layout.GridData({
											span: "L12 M12 S12"
									}))
						]
				});
				
				return oControl;
			},
			onLoadCarTemplate:function(oCarObj){
			var that = this;
			var oControl = new sap.ui.layout.Grid({
					content:[
									new sap.ui.layout.Grid({
											content:[
												
													new sap.ui.core.Icon({
														src:"sap-icon://car-rental"
													})
													.addStyleClass("sapUiTinyMarginTop TourDetailsIcon")
													.setLayoutData(new sap.ui.layout.GridData({
																span: "L3 M3 S3",
																	visibleS:true
													})),
													
													new sap.m.ObjectIdentifier({
																	title:oCarObj.PlanningDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S6"
														})).addStyleClass("MakeTextAlign"),
													
													new sap.m.Button({
														icon:"sap-icon://delete",
														press:function(evt){
															that.onDeleteObject(evt,oCarObj);
														}
													}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S3"
													})).addStyleClass("TourDetailsDeleteButton"),
													
														new sap.m.ObjectIdentifier({
																title:"Origin",
																	text:oCarObj.Origin,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Destination",
																	text:oCarObj.Destination,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
																})),
														
														new sap.m.ObjectAttribute({
																	
																	title:"Pickup Time",
																	text:oCarObj.PickupTime,
																	active:false
																}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12S12"
														})),
														
														new sap.m.ObjectAttribute({
																	
																	title:"Pickup Zone",
																	text:oCarObj.PickupZone,
																	active:false
																}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12S12"
														})),
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Price:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.ObjectNumber({
																	number:oCarObj.Price,
																	unit:oCarObj.Currency
																})
														
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L11 M11 S11"
														})),
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Vehicle Type:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.Text({
																	text: oCarObj.NumberofVehicle + " X " + oCarObj.VehicleType
																	
																})
														
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L11 M11 S11"
														})),
														
														new sap.ui.core.Icon({
														src:"sap-icon://edit",
														visible:true,
														press:function(evt){
															that.onEditObject(evt,oCarObj);
														}
														})
														.addStyleClass("sapUiTinyMarginTop TourDetailsIcon TourDetailsDeleteButton")
														.setLayoutData(new sap.ui.layout.GridData({
																		span: "L1 M1 S1"
																		
														})),
														
														new sap.m.ObjectAttribute({
																	
																	title:"Remarks",
																	text:oCarObj.Remarks,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12 S12",
														    visibleXL: oCarObj.Remarks.length > 0 ? true : false,
															visibleL:  oCarObj.Remarks.length > 0 ? true : false,
															visibleM:  oCarObj.Remarks.length > 0 ? true : false,
															visibleS:  oCarObj.Remarks.length > 0 ? true : false
														}))
														
												]
									}).addStyleClass("sapUiNoPadding CheckING")
									.setLayoutData(new sap.ui.layout.GridData({
											span: "L12 M12 S12"
									}))
						]
				});
				
				return oControl;
	
		},
		
		onLoadFlightTemplateForInvoice:function(oFlight){
			var oControl  = new sap.ui.layout.Grid({ 
						content:
						[
							
														
														
														new sap.m.HBox({
															items:
															[
																new sap.ui.core.Icon({
																src:"sap-icon://flight"
																}).addStyleClass("sapUiSmallMarginEnd"),
																new sap.m.ObjectIdentifier({
																		title:oFlight.PlanningDate,
																		active:false
																}).addStyleClass("sapUiSmallMarginBegin")
																
															]
														}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L12 M12 S12",
																		visibleS:true
														})),
														new sap.m.ObjectIdentifier({
																title:"Origin",
																	text:oFlight.Origin,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M3 S12"
														})),
														new sap.m.ObjectIdentifier({
																	title:"Destination",
																	text: oFlight.Destination,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M3 S12"
														})),
														new sap.m.ObjectIdentifier({
																	title:"Adult",
																	text: oFlight.NoOfAdult,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S5"
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Child",
																	text: oFlight.NoOfChild,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4"
														})),
														new sap.m.ObjectIdentifier({
																title:"Infant",
																	text: oFlight.NoOfInfant,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3"
														})),
														
														
														///new row.. if have...
														new sap.m.ObjectIdentifier({
																title:"Carrier Name",
																	text: oFlight.CarrierName,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M4 S12"
														})),
														new sap.m.ObjectIdentifier({
																title:"Adult Price",
																	text: oFlight.AdultPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M4 S5"
																    //visibleXL: that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    //visibleL:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    //visibleM:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    //visibleS:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Child Price",
																	text: oFlight.ChildPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4"
																    //visibleXL: oHotel.NumberOfExtraBed > 0 ? true : false,
																    //visibleL:  oHotel.NumberOfExtraBed > 0 ? true : false,
																    //visibleM:  oHotel.NumberOfExtraBed > 0 ? true : false,
																    //visibleS:  oHotel.NumberOfExtraBed > 0 ? true : false
														})),
														
														//false template
														new sap.m.ObjectIdentifier({
																	title:"Infant Price",
																	text:oFlight.InfantPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S12",
																    visibleS:true,
																    visibleM:true
														})),
														//end false template
														new sap.m.ObjectIdentifier({
																title:"Total",
																	text: oFlight.Price,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3"
																    //visibleXL: oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    //visibleL:  oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    //visibleM:  oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    //visibleS:  oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false
														})),
														
														new sap.m.ObjectAttribute({
																	title:"Remarks",
																	text:oFlight.Remarks
																
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12",
																    visibleXL: oFlight.Remarks.length > 0 ? true : false,
																    visibleL:  oFlight.Remarks.length > 0 ? true : false,
																    visibleM:  oFlight.Remarks.length > 0 ? true : false,
																    visibleS:  oFlight.Remarks.length > 0 ? true : false
														}))
							
						]
						
						
					}).setLayoutData(
						new sap.ui.layout.GridData({
											span: "L12 M12 S12"
					}));
					
					return oControl;
			
			
		},
		onLoadHotelTemplateForInvoice:function(oHotel){
				var that = this;
				var RoomPrice = that.numberWithCommas(oHotel.NumberOfRooms * oHotel.NumberOfNights * this.removeCommas( oHotel.PerdayPrice));
				var RoomPriceWithExtraBed = that.numberWithCommas(oHotel.NumberOfExtraBed * this.removeCommas(oHotel.ExtraBedPrice) * oHotel.NumberOfNights);
				var oControl  = new sap.ui.layout.Grid({ 
						content:
						[
							
														
														
														new sap.m.HBox({
															items:
															[
																new sap.ui.core.Icon({
																src:"sap-icon://bed"
																}).addStyleClass("sapUiSmallMarginEnd"),
																new sap.m.ObjectIdentifier({
																		title:oHotel.PlanningDate,
																		active:false
																}).addStyleClass("sapUiSmallMarginBegin")
																
															]
														}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L12 M12 S12",
																		visibleS:true
														})),
														new sap.m.ObjectIdentifier({
																title:"Hotel Name",
																	text:oHotel.HotelName,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M4 S12"
														})),
														new sap.m.ObjectIdentifier({
																	title:"Room Price",
																	text: oHotel.PerdayPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S12"
														})),
														new sap.m.ObjectIdentifier({
																	title:"Nights",
																	text: oHotel.NumberOfNights,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S5"
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Rooms",
																	text: oHotel.NumberOfRooms,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4"
														})),
														new sap.m.ObjectIdentifier({
																title:"Total",
																	text: RoomPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3"
														})),
														///new row.. if have...
														new sap.m.ObjectIdentifier({
																title:"Room Type",
																	text: oHotel.RoomType,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M4 S12"
														})),
														new sap.m.ObjectIdentifier({
																title:"Extra Bed Price",
																	text: oHotel.ExtraBedPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M4 S5",
																    visibleXL: that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleL:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleM:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleS:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Extra Bed",
																	text: oHotel.NumberOfExtraBed,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4",
																    visibleXL: oHotel.NumberOfExtraBed > 0 ? true : false,
																    visibleL:  oHotel.NumberOfExtraBed > 0 ? true : false,
																    visibleM:  oHotel.NumberOfExtraBed > 0 ? true : false,
																    visibleS:  oHotel.NumberOfExtraBed > 0 ? true : false
														})),
														
														//false template
														new sap.m.ObjectIdentifier({
																	title:"",
																	text:"",
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S12",
																    visibleS:false,
																    visibleM:false
														})),
														//end false template
														new sap.m.ObjectIdentifier({
																title:"Total",
																	text: RoomPriceWithExtraBed,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3",
																    visibleXL: oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleL:  oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleM:  oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleS:  oHotel.NumberOfExtraBed > 0 &&  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false
														})),
														
														new sap.m.ObjectAttribute({
																	title:"Remarks",
																	text:oHotel.Remarks
																
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12",
																    visibleXL: oHotel.Remarks.length > 0 ? true : false,
																    visibleL:  oHotel.Remarks.length > 0 ? true : false,
																    visibleM:  oHotel.Remarks.length > 0 ? true : false,
																    visibleS:  oHotel.Remarks.length > 0 ? true : false
														}))
							
						]
						
						
					}).setLayoutData(
						new sap.ui.layout.GridData({
											span: "L12 M12 S12"
					}));
					
					return oControl;
			},
		onLoadFlightTemplate:function(oFlight){
			var that= this;
			var oControl = new sap.ui.layout.Grid({
					content:[
								new sap.ui.layout.Grid({
											content:[
													new sap.ui.core.Icon({
														src:"sap-icon://flight"
													})
													.addStyleClass("sapUiTinyMarginTop TourDetailsIcon")
													.setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S4"
													})),
													
													new sap.m.ObjectIdentifier({
																	title:oFlight.PlanningDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S4"
														})).addStyleClass("MakeTextAlign"),
													
													new sap.m.Button({
														icon:"sap-icon://delete",
														press:function(evt){
															that.onDeleteObject(evt,oFlight);
														}
													}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S4"
													})).addStyleClass("TourDetailsDeleteButton"),
														
														new sap.m.ObjectIdentifier({
																title:"Origin",
																	text:oFlight.Origin,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
																})),
														
														new sap.m.ObjectIdentifier({
																title:"Destination",
																	text:oFlight.Destination,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
																})),
																
														new sap.m.ObjectIdentifier({
																title:"Departure Date Time",
																	text:oFlight.DepartureDate + " " + oFlight.DepartureTime,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
														})),
														
														
														
														
														new sap.m.ObjectAttribute({
																	
																	title:"Flight Number",
																	text:oFlight.FlightNumber + " ( " + oFlight.CarrierName + ")",
																	active:false
																}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L6 M6 S12"
														})),
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Price:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.ObjectNumber({
																	number:oFlight.Price,
																	unit:oFlight.Currency
																})
															
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														   span: "L11 M11 S11"
														})),
														
														new sap.ui.core.Icon({
														src:"sap-icon://edit",
														press:function(evt){
																that.onEditObject(evt,oFlight);
														}
														})
														.addStyleClass("sapUiTinyMarginTop TourDetailsIcon TourDetailsDeleteButton")
														.setLayoutData(new sap.ui.layout.GridData({
																		span: "L1 M1 S1",
																		visibleS:true
														}))
														
												]
									}).addStyleClass("sapUiNoMargin CheckING")
									.setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12 S12"
									}))
						]
				});
			return oControl;
		},
		
		onLoadHotelTemplate:function(oHotel){
			var that = this;
			var oControl = new sap.ui.layout.Grid({
					content:[
									new sap.ui.layout.Grid({
											content:[
													new sap.ui.core.Icon({
														src:"sap-icon://bed"
													})
													.addStyleClass("sapUiTinyMarginTop TourDetailsIcon")
													.setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S3"
													})),
													
													new sap.m.ObjectIdentifier({
																	title:oHotel.PlanningDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S6"
														})).addStyleClass("MakeTextAlign"),
													
													new sap.m.Button({
														icon:"sap-icon://delete",
														press:function(evt){
															that.onDeleteObject(evt,oHotel);
														}
													}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S3"
													})).addStyleClass("TourDetailsDeleteButton"),
														
														new sap.m.ObjectAttribute({
																	title:"Hotel Confirmation No",
																	text: oHotel.ConfirmationNumber
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12"
														})),
														
														new sap.m.ObjectIdentifier({
																title:oHotel.Location,
																text:oHotel.HotelName,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
														})),
														
														
														new sap.m.ObjectIdentifier({
																title:"Check In",
																	text:oHotel.CheckInDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S6"
																})),
														
														new sap.m.ObjectIdentifier({
																title:"Check Out",
																	text:oHotel.CheckOutDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S6"
														})),
														new sap.m.ObjectIdentifier({
																	title:"Adult",
																	text:oHotel.NumberOfAdult,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S6"
														})),
														new sap.m.ObjectIdentifier({
																	title:"Child",
																	text: oHotel.NumberOfChild,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S6",
																    visibleXL: oHotel.NumberOfChild > 0 ? true : false,
																    visibleL:  oHotel.NumberOfChild > 0 ? true : false,
																    visibleM:  oHotel.NumberOfChild > 0 ? true : false,
																    visibleS:  oHotel.NumberOfChild > 0 ? true : false
														})),
														new sap.m.ObjectIdentifier({
																	title:"Number of Room",
																	text:oHotel.NumberOfRooms,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S6"
														})),
														
														new sap.m.ObjectIdentifier({
																	title:"Extra Bed",
																	text:oHotel.NumberOfExtraBed,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S6",
																    visibleXL: oHotel.NumberOfExtraBed > 0 ? true : false,
																    visibleL:  oHotel.NumberOfExtraBed > 0 ? true : false,
																    visibleM:  oHotel.NumberOfExtraBed > 0 ? true : false,
																    visibleS:  oHotel.NumberOfExtraBed > 0 ? true : false
														})),
														new sap.m.ObjectAttribute({
																	title:"Address",
																	text:oHotel.HotelAddress
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S12"
														})),
														
														new sap.m.ObjectAttribute({
																	title:"Room Type",
																	text:oHotel.RoomType
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S12"
														})),
														new sap.m.ObjectAttribute({
																	title:"Room Price",
																	text: oHotel.PerdayPrice + " " + oHotel.Currency 
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S12"
														})),
														
														new sap.m.ObjectAttribute({
																	title:"Extra Bed Price",
																	text: oHotel.ExtraBedPrice + " " + oHotel.Currency 
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L3 M3 S12",
																    visibleXL: that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleL:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleM:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false,
																    visibleS:  that.removeCommas(oHotel.ExtraBedPrice) > 0 ? true : false
														})),
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Price:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.ObjectNumber({
																	number:oHotel.Price,
																	unit:oHotel.Currency
																})

															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L11 M11 S11"
														})),
														
														new sap.ui.core.Icon({
														src:"sap-icon://edit",
														visible:true,
														press:function(evt){
															that.onEditObject(evt,oHotel);
														}
														})
														.addStyleClass("sapUiTinyMarginTop TourDetailsIcon TourDetailsDeleteButton")
														.setLayoutData(new sap.ui.layout.GridData({
																		span: "L1 M1 S1"
																		
														})),
														
														new sap.m.ObjectAttribute({
																	title:"Remarks",
																	text:oHotel.Remarks
																
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12",
																    visibleXL: oHotel.Remarks.length > 0 ? true : false,
																    visibleL:  oHotel.Remarks.length > 0 ? true : false,
																    visibleM:  oHotel.Remarks.length > 0 ? true : false,
																    visibleS:  oHotel.Remarks.length > 0 ? true : false
														}))
	
												]
									}).addStyleClass("sapUiNoMargin CheckING")
									.setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12 S12"
									}))
	
						]
				});
			return oControl;
		},
		
		onLoadFooterTemplate:function(oFooter){
			var oStyle = "height:50px;width:98%;float:right;border:solid 0px ;background-color:#DCEDF0;";
			var oControl = new sap.ui.core.HTML({
				content: "<div style= " + oStyle + " />robin<div/>"
			});
			return oControl;
		},
		
		
		onLoadActivityTemplateForInvoice:function(oActivity){
			var that = this;
				var AdlutPrice = that.numberWithCommas(oActivity.Adult * this.removeCommas( oActivity.AdultTicketPrice));
				var ChildPrice = that.numberWithCommas(oActivity.Child * this.removeCommas(oActivity.ChildTicketPrice) );
				var oControl  = new sap.ui.layout.Grid({ 
						content:
						[
														new sap.m.HBox({
															items:
															[
																new sap.ui.core.Icon({
																src:"sap-icon://physical-activity"
																}).addStyleClass("sapUiSmallMarginEnd"),
																new sap.m.ObjectIdentifier({
																		title:oActivity.PlanningDate,
																		active:false
																}).addStyleClass("sapUiSmallMarginBegin")
																
															]
														}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L12 M12 S12",
																		visibleS:true
														})),
														new sap.m.ObjectIdentifier({
																title:"Activity",
																	text:oActivity.ActivityName,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M4 S12"
														})),
														new sap.m.ObjectIdentifier({
																title:"Adult Price",
																	text: oActivity.AdultTicketPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4"
														})),
														new sap.m.ObjectIdentifier({
																title:"Adult",
																	text: oActivity.Adult,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S5"
														})),
														//false template
														new sap.m.ObjectIdentifier({
																	title:"",
																	text: oActivity.NumberOfRooms,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S12",
																    visibleS:false
														})),
														//end of false template
														new sap.m.ObjectIdentifier({
																title:"Total",
																	text: AdlutPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3"
														})),
														///new row.. if have...
														//false template
														new sap.m.ObjectIdentifier({
																	title:"",
																	text: "",
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L4 M4 S12",
																    visibleXL: that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleL:  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleM:  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleS: false
														})),
														//false template 
														new sap.m.ObjectIdentifier({
																	title:"Child Price",
																	text: oActivity.ChildTicketPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S4",
																    visibleXL: that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleL:  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleM:  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleS:  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false
														})),
														
														new sap.m.ObjectIdentifier({
																title:"Child",
																	text: oActivity.Child,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S5",
																    visibleXL: oActivity.Child > 0 ? true : false,
																    visibleL:  oActivity.Child > 0 ? true : false,
																    visibleM:  oActivity.Child > 0 ? true : false,
																    visibleS:  oActivity.Child > 0 ? true : false
														})),
														
														//false template
														new sap.m.ObjectIdentifier({
																	title:"",
																	text:"",
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S12",
																    visibleS:false
														})),
														//end false template
														new sap.m.ObjectIdentifier({
																title:"Total",
																	text: ChildPrice,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L2 M2 S3",
																    visibleXL: oActivity.Child > 0 &&  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleL:  oActivity.Child > 0 &&  that.removeCommas(oActivity.ChildTicketPrice)  > 0 ? true : false,
																    visibleM:  oActivity.Child > 0 &&  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false,
																    visibleS:  oActivity.Child > 0 &&  that.removeCommas(oActivity.ChildTicketPrice) > 0 ? true : false
														})),
														new sap.m.ObjectAttribute({
																	title:"Remarks",
																	text:oActivity.Remarks
																
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12",
																    visibleXL: oActivity.Remarks.length > 0 ? true : false,
																    visibleL:  oActivity.Remarks.length > 0 ? true : false,
																    visibleM:  oActivity.Remarks.length > 0 ? true : false,
																    visibleS:  oActivity.Remarks.length > 0 ? true : false
														}))
							
						]
						
						
					}).setLayoutData(
						new sap.ui.layout.GridData({
											span: "L12 M12 S12"
					}));
					
					return oControl;
		},
		
		onLoadActivityTemplate:function(oActivity){
			var that = this;
			var oControl = new sap.ui.layout.Grid({
					content:[
								new sap.ui.layout.Grid({
											content:[
													new sap.ui.core.Icon({
														src:"sap-icon://physical-activity"
													})
													.addStyleClass("sapUiTinyMarginTop TourDetailsIcon")
													.setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S3"
													})),
													
													new sap.m.ObjectIdentifier({
																	title:oActivity.PlanningDate,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L6 M6 S6"
														})).addStyleClass("MakeTextAlign"),
													
													new sap.m.Button({
														icon:"sap-icon://delete",
														press:function(evt){
															that.onDeleteObject(evt,oActivity);
														}
													}).setLayoutData(new sap.ui.layout.GridData({
																	span: "L3 M3 S3"
													})).addStyleClass("TourDetailsDeleteButton"),
														
														new sap.m.ObjectIdentifier({
																title:oActivity.Origin,
																text:oActivity.ActivityName,
																	active:false
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12"
														})),
														
															new sap.m.ObjectAttribute({
																	
																	title:"Pickup Time",
																	text:oActivity.PickupTime,
																	active:false
																}).setLayoutData(new sap.ui.layout.GridData({
														    		span: "L12 M12S12"
														})),
														
														new sap.m.ObjectAttribute({
																	
																	title:"Pickup Zone",
																	text:oActivity.PickupZone,
																	active:false
																}).setLayoutData(new sap.ui.layout.GridData({
														    		span: "L12 M12S12"
														})),
														
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Ticket Price For Adult:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.ObjectNumber({
																	number:oActivity.AdultTicketPrice,
																	unit:oActivity.Currency
																})
																
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L6 M6 S12"
														})),
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Ticket Price For Child:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.ObjectNumber({
																	number:oActivity.ChildTicketPrice,
																	unit:oActivity.Currency
																})
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L6 M6 S12",
														    visibleXL: oActivity.ChildTicketPrice > 0 && oActivity.Child > 0  ? true : false,
															visibleL:  oActivity.ChildTicketPrice > 0 && oActivity.Child > 0  ? true : false,
															visibleM:  oActivity.ChildTicketPrice > 0 && oActivity.Child > 0  ? true : false,
															visibleS:  oActivity.ChildTicketPrice > 0 && oActivity.Child > 0  ? true : false
														})),
														
														
														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Total Pax:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.Text({
																	text: oActivity.Adult + " Adult + " + oActivity.Child + " Child " + " = " + oActivity.Totalpax
																}).addStyleClass("sapUiTinyMarginEnd")
																
															]
														}).setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12 S12"
														})),

														new sap.ui.layout.HorizontalLayout({
															content: [
																new sap.m.Text({
																	text: "Price:"
																}).addStyleClass("sapUiTinyMarginEnd"),
																
																new sap.m.ObjectNumber({
																	number:oActivity.TotalPrice,
																	unit:oActivity.Currency
																})

															]
														}).setLayoutData(new sap.ui.layout.GridData({
														   span: "L11 M11 S11"
														})),
														
														new sap.ui.core.Icon({
														src:"sap-icon://edit",
														visible:true,
														press:function(evt){
															
															that.onEditObject(evt,oActivity);
														}
														})
														.addStyleClass("sapUiTinyMarginTop TourDetailsIcon TourDetailsDeleteButton")
														.setLayoutData(new sap.ui.layout.GridData({
																		span: "L1 M1 S1"
																		
														})),
														new sap.m.ObjectAttribute({
																	title:"Duration",
																	text:oActivity.Duration
																
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12",
																    visibleXL: oActivity.Duration.length > 0 ? true : false,
																    visibleL:  oActivity.Duration.length > 0 ? true : false,
																    visibleM:  oActivity.Duration.length > 0 ? true : false,
																    visibleS:  oActivity.Duration.length > 0 ? true : false
														})),
														new sap.m.ObjectAttribute({
																	title:"Options",
																	text:oActivity.Option
																
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12",
																    visibleXL: oActivity.Option.length > 0 ? true : false,
																    visibleL:  oActivity.Option.length > 0 ? true : false,
																    visibleM:  oActivity.Option.length > 0 ? true : false,
																    visibleS:  oActivity.Option.length > 0 ? true : false
														})),
														new sap.m.ObjectAttribute({
																	title:"Remarks",
																	text:oActivity.Remarks
																
														}).setLayoutData(new sap.ui.layout.GridData({
																    span: "L12 M12 S12",
																    visibleXL: oActivity.Remarks.length > 0 ? true : false,
																    visibleL:  oActivity.Remarks.length > 0 ? true : false,
																    visibleM:  oActivity.Remarks.length > 0 ? true : false,
																    visibleS:  oActivity.Remarks.length > 0 ? true : false
														}))
												]
									}).addStyleClass("sapUiNoMargin CheckING")
									.setLayoutData(new sap.ui.layout.GridData({
														    span: "L12 M12 S12"
									}))
	
						]
				});
			return oControl;
		}
		
		
		
				
		
		

		});

	}
);