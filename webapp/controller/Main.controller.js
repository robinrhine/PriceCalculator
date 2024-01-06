sap.ui.define([
	"plentyHolidays/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel) {
	"use strict";

	return BaseController.extend("plentyHolidays.controller.Main", {
		
		onInit : function () {
			
			
			var oViewModel = new JSONModel({
					"TotalTourCost":0,
					"RoundFlights":[],
					"RoundHotels":[],
					"EditObject":"",
					"SortedTourList":[],	// generate table based on this property.
					"UnSortedTourList":[]
				});
			this.getView().setModel(oViewModel, "mainView");
			//console.log(this.getModel("mainView"));
			
			
			//var oHotelsListModel = new JSONModel(jQuery.sap.getModulePath("plentyHolidays.model", "/Hotels.json"));
			//this.getView().setModel(oHotelsListModel,"HT");
		},
		
		onSelectTabBar:function(oEvent){
			var oKey = oEvent.getSource().getSelectedKey();
			
			if(oKey === "Hotel"){
				if (!this._oViewHotelDialog) {
					this._oViewHotelDialog = sap.ui.xmlfragment("plentyHolidays.view.Hotel", this);
					this.getView().addDependent(this._oViewHotelDialog);
					// forward compact/cozy style into Dialog
					this._oViewHotelDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewHotelDialog.open();
				
				
			}else if(oKey === "Transfer"){
				if (!this._oViewTransferDialog) {
					this._oViewTransferDialog = sap.ui.xmlfragment("plentyHolidays.view.Transfer", this);
					this.getView().addDependent(this._oViewTransferDialog);
					// forward compact/cozy style into Dialog
					this._oViewTransferDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewTransferDialog.open();
			}else if(oKey === "Activity"){
				if (!this._oViewActivityDialog) {
					this._oViewActivityDialog = sap.ui.xmlfragment("plentyHolidays.view.Activity", this);
					this.getView().addDependent(this._oViewActivityDialog);
					// forward compact/cozy style into Dialog
					this._oViewActivityDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewActivityDialog.open();
				
			}else if(oKey === "Freeday"){
				if (!this._oViewFreeDayDialog) {
					this._oViewFreeDayDialog = sap.ui.xmlfragment("plentyHolidays.view.Freeday", this);
					this.getView().addDependent(this._oViewFreeDayDialog);
					// forward compact/cozy style into Dialog
					this._oViewFreeDayDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewFreeDayDialog.open();
				
			}else if(oKey === "Visa"){
				if (!this._oViewVisaDialog) {
					this._oViewVisaDialog = sap.ui.xmlfragment("plentyHolidays.view.Visa", this);
					this.getView().addDependent(this._oViewVisaDialog);
					// forward compact/cozy style into Dialog
					this._oViewVisaDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewVisaDialog.open();
				
			}else if(oKey === "Flight"){
				if (!this._oViewFlightDialog) {
					this._oViewFlightDialog = sap.ui.xmlfragment("plentyHolidays.view.Flight", this);
					this.getView().addDependent(this._oViewFlightDialog);
					// forward compact/cozy style into Dialog
					this._oViewFlightDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewFlightDialog.open();
				
			}
			else if(oKey === "Reset")
			{
						this.getModel("mainView").setProperty("/TotalTourCost",0);
						this.getModel("mainView").setProperty("/UnSortedTourList",[]);
						this.getModel("mainView").setProperty("/SortedTourList",[]);
			}
	
		},
		
		_handleValueHelpCloseForHotel:function(){
			this._oViewHotelDialog.close();
			this.getModel("mainView").setProperty("/EditObject","");
		},
		_handleValueHelpCloseForTransfer:function(){
			this._oViewTransferDialog.close();
			this.getModel("mainView").setProperty("/EditObject","");
		},
		_handleValueHelpCloseForActivity:function(){
			this._oViewActivityDialog.close();
			this.getModel("mainView").setProperty("/EditObject","");
		},
		_handleValueHelpCloseForVisa:function(){
			this._oViewVisaDialog.close();
			this.getModel("mainView").setProperty("/EditObject","");
		},
		_handleValueHelpCloseForFreeday:function(){
			this._oViewFreeDayDialog.close();
			this.getModel("mainView").setProperty("/EditObject","");
		},
		_handleValueHelpCloseForFlight:function(){
			this._oViewFlightDialog.close();
			this.getModel("mainView").setProperty("/EditObject","");
		},
		
	
		
		onBeforOpenFreeDay:function(){
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var Obj =  this.getModel("mainView").getProperty("/EditObject");
				//console.log(Obj);
				var  oView = sap.ui.getCore();
				oView.byId("FreedayDP1").setValue(Obj.Info.PlanningDate); 
				oView.byId("InputFreedaySuggestions").setValue(Obj.Info.Suggestion);
				
			}	
		},
		
		onBeforOpenVisa:function(){
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var Obj =  this.getModel("mainView").getProperty("/EditObject");
				//console.log(Obj);
				var  oView = sap.ui.getCore();
				oView.byId("inputVisaCountryName").setValue(Obj.Info.CountryName); 
				oView.byId("InputVisaAmount").setValue(this.removeCommas(Obj.Info.Fees)); 
				oView.byId("inputVisanumberofadult").setValue(Obj.Info.Adult);
				oView.byId("inputVisaTotalPrice").setValue(this.removeCommas(Obj.Info.TotalPrice));
				
				
			}
		},
		
		onBeforOpenFlight:function(){
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				
				var Obj =  this.getModel("mainView").getProperty("/EditObject");
				//console.log(Obj);
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				var oEFlObj = {};
				if(Obj.Index !== 0)
				{
					oEFlObj = oArray[this.onFindFirstIndexForRoundFlight(Obj.ID)];
				}else if (Obj.Index === 0)
				{
					oEFlObj = oArray[Obj.Index];
				}
				//console.log(oEFlObj);
				var  oView = sap.ui.getCore();
				oView.byId("inputFlightOrigin").setValue(oEFlObj.origin);
				oView.byId("inputFlightDestination").setValue(oEFlObj.destination);
				oView.byId("inputFlightDepartureDateTime").setValue(oEFlObj.departuredatetime);
				oView.byId("inputFlightReturnDateTime").setValue(oEFlObj.returndatetime);
				oView.byId("inputDepartureFlightNumber").setValue(oEFlObj.departureflightnumber);
				oView.byId("inputReturnFlightNumber").setValue(oEFlObj.returnflightnumber);
				oView.byId("inputFlightAdult").setValue(oEFlObj.numberofadult);
				oView.byId("inputFlightAdultPrice").setValue(oEFlObj.adultprice);
				oView.byId("inputFlightChild").setValue(oEFlObj.numberofchild);
				oView.byId("inputFlightChildPrice").setValue(oEFlObj.childprice);
				oView.byId("inputFlightInfant").setValue(oEFlObj.numberofinfant);
				oView.byId("inputFlightInfantPrice").setValue(oEFlObj.infantprice);
				oView.byId("inputFlightTotalPrice").setValue(oEFlObj.price);
				oView.byId("inputFlightRemarks").setValue(oEFlObj.remarks);
			
				
			}
		},
		
		onBeforOpenHotel:function(){
			
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
			
				
				var Obj =  this.getModel("mainView").getProperty("/EditObject");
				//console.log(Obj);
				var oArray = this.getModel("mainView").getProperty("/SortedTourList");
				var oEHObj = {};
				if(Obj.Index !== 0)
				{
					oEHObj = oArray[this.onFindFirstIndexForHotel(Obj.ID)];
				}else if (Obj.Index === 0)
				{
					oEHObj = oArray[Obj.Index];
				}
				//console.log(oEHObj);
				var  oView = sap.ui.getCore();
				oView.byId("DRS1").setValue(oEHObj.checkinoutdate); 
				oView.byId("inputDesctination").setValue(oEHObj.hotellocation); 
				oView.byId("inputHotelName").setValue(oEHObj.hotelname);
				oView.byId("inputRoomType").setValue(oEHObj.roomtype);
				oView.byId("inputRoomPrice").setValue(this.removeCommas(oEHObj.roomperdayprice));
				oView.byId("inputRooms").setValue(oEHObj.numberofrooms);
				oView.byId("inputExtraBeds").setValue(oEHObj.numberofextrabed);
				oView.byId("inputNumberOfNights").setValue(oEHObj.numberofnight);  
				oView.byId("inputTotalPrice").setValue(this.removeCommas(oEHObj.price));
				oView.byId("inputhotelnumberofadult").setValue(oEHObj.numberofadult);
				oView.byId("inputhotelnumberofchild").setValue(oEHObj.numberofchild);
				oView.byId("inputBookingId").setValue(oEHObj.confirmationnumber);
				oView.byId("inputhoteladdress").setValue(oEHObj.hoteladdress);
				oView.byId("inputExtraBedPrice").setValue(this.removeCommas(oEHObj.extrabedprice));
				oView.byId("inputHotelRemarks").setValue(oEHObj.remarks);
				
				oView.byId("TP1").setValue(oEHObj.checkintime);
				oView.byId("TP2").setValue(oEHObj.checkouttime);
				
				if(oEHObj.breakfast === "Y")
				{
					oView.byId("htlBreakfast").setSelectedIndex(0);	
				}else{
					oView.byId("htlBreakfast").setSelectedIndex(1);	
				}
				
				
				
			}
			
			
		},
		
		onBeforOpenTransfer:function(){
			
				
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var Obj =  this.getModel("mainView").getProperty("/EditObject");
				//console.log(Obj);
				var  oView = sap.ui.getCore();
				oView.byId("inputTransferFrom").setValue(Obj.Info.Origin);
				oView.byId("inputTransferTo").setValue(Obj.Info.Destination);
				oView.byId("inputTransferVeichleType").setSelectedKey(Obj.Info.VehicleType);
				oView.byId("inputTransferNumberofVechile").setValue(Obj.Info.NumberofVehicle);
				oView.byId("inputTransferPrice").setValue(this.removeCommas(Obj.Info.IndividualPrice));
				oView.byId("inputTransferpickupdatetime").setValue(Obj.Info.PickUpDateTime);
				oView.byId("inputTransferPickupzone").setValue(Obj.Info.PickupZone);
				oView.byId("inputTransferTotalPrice").setValue(this.removeCommas(Obj.Info.Price));
				oView.byId("inputTransferRemarks").setValue(Obj.Info.Remarks);
			
				
			}
		},
		
		onBeforOpenActivity:function(){
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var Obj =  this.getModel("mainView").getProperty("/EditObject");
				//console.log(Obj);
				var  oView = sap.ui.getCore();
				oView.byId("inputActivityDestination").setValue(Obj.Info.Origin);
				oView.byId("inputActivity").setValue(Obj.Info.ActivityName);
				oView.byId("inputActivityAdultPrice").setValue(this.removeCommas(Obj.Info.AdultTicketPrice));
				oView.byId("inputActivityAdult").setValue(Obj.Info.Adult);
				oView.byId("inputActivityChildPrice").setValue(this.removeCommas(Obj.Info.ChildTicketPrice));
				oView.byId("inputActivityChild").setValue(Obj.Info.Child);
				oView.byId("inputActivityDuration").setValue(Obj.Info.Duration);
				oView.byId("inputActivityOptions").setValue(Obj.Info.Option);
				oView.byId("inputActivitypickupdatetime").setValue(Obj.Info.PickUpDateTime);
				oView.byId("inputActivityPickupzone").setValue(Obj.Info.PickupZone);
				oView.byId("inputActivityTotalPrice").setValue(this.removeCommas(Obj.Info.TotalPrice));
				oView.byId("inputActivityRemarks").setValue(Obj.Info.Remarks);
				oView.byId("btnActivity").setEnabled(true);
				
			}
			
		},
		
		
		
		
		
		onChangeRoomPrice:function(oEvent)
		{
			var oView = sap.ui.getCore();
			oView.byId("btnHotel").setEnabled(false);
			oView.byId("DRS1").setValue("");
			if(parseInt(oEvent.getSource().getValue(),10) > 0)
			{
				oView.byId("inputRooms").setEnabled(true);
				oView.byId("DRS1").setEnabled(true);
				oView.byId("inputTotalPrice").setValue("");
				oView.byId("inputNumberOfNights").setValue(0);
				
			}else{
				oView.byId("inputRooms").setEnabled(false);	
				oView.byId("DRS1").setEnabled(false);
				oView.byId("DRS1").setValue("");
				oView.byId("inputTotalPrice").setValue("");
				oView.byId("inputNumberOfNights").setValue(0);
				
				
			}
		},
		onChangeInputRooms:function(oEvent){
			var oView = sap.ui.getCore();
			oView.byId("inputNumberOfNights").setValue(0);
			oView.byId("inputTotalPrice").setValue("");
			oView.byId("DRS1").setEnabled(true);
			oView.byId("DRS1").setValue("");
			oView.byId("btnHotel").setEnabled(false);
		},
		onChangeExtraBed:function(oEvnet)
		{
			var oView = sap.ui.getCore();
			oView.byId("inputNumberOfNights").setValue(0);
			oView.byId("inputTotalPrice").setValue("");
			oView.byId("DRS1").setEnabled(true);
			oView.byId("DRS1").setValue("");
			oView.byId("btnHotel").setEnabled(false);
		},
		
		onChangeExtraBedPrice:function(oEvent)
		{
			var oView = sap.ui.getCore();
			oView.byId("btnHotel").setEnabled(false);
			oView.byId("DRS1").setValue("");
			if(parseInt(oEvent.getSource().getValue(),10) > 0)
			{
				oView.byId("inputExtraBeds").setEnabled(true);
				oView.byId("inputExtraBeds").setValue(1);
				oView.byId("DRS1").setEnabled(true);
				oView.byId("DRS1").setValue("");
				oView.byId("inputTotalPrice").setValue("");
				oView.byId("inputNumberOfNights").setValue(0);
				
			}else{
				
				oView.byId("inputExtraBeds").setEnabled(false);	
				oView.byId("inputExtraBeds").setValue(0);
				oView.byId("DRS1").setEnabled(false);
				oView.byId("DRS1").setValue("");
				oView.byId("inputTotalPrice").setValue("");
				oView.byId("inputNumberOfNights").setValue(0);
			}
			
			if(oEvent.getSource().getValue().length === 0){
				oView.byId("DRS1").setEnabled(true);
				oView.byId("DRS1").setValue("");
			}
		},
		
		
		onDateSelection:function(oEvent){
			var oPerdayTotalPrice = 0;
			var oDateString  = oEvent.getSource().getValue();
			var oView = sap.ui.getCore();
			//var oDiffObject = this.dateDiff( this.convertTodateValue(new Date(oDateString.split("@")[0].trim())),this.convertTodateValue(new Date(oDateString.split("@")[1].trim())) );
			var oDiffObject = this.dateDiff(new Date(oDateString.split("@")[0].trim()),new Date(oDateString.split("@")[1].trim()));
			oView.byId("inputNumberOfNights").setValue(oDiffObject.d);
			var oRoomePrice = oView.byId("inputRoomPrice").getValue();
			var oNumberOfRoom = oView.byId("inputRooms").getValue();
			var oNumberOfExtra = oView.byId("inputExtraBeds").getValue();
			var oExtraBedPrice = oView.byId("inputExtraBedPrice").getValue();
			
			oPerdayTotalPrice = oNumberOfRoom * parseInt(oRoomePrice,10);
			if(oNumberOfExtra > 0)
			{
				oPerdayTotalPrice += oNumberOfExtra * parseInt(oExtraBedPrice,10);
			}
			
			
			oView.byId("inputTotalPrice").setValue(oDiffObject.d * oPerdayTotalPrice);
			oView.byId("btnHotel").setEnabled(true);
		},
		
		
		onChangeFlightNoOfAdult:function(oEvent){
			var oView = sap.ui.getCore();
			var oAdult = oEvent.getSource().getValue();
			var oAdultPrice = oView.byId("inputFlightAdultPrice").getValue(); 
			var oChild = oView.byId("inputFlightChild").getValue(); 
			var oChildPrice = oView.byId("inputFlightChildPrice").getValue(); 
			var oInfant = oView.byId("inputFlightInfant").getValue(); 
			var oInfantPrice = oView.byId("inputFlightInfantPrice").getValue(); 
			
			var oTotalPrice = (oAdult * oAdultPrice) + (oChild * oChildPrice) + (oInfant * oInfantPrice);
			oView.byId("inputFlightTotalPrice").setValue(oTotalPrice);
		},
		
		onChangeFlightNoOfChild:function(oEvent){
			var oView = sap.ui.getCore();
			
			var oAdultPrice = oView.byId("inputFlightAdultPrice").getValue(); 
			var oAdult = oView.byId("inputFlightAdult").getValue(); 
			var oChild = oEvent.getSource().getValue();
			var oChildPrice = oView.byId("inputFlightChildPrice").getValue(); 
			var oInfant = oView.byId("inputFlightInfant").getValue(); 
			var oInfantPrice = oView.byId("inputFlightInfantPrice").getValue(); 
			
			var oTotalPrice = (oAdult * oAdultPrice) + (oChild * oChildPrice) + (oInfant * oInfantPrice);
			oView.byId("inputFlightTotalPrice").setValue(oTotalPrice);
			
			
		},
		
		onChangeFlightNoOfInfant:function(oEvent){
			var oView = sap.ui.getCore();
			var oAdult = oView.byId("inputFlightAdult").getValue(); 
			var oAdultPrice = oView.byId("inputFlightAdultPrice").getValue(); 
			var oInfant = oEvent.getSource().getValue();
			var oInfantPrice = oView.byId("inputFlightInfantPrice").getValue(); 
			var oChild = oView.byId("inputFlightChild").getValue(); 
			var oChildPrice = oView.byId("inputFlightChildPrice").getValue(); 
			var oTotalPrice = (oAdult * oAdultPrice) + (oChild * oChildPrice) + (oInfant * oInfantPrice);
			oView.byId("inputFlightTotalPrice").setValue(oTotalPrice);
			
			
		},
		
		onChangeFlightAdultUnitPrice:function(oEvent){
			var oView = sap.ui.getCore();
			var oAdult = oView.byId("inputFlightAdult").getValue(); 
			var oAdultPrice = oEvent.getSource().getValue();
			var oInfant = oView.byId("inputFlightInfant").getValue();
			var oInfantPrice = oView.byId("inputFlightInfantPrice").getValue(); 
			var oChild = oView.byId("inputFlightChild").getValue(); 
			var oChildPrice = oView.byId("inputFlightChildPrice").getValue(); 
			var oTotalPrice = (oAdult * oAdultPrice) + (oChild * oChildPrice) + (oInfant * oInfantPrice);
			oView.byId("inputFlightTotalPrice").setValue(oTotalPrice);
		},
		
		onChangeFlightChildUnitPrice:function(oEvent){
			var oView = sap.ui.getCore();
			var oAdult = oView.byId("inputFlightAdult").getValue(); 
			var oAdultPrice = oView.byId("inputFlightAdultPrice").getValue();
			var oChild = oView.byId("inputFlightChild").getValue();
			var oChildPrice = oEvent.getSource().getValue();
			var oInfant = oView.byId("inputFlightInfant").getValue();
			var oInfantPrice = oView.byId("inputFlightInfantPrice").getValue();
			var oTotalPrice = (oAdult * oAdultPrice) + (oChild * oChildPrice) + (oInfant * oInfantPrice);
			oView.byId("inputFlightTotalPrice").setValue(oTotalPrice);
		},
		
		onChangeFlightInfantUnitPrice:function(oEvent){
			var oView = sap.ui.getCore();
			var oAdult = oView.byId("inputFlightAdult").getValue(); 
			var oAdultPrice = oView.byId("inputFlightAdultPrice").getValue();
			var oChild = oView.byId("inputFlightChild").getValue();
			var oChildPrice = oView.byId("inputFlightChildPrice").getValue();
			var oInfant =  oView.byId("inputFlightInfant").getValue(); 
			var oInfantPrice = oEvent.getSource().getValue();
			var oTotalPrice = (oAdult * oAdultPrice) + (oChild * oChildPrice) + (oInfant * oInfantPrice);
			oView.byId("inputFlightTotalPrice").setValue(oTotalPrice);
		},
		
		onConfirmFlight:function(){
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				//need to change....
				var OId = this.getModel("mainView").getProperty("/EditObject").ID;
				var oArray  = this.getModel("mainView").getProperty("/UnSortedTourList");
				var index = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				oArray.splice(index,1);
				
				//if round then remove other instance as well...
				var index1 = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				if(index1 !== -1){
					oArray.splice(index1,1);
				}
				
				this.getModel("mainView").setProperty("/EditObject","");
			}
			
			
				var oFlight = {}, oView = sap.ui.getCore();
				oFlight.Origin = oView.byId("inputFlightOrigin").getValue();
				oFlight.Destination = oView.byId("inputFlightDestination").getValue();
				oFlight.DepartureDateTime = oView.byId("inputFlightDepartureDateTime").getValue();
				oFlight.DepartureDate = this.convertTodateValue(new Date(oView.byId("inputFlightDepartureDateTime").getDateValue()));
				oFlight.DepartureTime = oView.byId("inputFlightDepartureDateTime").getValue().split(" ")[3];
				
				oFlight.ReturnDateTime = oView.byId("inputFlightReturnDateTime").getValue();
				oFlight.ReturnDate = this.convertTodateValue(new Date(oView.byId("inputFlightReturnDateTime").getDateValue()));
				oFlight.ReturnTime = oView.byId("inputFlightReturnDateTime").getValue().split(" ")[3];
				
				oFlight.DepartureFlightNo = oView.byId("inputDepartureFlightNumber").getValue();
				oFlight.ReturnFlightNo = oView.byId("inputReturnFlightNumber").getValue();
				oFlight.CarrierName = oView.byId("inputFlightCarrrierName").getValue();
				
				oFlight.NumberOfAdult = oView.byId("inputFlightAdult").getValue();
				oFlight.PerAdultPrice = oView.byId("inputFlightAdultPrice").getValue();
				oFlight.NumberOfChild = oView.byId("inputFlightChild").getValue();
				oFlight.PerChildPrice = oView.byId("inputFlightChildPrice").getValue();
				oFlight.NumberOfInfant = oView.byId("inputFlightInfant").getValue();
				oFlight.PerInfantPrice = oView.byId("inputFlightInfantPrice").getValue();
				
				oFlight.TotalPrice = oView.byId("inputFlightTotalPrice").getValue();
				oFlight.Remarks = oView.byId("inputFlightRemarks").getValue();
				
				
				var oObject = {};
				oObject.objectid = this.onGetrandomNumber();
			
				oObject.actiondatetime = oFlight.DepartureDate + " " + oFlight.DepartureTime;
				oObject.planningdate = oFlight.DepartureDate;
				oObject.origin = oFlight.Origin;
				oObject.destination = oFlight.Destination;
				oObject.departuredatetime = oFlight.DepartureDateTime;
				oObject.departuredate = oFlight.DepartureDate;
				oObject.departuretime = oFlight.DepartureTime;
				
				if(oFlight.ReturnDateTime !== "")
				{
					oObject.flighttype = "round";
					oObject.returndatetime = oFlight.ReturnDateTime;
					oObject.returndate = oFlight.ReturnDate;
					oObject.returntime = oFlight.ReturnTime;
				}else{
					oObject.flighttype = "oneway";
					oObject.returndate = "";
					oObject.returntime = "";
				}
				oObject.type = "Flight";
				oObject.departureflightnumber = oFlight.DepartureFlightNo;
				oObject.returnflightnumber = oFlight.ReturnFlightNo;
				oObject.carriername = oFlight.CarrierName;
				oObject.numberofadult = oFlight.NumberOfAdult;
				oObject.adultprice = oFlight.PerAdultPrice === "" ? "0" :  oFlight.PerAdultPrice;
				oObject.numberofchild = oFlight.NumberOfChild;
				oObject.childprice = oFlight.PerChildPrice === "" ? "0" :  oFlight.PerChildPrice;
				oObject.numberofinfant = oFlight.NumberOfInfant;
				oObject.infantprice = oFlight.PerInfantPrice === "" ? "0" :  oFlight.PerInfantPrice;
				oObject.price = oFlight.TotalPrice;
				oObject.remarks = oFlight.Remarks;
				oObject.currency = "BDT";
				this.getModel("mainView").getProperty("/UnSortedTourList").push(oObject);
				if(oObject.flighttype === "round")
				{
					var obj = {};
					obj.objectid = oObject.objectid;
					obj.actiondatetime = oFlight.ReturnDate + " " + oFlight.ReturnTime;
					obj.planningdate = oFlight.ReturnDate;
					obj.departuredatetime = oFlight.ReturnDateTime;
					obj.departuredate = oFlight.ReturnDate;
					obj.departuretime = oFlight.ReturnTime;
					obj.flightnumber = oFlight.ReturnFlightNo;
					
					obj.departureflightnumber = oFlight.ReturnFlightNo;
					obj.origin = oFlight.Destination;
					obj.destination = oFlight.Origin;
					obj.type = "Flight";
					obj.carriername = oFlight.CarrierName;
					obj.numberofadult = oFlight.NumberOfAdult ;
					obj.adultprice = oFlight.PerAdultPrice === "" ? "0" :  oFlight.PerAdultPrice;
					obj.numberofchild = oFlight.NumberOfChild;
					obj.childprice = oFlight.PerChildPrice === "" ? "0" :  oFlight.PerChildPrice;
					obj.numberofinfant = oFlight.NumberOfInfant;
					obj.infantprice = oFlight.PerInfantPrice  === "" ? "0" :  oFlight.PerInfantPrice;
					obj.remarks = oFlight.Remarks;
					obj.currency = "BDT";
					obj.flighttype = "round";
					obj.price = oFlight.TotalPrice;  // only for flight type return..
					obj.returndatetime = "";
					obj.returndate = "";
					obj.retruntime = "";
					obj.returnflightnumber = "";
					this.getModel("mainView").getProperty("/UnSortedTourList").push(obj);
				
				}
				
				this.onFormatTableData();
			
				this._handleValueHelpCloseForFlight();
		},
		
		onConfirmHotel:function(){
			
			/*if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var OId = this.getModel("mainView").getProperty("/EditObject").ID;
				var oArray  = this.getModel("mainView").getProperty("/UnSortedTourList");
				var index = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				oArray.splice(index,1);
			}*/
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				//need to change....
				var OId = this.getModel("mainView").getProperty("/EditObject").ID;
				var oArray  = this.getModel("mainView").getProperty("/UnSortedTourList");
				var index = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				oArray.splice(index,1);
				
				//if round then remove other instance as well...
				var index1 = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				if(index1 !== -1){
					oArray.splice(index1,1);
				}
				
				this.getModel("mainView").setProperty("/EditObject","");
			}
			
			
			
			
			var oHotel = {}, oView = sap.ui.getCore();
			oHotel.Destination = oView.byId("inputDesctination").getValue();
			oHotel.HotelName = oView.byId("inputHotelName").getValue();
			oHotel.RoomType = oView.byId("inputRoomType").getValue();
			oHotel.RoomPrice = oView.byId("inputRoomPrice").getValue();
			oHotel.NumberOfRooms = oView.byId("inputRooms").getValue();
			oHotel.ExtraBed = oView.byId("inputExtraBeds").getValue();
			oHotel.CheckInDate = this.convertTodateValue(new Date(oView.byId("DRS1").getValue().split("@")[0].trim())); 
			oHotel.CheckOutDate = this.convertTodateValue(new Date(oView.byId("DRS1").getValue().split("@")[1].trim())); 
			oHotel.CheckInOutDate = oView.byId("DRS1").getValue(); 
			oHotel.NumberOfNight = oView.byId("inputNumberOfNights").getValue();
			oHotel.TotalPrice = oView.byId("inputTotalPrice").getValue();
			oHotel.NumberOfAdult = oView.byId("inputhotelnumberofadult").getValue();
			oHotel.NumberOfChild = oView.byId("inputhotelnumberofchild").getValue();
			oHotel.ConfirmationiNumber = oView.byId("inputBookingId").getValue();
			oHotel.HotelAddress = oView.byId("inputhoteladdress").getValue();
			oHotel.ExtraBedPrice = oView.byId("inputExtraBedPrice").getValue();
			oHotel.Remarks = oView.byId("inputHotelRemarks").getValue();
			oHotel.CheckInTime = oView.byId("TP1").getValue();
			oHotel.CheckOutTime = oView.byId("TP2").getValue();
			oHotel.Breakfast = (oView.byId("htlBreakfast").getSelectedIndex() === 0 ) ? "Y" : "N";
			
			//console.log(oHotel);
			var oObject = {};
			oObject.objectid = this.onGetrandomNumber();
			oObject.actiondatetime = oHotel.CheckInDate + " " + oHotel.CheckInTime;
			oObject.planningdate = oHotel.CheckInDate;
			oObject.roomtype = oHotel.RoomType;
			oObject.type = "Hotel";
			oObject.hotelname = oHotel.HotelName;
			oObject.hotellocation = oHotel.Destination;
			oObject.checkindate = oHotel.CheckInDate;
			oObject.checkintime = oHotel.CheckInTime; // newly added by ahmed on Feb 6, 2020;
			oObject.checkouttime = oHotel.CheckOutTime; // newly added by ahmed on Feb 6, 2020;
			oObject.checkoutdate = oHotel.CheckOutDate;
			oObject.checkinoutdate = oHotel.CheckInOutDate;
			oObject.price = oHotel.TotalPrice;
			oObject.currency = "BDT";
			oObject.numberofadult = oHotel.NumberOfAdult;
			oObject.numberofchild = oHotel.NumberOfChild;
			oObject.confirmationnumber = oHotel.ConfirmationiNumber;
			oObject.hoteladdress = oHotel.HotelAddress;
			oObject.numberofextrabed = oHotel.ExtraBed;
			oObject.numberofrooms = oHotel.NumberOfRooms;
			oObject.roomperdayprice = oHotel.RoomPrice === "" ? "0" :  oHotel.RoomPrice;
			oObject.extrabedprice = oHotel.ExtraBedPrice === "" ? "0" :  oHotel.ExtraBedPrice;
			oObject.remarks = oHotel.Remarks;
			oObject.numberofnight = oHotel.NumberOfNight;
			oObject.breakfast = oHotel.Breakfast;
	
			this.getModel("mainView").getProperty("/UnSortedTourList").push(oObject);
			
			var obj = {};
			obj.objectid = oObject.objectid;
			obj.actiondatetime = oHotel.CheckOutDate + " " + oHotel.CheckOutTime;
			obj.planningdate = oHotel.CheckOutDate;
			obj.roomtype = oHotel.RoomType;
			obj.type = "Hotel";
			obj.hotelname = oHotel.HotelName;
			obj.hotellocation = oHotel.Destination;
			obj.checkindate = oHotel.CheckInDate;
			obj.checkintime = oHotel.CheckInTime; // newly added by ahmed on Feb 6, 2020;
			obj.checkouttime = oHotel.CheckOutTime; // newly added by ahmed on Feb 6, 2020;
			obj.checkoutdate = oHotel.CheckOutDate;
			obj.checkinoutdate = oHotel.CheckInOutDate;
			obj.price = oHotel.TotalPrice;
			obj.currency = "BDT";
			obj.numberofadult = oHotel.NumberOfAdult;
			obj.numberofchild = oHotel.NumberOfChild;
			obj.confirmationnumber = oHotel.ConfirmationiNumber;
			obj.hoteladdress = oHotel.HotelAddress;
			obj.numberofextrabed = oHotel.ExtraBed;
			obj.numberofrooms = oHotel.NumberOfRooms;
			obj.roomperdayprice = oHotel.RoomPrice === "" ? "0" :  oHotel.RoomPrice;
			obj.extrabedprice = oHotel.ExtraBedPrice === "" ? "0" :  oHotel.ExtraBedPrice;
			obj.remarks = oHotel.Remarks;
			obj.numberofnight = oHotel.NumberOfNight;
			obj.breakfast = oHotel.Breakfast;
			
			this.getModel("mainView").getProperty("/UnSortedTourList").push(obj);
			
			this.onFormatTableData();
			
			this._handleValueHelpCloseForHotel();
			
		},
		
		
		///Transfer.....................
		
		handleChangeForTransferDate:function(){
			var oView = sap.ui.getCore();
			oView.byId("btnTransfer").setEnabled(true);
		},
		onChangeVeichle:function(oEvent)
		{
			var oView = sap.ui.getCore();
			var oPrice = oView.byId("inputTransferPrice").getValue();
			oView.byId("inputTransferTotalPrice").setValue(oPrice * oEvent.getSource().getValue());
			
		},
		onLiveChnageTransferPrice:function(oEvent){
			var oView = sap.ui.getCore();
			if(oEvent.getSource().getValue() > 0 )
			{
				var totalPrice = 0;
				var oNubmerOfTransfer = oView.byId("inputTransferNumberofVechile").getValue();
				totalPrice = oNubmerOfTransfer * oEvent.getSource().getValue();
				oView.byId("inputTransferTotalPrice").setValue(totalPrice);
				
			}else{
				oView.byId("inputTransferTotalPrice").setValue(0);
			}
			
		},
		
		
		
		onConfirmTransfer:function(){
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var OId = this.getModel("mainView").getProperty("/EditObject").ID;
				var oArray  = this.getModel("mainView").getProperty("/UnSortedTourList");
				var index = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				oArray.splice(index,1);
			}
			
			var oTransfer = {},oView = sap.ui.getCore();
			oTransfer.From = oView.byId("inputTransferFrom").getValue();
			oTransfer.To = oView.byId("inputTransferTo").getValue(); 
			oTransfer.VehicleType = oView.byId("inputTransferVeichleType").getSelectedKey();
			oTransfer.NumberOfVeichle = oView.byId("inputTransferNumberofVechile").getValue();
			oTransfer.IndividualPrice = oView.byId("inputTransferPrice").getValue();
			oTransfer.PickUpDateTime = oView.byId("inputTransferpickupdatetime").getValue();
			
			//oTransfer.PickUpDate = this.convertTodateValue(new Date(oView.byId("inputTransferpickupdatetime").getValue().split(",")[0].trim()));
			//oTransfer.PickUpTime = this.ampmTo24(oView.byId("inputTransferpickupdatetime").getValue().split(",")[1].trim());
			
			//console.log(oView.byId("inputTransferpickupdatetime").getDateValue());
			//console.log(oView.byId("inputTransferpickupdatetime").getMinutesStep());
			
			oTransfer.PickUpDate = this.convertTodateValue(new Date(oView.byId("inputTransferpickupdatetime").getDateValue()));
			oTransfer.PickUpTime = oView.byId("inputTransferpickupdatetime").getValue().split(" ")[3];
			//oTransfer.PickUpTime = this.ampmTo24(oView.byId("inputTransferpickupdatetime").getValue().split(" ")[3] + " " + oView.byId("inputTransferpickupdatetime").getValue().split(" ")[4] );
			
			oTransfer.PickupZone = oView.byId("inputTransferPickupzone").getValue();
			oTransfer.TotalPrice =  oView.byId("inputTransferTotalPrice").getValue();
			oTransfer.Remarks = oView.byId("inputTransferRemarks").getValue();
			
			
			//console.log(oTransfer);
			
			var oObject = {};
			oObject.objectid = this.onGetrandomNumber();
			//oObject.actiondatetime =  oTransfer.PickUpDate + " " + oTransfer.PickUpTime + ":000";
			oObject.actiondatetime =  oTransfer.PickUpDate + " " + oTransfer.PickUpTime;
			oObject.planningdate = oTransfer.PickUpDate;
			oObject.vechileservicetype = "single";
			oObject.origin = oTransfer.From;
			oObject.destination = oTransfer.To;
			oObject.picuptime = oTransfer.PickUpTime;
			oObject.pickupdatetime = oTransfer.PickUpDateTime;
			oObject.picupzone = oTransfer.PickupZone;
			oObject.price = oTransfer.TotalPrice;
			oObject.individualprice = oTransfer.IndividualPrice;
			oObject.type = "Transfer";
			oObject.vehicletype = oTransfer.VehicleType;
			oObject.numberofvehicle = oTransfer.NumberOfVeichle;
			oObject.remarks = oTransfer.Remarks;
			oObject.currency = "BDT";
			
			//console.log(oObject);
			
			this.getModel("mainView").getProperty("/UnSortedTourList").push(oObject);
			this.onFormatTableData();
			this._handleValueHelpCloseForTransfer();
			
			
		},
		
		//// Activity...
		onLiveChangeActivityAdultPrice:function(oEvent){
			var oView = sap.ui.getCore();
			if(oEvent.getSource().getValue() > 0 )
			{
				var TotalPrice = 0;
				var numberofAdult = oView.byId("inputActivityAdult").getValue();
				var numberofChild = oView.byId("inputActivityChild").getValue();
				var ChildPrice = oView.byId("inputActivityChildPrice").getValue();
				
				TotalPrice = numberofAdult * oEvent.getSource().getValue();
				if(ChildPrice > 0 && numberofChild > 0)
				{
					TotalPrice += ChildPrice * numberofChild;
				}
				oView.byId("inputActivityTotalPrice").setValue(TotalPrice);
				oView.byId("btnActivity").setEnabled(true);
			}else{
				oView.byId("inputActivityChildPrice").setValue(0);
				oView.byId("inputActivityChild").setValue(0);
				oView.byId("inputActivityTotalPrice").setValue(0);
				oView.byId("btnActivity").setEnabled(false);
			}
		},
		
		onLiveChangeActivityChildPrice:function(oEvent){
			var oView = sap.ui.getCore();
			var TotalPrice = 0;
			var numberofAdult = oView.byId("inputActivityAdult").getValue();
			var numberofChild = oView.byId("inputActivityChild").getValue();
			var AdultPrice = oView.byId("inputActivityAdultPrice").getValue();
			if(oEvent.getSource().getValue() > 0 )
			{
				
				

				TotalPrice = numberofChild * oEvent.getSource().getValue();
				if(AdultPrice > 0 && numberofAdult > 0)
				{
					TotalPrice += AdultPrice * numberofAdult;
				}
				oView.byId("inputActivityTotalPrice").setValue(TotalPrice);
			}else{
				TotalPrice = AdultPrice * numberofAdult;
				oView.byId("inputActivityTotalPrice").setValue(TotalPrice);
			}
		},
		
		onChangeActivityAdultNumber:function(oEvent){
			var oView = sap.ui.getCore();
			var TotalPrice = 0;
			var numberofChild = oView.byId("inputActivityChild").getValue();
			var AdultPrice = oView.byId("inputActivityAdultPrice").getValue();
			var ChildPrice = oView.byId("inputActivityChildPrice").getValue();
			
			if(AdultPrice > 0 ){
				TotalPrice = AdultPrice * oEvent.getSource().getValue();
			}
			
			if(ChildPrice > 0 &&  numberofChild > 0 ){
				TotalPrice += ChildPrice * numberofChild;
			}
			oView.byId("inputActivityTotalPrice").setValue(TotalPrice);
		},
		onChangeActivityChildNumber:function(oEvent){
			var oView = sap.ui.getCore();
			var TotalPrice = 0;
			var numberofAdult = oView.byId("inputActivityAdult").getValue();
			var AdultPrice = oView.byId("inputActivityAdultPrice").getValue();
			var ChildPrice = oView.byId("inputActivityChildPrice").getValue();
			
			if(AdultPrice > 0  && numberofAdult > 0)
			{
				TotalPrice = AdultPrice * numberofAdult;
			}
			
			if(ChildPrice > 0 &&  oEvent.getSource().getValue() > 0 )
			{
				TotalPrice += ChildPrice * oEvent.getSource().getValue();
			}
			oView.byId("inputActivityTotalPrice").setValue(TotalPrice);
		},
		
		
		
		onConfirmActivity:function(){
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var OId = this.getModel("mainView").getProperty("/EditObject").ID;
				var oArray  = this.getModel("mainView").getProperty("/UnSortedTourList");
				var index = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				oArray.splice(index,1);
			}
			
			
			var oActivity = {};
			var oView = sap.ui.getCore();
			oActivity.Desctination = oView.byId("inputActivityDestination").getValue();
			oActivity.ActivityName = oView.byId("inputActivity").getValue();
			oActivity.AdultPrice = oView.byId("inputActivityAdultPrice").getValue();
			oActivity.NumberOfAdult = oView.byId("inputActivityAdult").getValue();
			oActivity.ChildPrice = oView.byId("inputActivityChildPrice").getValue();
			oActivity.NumberOfChild = oView.byId("inputActivityChild").getValue();
			oActivity.Duration = oView.byId("inputActivityDuration").getValue();
			oActivity.Options = oView.byId("inputActivityOptions").getValue();
			//oActivity.PickUpDate = this.convertTodateValue(new Date(oView.byId("inputActivitypickupdatetime").getValue().split(",")[0].trim()));
			//oActivity.PickUpTime = this.ampmTo24(oView.byId("inputActivitypickupdatetime").getValue().split(",")[1].trim());
			
			oActivity.PickUpDate = this.convertTodateValue(new Date(oView.byId("inputActivitypickupdatetime").getDateValue()));
			oActivity.PickUpTime = oView.byId("inputActivitypickupdatetime").getValue().split(" ")[3];
			
			oActivity.PickUpDateTime = oView.byId("inputActivitypickupdatetime").getValue();
			oActivity.PickUpZone = oView.byId("inputActivityPickupzone").getValue();
			oActivity.Remarks = oView.byId("inputActivityRemarks").getValue();
			oActivity.TotalPrice = oView.byId("inputActivityTotalPrice").getValue();
			
			
			//console.log(oActivity);
			
			var oObject = {};
			oObject.objectid = this.onGetrandomNumber();
			oObject.actiondatetime = oActivity.PickUpDate + " " + oActivity.PickUpTime;
			oObject.planningdate = oActivity.PickUpDate;
			oObject.origin = oActivity.Desctination;
			oObject.type = "Activity";
			oObject.activityname = oActivity.ActivityName;
			oObject.duration = oActivity.Duration;
			oObject.numberofadult = oActivity.NumberOfAdult;
			oObject.numberofchild = oActivity.NumberOfChild;
			oObject.perpaxadultprice =  oActivity.AdultPrice;
			oObject.perpaxchildprice =  oActivity.ChildPrice;
			oObject.picuptime = oActivity.PickUpTime;
			oObject.picupdate = oActivity.PickUpDate;
			oObject.picupdatetime = oActivity.PickUpDateTime;
			oObject.picuplocation = oActivity.PickUpZone;
			oObject.option = oActivity.Options;
			oObject.remarks = oActivity.Remarks;
			oObject.price = oActivity.TotalPrice;
			oObject.currency = "BDT";
			
			
			this.getModel("mainView").getProperty("/UnSortedTourList").push(oObject);
			this.onFormatTableData();
			this._handleValueHelpCloseForActivity();
			
			
		},
		
		onConfirmFreeday:function(){
			
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var OId = this.getModel("mainView").getProperty("/EditObject").ID;
				var oArray  = this.getModel("mainView").getProperty("/UnSortedTourList");
				var index = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				oArray.splice(index,1);
			}
				
				
				var oView = sap.ui.getCore();
				var oFreeDay = {};
				var oDate = oView.byId("FreedayDP1").getDateValue();
				var oMonth = oDate.getMonth() + 1;
				var oMonthFormat = (oMonth < 10) ? "0" + oMonth : oMonth;
				
				
				oFreeDay.ActionDay = oDate.getFullYear() + "." + oMonthFormat + "." + oDate.getDate();
				oFreeDay.Suggestions = oView.byId("InputFreedaySuggestions").getValue();
				
				
				
			var oObject = {};
			oObject.objectid = this.onGetrandomNumber();
			oObject.actiondatetime = oFreeDay.ActionDay + " " + "05:00:000";
			oObject.planningdate = oFreeDay.ActionDay;
			oObject.suggestion = oFreeDay.Suggestions;
			oObject.type = "Freeday";
			oObject.price = "0";
			oObject.currency = "BDT";
			
			//console.log(oObject);
			this.getModel("mainView").getProperty("/UnSortedTourList").push(oObject);
			this.onFormatTableData();
			
			this._handleValueHelpCloseForFreeday();
				
			
		},
		
		
		
		onConfirmVisa:function(){
			
			if(this.getModel("mainView").getProperty("/EditObject") !== "")
			{
				var OId = this.getModel("mainView").getProperty("/EditObject").ID;
				var oArray  = this.getModel("mainView").getProperty("/UnSortedTourList");
				var index = oArray.map(function(e) { return e.objectid; }).indexOf(OId);
				oArray.splice(index,1);
			}
			
			
			
			var oView = sap.ui.getCore();
			
			var oVisa = {};
			
			oVisa.CountryName = oView.byId("inputVisaCountryName").getValue();
			oVisa.NumberOfAdult = oView.byId("inputVisanumberofadult").getValue(); 
			oVisa.VisaFees = oView.byId("InputVisaAmount").getValue();
			oVisa.VisaFeesTotalPrice = oView.byId("inputVisaTotalPrice").getValue();
			//console.log(oVisa);
			
			var oDate = new Date();
			var oMonth = oDate.getMonth() + 1;
			var oMonthFormat = (oMonth < 10) ? "0" + oMonth : oMonth;
			
			var oObject = {};
			oObject.objectid = this.onGetrandomNumber();
			//oObject.actiondatetime = oDate.getFullYear() + "." + oMonthFormat + "." + oDate.getDate() + " " + "09:00:000";
			oObject.actiondatetime = oDate.getFullYear() + "." + oMonthFormat + "." + oDate.getDate() + " " + "09:00";
			oObject.planningdate = oDate.getFullYear() + "." + oMonthFormat + "." + oDate.getDate();
			oObject.countryname = oVisa.CountryName;
			oObject.type = "Visa";
			oObject.numberofadult = oVisa.NumberOfAdult;
			oObject.perpaxadultprice = oVisa.VisaFees;
			oObject.price = oVisa.VisaFeesTotalPrice;
			oObject.currency = "BDT";
			
			//console.log(oObject);
			this.getModel("mainView").getProperty("/UnSortedTourList").push(oObject);
			this.onFormatTableData();
			
			this._handleValueHelpCloseForVisa();
			
			
			
			
		},
		
		onLiveChangeVisaFeesPrice:function(oEvent){
			var oView = sap.ui.getCore();
			var perAmount = oEvent.getSource().getValue();
			var noOfAdult = oView.byId("inputVisanumberofadult").getValue();
			oView.byId("inputVisaTotalPrice").setValue(parseInt(noOfAdult,10) * parseInt(perAmount,10));
			
		},
		
		onChangeVisaAdultNumber:function(oEvent){
			var oView = sap.ui.getCore();
			var noOfAdult = oEvent.getSource().getValue();
			var perAmount = oView.byId("InputVisaAmount").getValue();
			oView.byId("inputVisaTotalPrice").setValue(parseInt(noOfAdult,10) * parseInt(perAmount,10));
		},
		
		
		
		onupdateTableFinishedForTourdetails:function(){
			var oTotal = this.getModel("mainView").getProperty("/TotalTourCost");
			this.getView().byId("totalCostObj").setText(oTotal);
			
			if(parseInt(oTotal,10) > 0){
				this.getView().byId("btnInvoice").setVisible(true);
			}else{
				this.getView().byId("btnInvoice").setVisible(false);
			}
		},
		
		onFormatTableData:function(){
			var oNewArray = this.getModel("mainView").getProperty("/UnSortedTourList").sort(function(a,b)
			{
				   
				   
				   /*var aDateTime = a.actiondatetime.split(" ")[0].replace(".", "-").replace(".","-").replace(".","-") + " " + a.actiondatetime.split(" ")[1]+":000";
				   var bDateTime = b.actiondatetime.split(" ")[0].replace(".", "-").replace(".","-").replace(".","-") + " " + b.actiondatetime.split(" ")[1]+":000";
				   return new Date(aDateTime) - new Date(bDateTime);*/
				   
				   
				   var aD = a.actiondatetime.split(" ")[0];
				   var aT = a.actiondatetime.split(" ")[1];
				   var bD = b.actiondatetime.split(" ")[0];
				   var bT = b.actiondatetime.split(" ")[1];
				   
				   var aDateTime = new Date(aD.split(".")[0], parseInt(aD.split(".")[1],10)-1, aD.split(".")[2], aT.split(":")[0],aT.split(":")[1] );
				   var bDateTime = new Date(bD.split(".")[0], parseInt(bD.split(".")[1],10)-1, bD.split(".")[2], bT.split(":")[0],bT.split(":")[1] );
				   return aDateTime - bDateTime;
				                     
			});
			this.getModel("mainView").setProperty("/SortedTourList",oNewArray);
			
			//console.log(oNewArray);
			
			this.onLoadDataForTripDetailsNew();
		},
		
		onLoadDataForTripDetailsNew:function(){
			var that = this;
			var oTable = this.getView().byId("tbltrip");
			oTable.destroyItems();
			this.getModel("mainView").setProperty("/EditObject","");
			this.getModel("mainView").setProperty("/RoundFlights",[]);
			this.getModel("mainView").setProperty("/RoundHotels",[]);
			//need to add hotels as well
			
			var oTotalPrice = 0;
			
				oTable.bindAggregation("items", "mainView>/SortedTourList", function(sId, oContext) 
				{
					var oRenderControl = "";
					var oType =  oContext.getProperty("type");
								
									if(oType === "Transfer")
									{
										var oCar = {};
										oCar.ObjectId = oContext.getProperty("objectid");
										oCar.Origin = oContext.getProperty("origin");
										oCar.Destination = oContext.getProperty("destination");
										oCar.PickupTime = oContext.getProperty("picuptime");
										oCar.PickUpDateTime = oContext.getProperty("pickupdatetime");
										oCar.Price = that.numberWithCommas(oContext.getProperty("price"));
										oCar.IndividualPrice = that.numberWithCommas(oContext.getProperty("individualprice"));
										oCar.Currency = oContext.getProperty("currency");
										//oCar.PlanningDate = that.converttoNewdateFormat( new Date( oContext.getProperty("planningdate")));
										oCar.PlanningDate =  that.converttoNewdateFormat(oContext.getProperty("planningdate"));
										oCar.ObjectType = oContext.getProperty("type");
										oCar.VehicleType = oContext.getProperty("vehicletype");
										oCar.NumberofVehicle = oContext.getProperty("numberofvehicle");
										oCar.ServiceType = oContext.getProperty("vechileservicetype");
										oCar.PickupZone = oContext.getProperty("picupzone");
										oCar.Remarks = oContext.getProperty("remarks");
										oRenderControl = that.onLoadCarTemplate(oCar);
										
									
										//oTotalPrice = oTotalPrice + parseInt(oCar.Price,10);
										oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										that.getModel("mainView").setProperty("/TotalTourCost",oTotalPrice);
										
									}if(oType === "Flight")
									{
											
										
										var oFlight = {};
										oFlight.ObjectId = oContext.getProperty("objectid");
										oFlight.Origin = oContext.getProperty("origin");
										oFlight.Destination = oContext.getProperty("destination");
										oFlight.Price = that.numberWithCommas(oContext.getProperty("price"));
										oFlight.Currency = oContext.getProperty("currency");
										oFlight.PlanningDate =  that.converttoNewdateFormat(oContext.getProperty("planningdate"));
										oFlight.ObjectType = oContext.getProperty("type");
										oFlight.FlightType = oContext.getProperty("flighttype");
										oFlight.FlightNumber = oContext.getProperty("departureflightnumber");
										oFlight.CarrierName = oContext.getProperty("carriername");
										oFlight.NoOfAdult = oContext.getProperty("numberofadult");
										oFlight.AdultPrice = oContext.getProperty("adultprice");
										oFlight.NoOfChild = oContext.getProperty("numberofchild");
										oFlight.ChildPrice = oContext.getProperty("childprice");
										oFlight.NoOfInfant = oContext.getProperty("numberofinfant");
										oFlight.InfantPrice = oContext.getProperty("infantprice");
										oFlight.DepartureDateTime = oContext.getProperty("departuredatetime");
										oFlight.DepartureDate = that.converttoNewdateFormat(oContext.getProperty("departuredate"));
										oFlight.DepartureTime = oContext.getProperty("departuretime");
									
										oFlight.Remarks = oContext.getProperty("remarks");
										oRenderControl = that.onLoadFlightTemplate(oFlight);
										
										
										var oRoundFlights = that.getModel("mainView").getProperty("/RoundFlights");
										if(oFlight.FlightType === "round" && oRoundFlights.indexOf(oFlight.ObjectId) === -1 )
										{
											that.getModel("mainView").getProperty("/RoundFlights").push(oFlight.ObjectId);
											oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										}else if(oFlight.FlightType === "oneway"){
											oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										}
										
										//oTotalPrice = oTotalPrice + parseInt(oFlight.Price,10);
										that.getModel("mainView").setProperty("/TotalTourCost",oTotalPrice);
										
									
									
										
										
									}else if(oType === "Hotel")
									{	
										
										var oHotel = {};
										oHotel.ObjectId = oContext.getProperty("objectid");
										//oHotel.CheckInDate = that.converttoNewdateFormat( new Date(oContext.getProperty("checkindate")));
										//oHotel.CheckOutDate = that.converttoNewdateFormat( new Date(oContext.getProperty("checkoutdate")));
										oHotel.CheckInDate = that.converttoNewdateFormat(oContext.getProperty("checkindate"));
										oHotel.CheckOutDate = that.converttoNewdateFormat(oContext.getProperty("checkoutdate"));
										
										
										oHotel.CheckInOutDate = oContext.getProperty("checkinoutdate");
										oHotel.NumberOfNights = oContext.getProperty("numberofnight");
										oHotel.HotelName = oContext.getProperty("hotelname");
										oHotel.Location =  oContext.getProperty("hotellocation");
										oHotel.RoomType = oContext.getProperty("roomtype");
										oHotel.Price =  that.numberWithCommas(oContext.getProperty("price"));
										oHotel.Currency =  oContext.getProperty("currency");
										//oHotel.PlanningDate = that.converttoNewdateFormat( new Date(oContext.getProperty("planningdate")));
										oHotel.PlanningDate =  that.converttoNewdateFormat(oContext.getProperty("planningdate"));
										oHotel.ObjectType = oContext.getProperty("type");
										oHotel.NumberOfAdult = oContext.getProperty("numberofadult");
										oHotel.NumberOfChild = oContext.getProperty("numberofchild");
										oHotel.ConfirmationNumber = oContext.getProperty("confirmationnumber");
										oHotel.HotelAddress = oContext.getProperty("hoteladdress");
										oHotel.NumberOfRooms = oContext.getProperty("numberofrooms");
										oHotel.NumberOfExtraBed = oContext.getProperty("numberofextrabed");
										oHotel.Remarks = oContext.getProperty("remarks");
										oHotel.PerdayPrice = that.numberWithCommas( oContext.getProperty("roomperdayprice"));
										oHotel.ExtraBedPrice = that.numberWithCommas( oContext.getProperty("extrabedprice"));
										
										
										oRenderControl = that.onLoadHotelTemplate(oHotel);
										//oTotalPrice = oTotalPrice + parseInt(oHotel.Price,10);
										//oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										//that.getModel("mainView").setProperty("/TotalTourCost",oTotalPrice);
										
										//this.getModel("mainView").setProperty("/RoundHotels",[]);
										var oHotelIDs = that.getModel("mainView").getProperty("/RoundHotels");
										if( oHotelIDs.indexOf(oHotel.ObjectId) === -1 )
										{
											that.getModel("mainView").getProperty("/RoundHotels").push(oHotel.ObjectId);
											oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										}
										
										
										that.getModel("mainView").setProperty("/TotalTourCost",oTotalPrice);
										
										
										
									}else if(oType === "Activity")
									{
										var oActivity = {};
										oActivity.ObjectId = oContext.getProperty("objectid");
										oActivity.Origin = oContext.getProperty("origin");
										oActivity.ActivityName = oContext.getProperty("activityname");  
										oActivity.Duration = oContext.getProperty("duration");
										
										oActivity.Adult = oContext.getProperty("numberofadult");  
										oActivity.Child = oContext.getProperty("numberofchild"); 
										oActivity.Totalpax = parseInt(oActivity.Adult,10) + parseInt(oActivity.Child ,10);
										oActivity.AdultTicketPrice = that.numberWithCommas( oContext.getProperty("perpaxadultprice"));
										oActivity.ChildTicketPrice = that.numberWithCommas(  oContext.getProperty("perpaxchildprice"));
										
										oActivity.PickupTime = oContext.getProperty("picuptime");
										oActivity.PickUpDateTime = oContext.getProperty("picupdatetime");
										oActivity.PickupZone = oContext.getProperty("picuploation");
										oActivity.Option = oContext.getProperty("option");
										oActivity.Remarks = oContext.getProperty("remarks");
										oActivity.Currency = oContext.getProperty("currency");
										//oActivity.PlanningDate = that.converttoNewdateFormat( new Date(oContext.getProperty("planningdate")));
										oActivity.PlanningDate =  that.converttoNewdateFormat(oContext.getProperty("planningdate"));
										oActivity.ObjectType = oContext.getProperty("type");
										oActivity.TotalPrice = that.numberWithCommas(oContext.getProperty("price"));
										
										oRenderControl = that.onLoadActivityTemplate(oActivity);
										//oTotalPrice = oTotalPrice + parseInt(oActivity.TotalPrice,10);
										oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										that.getModel("mainView").setProperty("/TotalTourCost",oTotalPrice);
									}else if(oType === "Visa")
									{
										var oVisa = {};
										oVisa.ObjectId = oContext.getProperty("objectid");
										oVisa.CountryName = oContext.getProperty("countryname");
										oVisa.Adult = oContext.getProperty("numberofadult");  
										oVisa.Currency = oContext.getProperty("currency");
										oVisa.Fees = oContext.getProperty("perpaxadultprice");
									
										oVisa.PlanningDate =  that.converttoNewdateFormat(oContext.getProperty("planningdate"));
										oVisa.ObjectType = oContext.getProperty("type");
										oVisa.TotalPrice = that.numberWithCommas(oContext.getProperty("price"));
										
										oRenderControl = that.onLoadVisaTemplate(oVisa);
										//oTotalPrice = oTotalPrice + parseInt(oActivity.TotalPrice,10);
										oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										that.getModel("mainView").setProperty("/TotalTourCost",oTotalPrice);
									}else if(oType === "Freeday")
									{
										
										/*var oObject = {};
										oObject.objectid = this.onGetrandomNumber();
										oObject.actiondatetime = oFreeDay.ActionDay + " " + "09:00:000";
										oObject.planningdate = oFreeDay.ActionDay;
										oObject.suggestion = oFreeDay.Suggestions;
										oObject.type = "Freeday";
										oObject.price = "0";
										oObject.currency = "BDT";*/
										
										
										var oFreeday = {};
										oFreeday.ObjectId = oContext.getProperty("objectid");
										oFreeday.Suggestion = oContext.getProperty("suggestion");  
										oFreeday.Currency = oContext.getProperty("currency");
										oFreeday.PlanningDate =  that.converttoNewdateFormat(oContext.getProperty("planningdate"));
										oFreeday.ObjectType = oContext.getProperty("type");
										oFreeday.TotalPrice = that.numberWithCommas(oContext.getProperty("price"));
										
										oRenderControl = that.onLoadFreeDayTemplate(oFreeday);
										//oTotalPrice = oTotalPrice + parseInt(oActivity.TotalPrice,10);
										oTotalPrice = oTotalPrice + parseInt(oContext.getProperty("price"),10);
										that.getModel("mainView").setProperty("/TotalTourCost",oTotalPrice);
									}
									
									return new sap.m.ColumnListItem({
										cells: 
										[
											oRenderControl,
											new sap.m.Text({
												text: ""
											})	
										]
									});
				});
		},
		
		onEditObject:function(oEvent,Object){
			var oItem = oEvent.getSource().getParent().getParent().getParent(),
				oTable = oEvent.getSource().getParent().getParent().getParent().getParent(),
				oIndex = oTable.indexOfItem(oItem);
				
				var oEditObject = {};
				oEditObject.Info = Object;
				oEditObject.Index = oIndex;
				oEditObject.ID = Object.ObjectId; 
				
				this.getModel("mainView").setProperty("/EditObject","");	
				this.getModel("mainView").setProperty("/EditObject",oEditObject);	
				
				if(Object.ObjectType === "Hotel")
				{
					this.onEditHotel(oEvent,Object,oIndex);
					//sap.m.MessageToast.show("Hotel");
					
				}else if(Object.ObjectType === "Transfer")
				{
					//sap.m.MessageToast.show("Transfer");
					this.onEditTransfer(oEvent,Object,oIndex);
				}else if(Object.ObjectType === "Activity")
				{
					//sap.m.MessageToast.show("Activity");
					this.onEditActivity(oEvent,Object,oIndex);
					
				}else if(Object.ObjectType === "Visa")
				{
					//sap.m.MessageToast.show("Activity");
					this.onEditVisa(oEvent,Object,oIndex);
					
				}else if(Object.ObjectType === "Freeday")
				{
					//sap.m.MessageToast.show("Activity");
					this.onEditFreeDay(oEvent,Object,oIndex);
					
				}else if(Object.ObjectType === "Flight")
				{
					//sap.m.MessageToast.show("Activity");
					this.onEditFlight(oEvent,Object,oIndex);
					
				}                             
			
		},
		
		onEditFlight: function(oEvt,Object,oIndex)
		{
			if (!this._oViewFlightDialog) {
					this._oViewFlightDialog = sap.ui.xmlfragment("plentyHolidays.view.Hotel", this);
					this.getView().addDependent(this._oViewFlightDialog);
					// forward compact/cozy style into Dialog
					this._oViewFlightDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
			this._oViewFlightDialog.open();
		},
		
		onEditHotel: function(oEvt,Object,oIndex)
		{
			if (!this._oViewHotelDialog) {
					this._oViewHotelDialog = sap.ui.xmlfragment("plentyHolidays.view.Hotel", this);
					this.getView().addDependent(this._oViewHotelDialog);
					// forward compact/cozy style into Dialog
					this._oViewHotelDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
			this._oViewHotelDialog.open();
		},
		
		onEditVisa: function(oEvt,Object,oIndex)
		{
				if (!this._oViewVisaDialog) {
					this._oViewVisaDialog = sap.ui.xmlfragment("plentyHolidays.view.Visa", this);
					this.getView().addDependent(this._oViewVisaDialog);
					// forward compact/cozy style into Dialog
					this._oViewVisaDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewVisaDialog.open();
		},
		
		onEditFreeDay: function(oEvt,Object,oIndex)
		{
				if (!this._oViewFreeDayDialog) {
					this._oViewFreeDayDialog = sap.ui.xmlfragment("plentyHolidays.view.Freeday", this);
					this.getView().addDependent(this._oViewFreeDayDialog);
					// forward compact/cozy style into Dialog
					this._oViewFreeDayDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewFreeDayDialog.open();
		},
		onEditTransfer: function(oEvt,Object,oIndex)
		{
				if (!this._oViewTransferDialog) {
					this._oViewTransferDialog = sap.ui.xmlfragment("plentyHolidays.view.Transfer", this);
					this.getView().addDependent(this._oViewTransferDialog);
					// forward compact/cozy style into Dialog
					this._oViewTransferDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewTransferDialog.open();
		},
		
		onEditActivity: function(oEvt,Object,oIndex)
		{
				if (!this._oViewActivityDialog) {
					this._oViewActivityDialog = sap.ui.xmlfragment("plentyHolidays.view.Activity", this);
					this.getView().addDependent(this._oViewActivityDialog);
					// forward compact/cozy style into Dialog
					this._oViewActivityDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewActivityDialog.open();
		},
		
		onProceedToInvoice:function(){
				var oView = sap.ui.getCore();
				var oCustomer = {};
				oCustomer.Name = oView.byId("inputCustomerName").getValue();  
				oCustomer.Address = oView.byId("Inputcustomeraddress").getValue();  
				oCustomer.Email = oView.byId("Inputcustomeremailaddress").getValue();  
				oCustomer.ContactNumber = oView.byId("Inputcustomercontactnumber").getValue();
				oCustomer.Discount = oView.byId("Inputcustomerdiscount").getValue();
				oCustomer.TripName = oView.byId("Inputcustomertripname").getValue();
				oCustomer.Adults = oView.byId("inputnumberofadult").getValue();
				oCustomer.Child = oView.byId("inputnumberofchild").getValue();
				oCustomer.Infant = oView.byId("inputnumberofinfant").getValue();
				
				this.getModel("Vacachi").setProperty("/CustomerInfo",{});
				this.getModel("Vacachi").setProperty("/CustomerInfo",oCustomer);
				
				
				
				this.getModel("Vacachi").setProperty("/ItenaryList",[]);
				this.getModel("Vacachi").setProperty("/TotalPrice",0);
				this.getModel("Vacachi").setProperty("/TotalPrice",parseInt(this.getView().byId("totalCostObj").getText(),10));
				this.getModel("Vacachi").setProperty("/ItenaryList", this.getModel("mainView").getProperty("/SortedTourList"));
				//this.getModel("Vacachi").setProperty("/RoundFlightsIDList", this.getModel("mainView").getProperty("/RoundFlights"));
					
				
				//this.getRouter().navTo("object");
				
				//onGetrandomNumber
				
					this.getRouter().navTo("object", {
								objectId : this.onGetrandomNumber()
							}, true);
		},
		onCloseCustomerInfo:function(){
			this._oViewCusotmerDialog.close();
		},
		onShowCusotmerInformation:function(){
			if (!this._oViewCusotmerDialog) {
					this._oViewCusotmerDialog = sap.ui.xmlfragment("plentyHolidays.view.CustomerInfo", this);
					this.getView().addDependent(this._oViewCusotmerDialog);
					// forward compact/cozy style into Dialog
					this._oViewCusotmerDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewCusotmerDialog.open();
		}
		
		
		
		
		
	});
});