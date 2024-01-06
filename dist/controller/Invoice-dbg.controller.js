sap.ui.define([
	"plentyHolidays/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel) {
	"use strict";

	return BaseController.extend("plentyHolidays.controller.Main", {
		
		
		onInit : function () {
			
	
			var oViewModel = new JSONModel({
					"TotalTourCost":0,
					"ItenaryList":[],
					"SortedTourList":[],
					"RoundFlightsIDS":[],
					"RoundHotels":[]
					
				});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.getView().setModel(oViewModel, "invoiceView");
		},
		_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				
				
				if(this.getOwnerComponent().getModel("Vacachi").getProperty("/ItenaryList") !== undefined)
				{
					var oCustomer =  this.getOwnerComponent().getModel("Vacachi").getProperty("/CustomerInfo");
					this.getView().byId("txtCustomerName").setText(oCustomer.Name);
					this.getView().byId("txtCustomerAddress").setText(oCustomer.Address);
					this.getView().byId("txtCustomerEmail").setText(oCustomer.Email);
					this.getView().byId("txtCustomerContactNumber").setText(oCustomer.ContactNumber);
					this.getView().byId("txtgrandTotal").setTitle( this.numberWithCommas( this.getOwnerComponent().getModel("Vacachi").getProperty("/TotalPrice")) + " BDT");
					var oArray = this.getOwnerComponent().getModel("Vacachi").getProperty("/ItenaryList");
					
					var oObjectIDS =[];
					var oNewArray =[];
					
					for(var m=0;m<oArray.length;m++)
					{
						//if(oObjectIDS.indexOf(oArray[m].objectid) === -1 )
						if(oObjectIDS.indexOf(oArray[m].objectid) === -1  &&  oArray[m].type !== "Freeday")
						{
							oObjectIDS.push(oArray[m].objectid);
							oNewArray.push(oArray[m]);
						}	
					}
					
					
					this.getModel("invoiceView").setProperty("/ItenaryList",oArray);
					this.getModel("invoiceView").setProperty("/InvoiceList",oNewArray);
					//this.onLoadDataForInvoiceTable();
					if(oArray.length > 0){
						this.getView().byId("BtnPdfInvoice").setVisible(true);
						this.getView().byId("BtnPdfItinerary").setVisible(true);
					}else{
						this.getView().byId("BtnPdfInvoice").setVisible(false);
						this.getView().byId("BtnPdfItinerary").setVisible(false);
					}
					
					this.onLoadDataForInvoiceTable();
					
				}else {
					this.getRouter().navTo("main");
				}
				
				
				
			},
			
		/*onRemoveDuplicateObjectIdFromArray:function()
		{
				
		},*/
		
		onLoadDataForInvoiceTable:function(){
			var that = this;
			var oTable = this.getView().byId("tblInvoice");
			oTable.destroyItems();
			
			this.getModel("invoiceView").setProperty("/RoundFlightsIDS",[]);
			this.getModel("invoiceView").setProperty("/RoundHotels",[]);
			
				//oTable.bindAggregation("items", "invoiceView>/ItenaryList", function(sId, oContext) 
				oTable.bindAggregation("items", "invoiceView>/InvoiceList", function(sId, oContext) 
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
										oCar.Price = that.numberWithCommas( oContext.getProperty("price"));
										oCar.IndividualPrice = that.numberWithCommas(oContext.getProperty("individualprice"));
										oCar.Currency = oContext.getProperty("currency");
										//oCar.PlanningDate = that.converttoNewdateFormat( new Date( oContext.getProperty("planningdate")));
										oCar.PlanningDate = that.converttoNewdateFormat( oContext.getProperty("planningdate"));
										oCar.ObjectType = oContext.getProperty("type");
										oCar.VehicleType = oContext.getProperty("vehicletype");
										oCar.NumberofVehicle = oContext.getProperty("numberofvehicle");
										oCar.ServiceType = oContext.getProperty("vechileservicetype");
										oCar.PickupZone = oContext.getProperty("picupzone");
										oCar.Remarks = oContext.getProperty("remarks");
										oRenderControl = that.onLoadCarTemplateForInvoice(oCar);
										
									}if(oType === "Visa")
									{
										var oVisa = {};
										oVisa.ObjectId = oContext.getProperty("objectid");
										oVisa.NumberOfAdult = oContext.getProperty("numberofadult");
										oVisa.CountryName = oContext.getProperty("countryname");
									
										oVisa.Price = that.numberWithCommas( oContext.getProperty("price"));
										oVisa.Fees = that.numberWithCommas(oContext.getProperty("perpaxadultprice"));
										oVisa.Currency = oContext.getProperty("currency");
									
										oVisa.PlanningDate = that.converttoNewdateFormat( oContext.getProperty("planningdate"));
										oVisa.ObjectType = oContext.getProperty("type");
										
										oRenderControl = that.onLoadVisaTemplateForInvoice(oVisa);
										
									}else if(oType === "Flight")
									{	
										var flightType = oContext.getProperty("flighttype"),
											objectID = oContext.getProperty("objectid"),
											oRoundFlights = that.getModel("invoiceView").getProperty("/RoundFlightsIDS"),
											okToShow =false;
									
										if(flightType === "round" && oRoundFlights.indexOf(objectID) === -1 )
										{
												that.getModel("invoiceView").getProperty("/RoundFlightsIDS").push(objectID);
												okToShow = true;
										}else if(flightType === "oneway"){
												okToShow = true;
										}
										
										
										if(okToShow){
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
											oFlight.AdultPrice = that.numberWithCommas( oContext.getProperty("adultprice"));
											oFlight.NoOfChild = oContext.getProperty("numberofchild");
											oFlight.ChildPrice = that.numberWithCommas( oContext.getProperty("childprice"));
											oFlight.NoOfInfant = oContext.getProperty("numberofinfant");
											oFlight.InfantPrice = that.numberWithCommas(oContext.getProperty("infantprice"));
											oFlight.DepartureDateTime = oContext.getProperty("departuredatetime");
											oFlight.DepartureDate = oContext.getProperty("departuredate");
											oFlight.DepartureTime = oContext.getProperty("departuretime");
										
											oFlight.Remarks = oContext.getProperty("remarks");
											oRenderControl = that.onLoadFlightTemplateForInvoice(oFlight);
										}
									}else if(oType === "Hotel")
									{	
										var objectID = oContext.getProperty("objectid"),
											oHotelsIDs = that.getModel("invoiceView").getProperty("/RoundHotels"),
											okToShow =false;
									
										if(oHotelsIDs.indexOf(objectID) === -1 )
										{
												that.getModel("invoiceView").getProperty("/RoundHotels").push(objectID);
												okToShow = true;
										}
										
										if(okToShow){
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
										oHotel.PlanningDate = that.converttoNewdateFormat(oContext.getProperty("planningdate"));
										
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
										oRenderControl = that.onLoadHotelTemplateForInvoice(oHotel);
										}
										
									}else if(oType === "Activity"){
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
										oActivity.PlanningDate = that.converttoNewdateFormat( oContext.getProperty("planningdate"));
										
										oActivity.ObjectType = oContext.getProperty("type");
										oActivity.TotalPrice = that.numberWithCommas(  oContext.getProperty("price"));
										oRenderControl = that.onLoadActivityTemplateForInvoice(oActivity);
									
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
		
		
		onNavBack:function(){
			
			this.getModel("Vacachi").setProperty("/ItenaryList",[]);
			this.getModel("Vacachi").setProperty("/TotalPrice",0);
			this.getRouter().navTo("main");
		},
		
		

		onCreatePDFContent:function(){
			
		var oArray = this.getOwnerComponent().getModel("Vacachi").getProperty("/ItenaryList");
		//for cusotmer and vedor infos...
	    var oCustomer =  this.getOwnerComponent().getModel("Vacachi").getProperty("/CustomerInfo");
		//console.log(oArray);
		
		this.getModel("invoiceView").setProperty("/RoundFlightsIDS",[]);
		this.getModel("invoiceView").setProperty("/RoundHotels",[]);
		
		var oVendorCustomerColums=["BILLED TO","PLENTY HOLIDAYS"];
		var oTransferColums=["Transfer Details","Vehicle","Quantity","Unit Price","Total"];
		var oActivityColums =["Activity Details","Adult","Unit Price","Child","Unit Price","Total"];
		var oHotelColums = ["Hotel Details","Room","No.Room","Nights","Unit Price","Ext Bed","Unit Price","Total"];
		var oVisaColums = ["Visa Details","Country","Adult","Unit Price","Total"];
		//var oFlightColums = ["Flight Details","Flight Type","Adult","Unit Price","Total"];
		var oFlightColums = ["Flight Details","Adult","Price","Child","Price","Infant","Price","Total"];
		
		//var oFooterColums = ["Grand Total",this.numberWithCommas( this.getOwnerComponent().getModel("Vacachi").getProperty("/TotalPrice")) + " BDT"];
		
		var oFooterColums1 = ["PAYMENT INFORMATION"];
		var oFooterColums2;
		if(parseInt(oCustomer.Discount,10) > 0 )
		{
			oFooterColums2 = ["TOTAL",this.numberWithCommas( this.getOwnerComponent().getModel("Vacachi").getProperty("/TotalPrice")) + " BDT"];
		}else{
			oFooterColums2 = ["GRAND TOTAL",this.numberWithCommas( this.getOwnerComponent().getModel("Vacachi").getProperty("/TotalPrice")) + " BDT"];
		}
		
		
	   var oFlightRows = [];
	   var oTransferRows = [];
	   var oActivityRows = [];
	   var oHotelRows =[];
	   var oVisaRows =[];
	   var oCustomerVendorRows=[];
	   var oFooterRows1=[];
	   var oFooterRows2=[];
	  
	   oArray.forEach(element => 
	   {      
	        
	        if(element.type=== "Visa"){
	        var temp = ["Visa Service For",element.countryname,element.numberofadult,this.numberWithCommas(element.perpaxadultprice),this.numberWithCommas(element.price)];
	        oVisaRows.push(temp);
	        }
	        
	        if(element.type=== "Transfer"){
	        var temp = [element.origin+ " To "+element.destination,element.vehicletype,element.numberofvehicle,this.numberWithCommas(element.individualprice),this.numberWithCommas(element.price)];
	        oTransferRows.push(temp);
	        }
	        
	        if(element.type=== "Activity")
	        {
	        	var tempActivity = [element.activityname,element.numberofadult,this.numberWithCommas(element.perpaxadultprice),element.numberofchild,this.numberWithCommas(element.perpaxchildprice),this.numberWithCommas(element.price)];
	        	oActivityRows.push(tempActivity);
	        }
	        
	        if(element.type=== "Hotel")
	        {
	        	var tempHotel = [element.hotelname,element.roomtype,element.numberofrooms,element.numberofnight,this.numberWithCommas(element.roomperdayprice),element.numberofextrabed,this.numberWithCommas(element.extrabedprice),this.numberWithCommas(element.price)];
	        	var oHotelIDs= this.getModel("invoiceView").getProperty("/RoundHotels");
	        	
	        	if( oHotelIDs.indexOf(element.objectid) === -1 )
				{
					this.getModel("invoiceView").getProperty("/RoundHotels").push(element.objectid);
					oHotelRows.push(tempHotel);
				}
	        	
	        }
	        
	        if(element.type=== "Flight")
	        {
	        	var tripType= "";
	        	if(element.flighttype === "round"){
	        		tripType="Return";
	        	}else{
	        		tripType="Oneway";
	        	}
	        	
	        	var NofAdult = parseInt(element.numberofadult,10)>0 ? parseInt(element.numberofadult,10) : 0;
	        	var AdultPrice ="";
	        	if(NofAdult > 0)
	        	{
	        		AdultPrice = this.numberWithCommas(element.adultprice);
	        	}else{
	        			AdultPrice = "0";
	        	}
	        	
	        	var NofChild = parseInt(element.numberofchild,10)>0 ? parseInt(element.numberofchild,10) : 0;
	        	var ChildPrice ="";
	        	if(NofChild > 0)
	        	{
	        		ChildPrice = this.numberWithCommas(element.childprice);
	        	}else{
	        			ChildPrice = "0";
	        	}
	        	
	        	var NofInfant = parseInt(element.numberofinfant,10)>0 ? parseInt(element.numberofinfant,10) : 0;
	        	var InfantPrice ="";
	        	if(NofInfant > 0)
	        	{
	        		InfantPrice = this.numberWithCommas(element.infantprice);
	        	}else{
	        			InfantPrice = "0";
	        	}
	        	
	        	
	        	var tempFlight = [element.origin+ " To "+element.destination+"  ("+tripType+")",NofAdult,AdultPrice,NofChild,ChildPrice,NofInfant,InfantPrice,this.numberWithCommas(element.price)];
	        	var oRoundFlights = this.getModel("invoiceView").getProperty("/RoundFlightsIDS");
	        	if(element.flighttype === "round" && oRoundFlights.indexOf(element.objectid) === -1 )
				{
					this.getModel("invoiceView").getProperty("/RoundFlightsIDS").push(element.objectid);
					oFlightRows.push(tempFlight);
				}else if(element.flighttype === "oneway"){
						oFlightRows.push(tempFlight);
				}
	        	
	        	
	        	
	        }
	        
	
	    });
	    
	    
	    //for cusotmer and vedor infos...
	    //var oCustomer =  this.getOwnerComponent().getModel("Vacachi").getProperty("/CustomerInfo");
	    
	    oCustomerVendorRows.push(["Name: "+oCustomer.Name,"B-107 (Level-3), Road 8, New DOHS"]);
	    oCustomerVendorRows.push(["Address: "+oCustomer.Address,"Mohakhali, Dakha -1212"]);
	    oCustomerVendorRows.push(["Email: "+oCustomer.Email,"support@plentyholidays.com"]);
	    oCustomerVendorRows.push(["Contact Number: "+oCustomer.ContactNumber,"Hotline: 01880188888"]);
	    oCustomerVendorRows.push(["Invoice Number : "+this.onGetrandomNumber(),"www.plentyholidays.com"]);
	    
	    
	    
	    
	    
	    oFooterRows1.push(["Plenty Holidays"]);
	    oFooterRows1.push(["AC: 230-260-266-9001"]);
	    oFooterRows1.push(["City Bank Limited"]);
	    oFooterRows1.push(["Banani Branch"]);
	    oFooterRows1.push(["Thank you for being with us"]);
	    
		if(parseInt(oCustomer.Discount,10) > 0 )
		{	    
	     oFooterRows2.push(["DISCOUNT", this.numberWithCommas(oCustomer.Discount)+" BDT"]);
	     oFooterRows2.push(["GRAND TOTAL",this.numberWithCommas( parseInt(this.getOwnerComponent().getModel("Vacachi").getProperty("/TotalPrice"),10)-parseInt(oCustomer.Discount,10) )+" BDT"]);
		}else{
			oFooterRows2.push(["",""]);
			oFooterRows2.push(["",""]);
		}
	    
	    var base64Img = "data:image/png;base64,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";
	    var that =this;
	    var doc = new jsPDF('p', 'pt', 'a4');
	    var header = function(data) {
		    doc.setFontSize(9);
		    doc.setTextColor(40);
		    //doc.setFontStyle('normal');
		    //doc.addImage(base64Img, 'PNG', data.settings.margin.left, 30, 120, 35);
		    doc.addImage(base64Img, 'PNG', data.settings.margin.left, 30, 133, 39);
		    //addImage(imageData, format, x, y, width, height, alias, compression, rotation)
		    
		    
		    
		    doc.setTextColor(25,25,25);
		    doc.setFontType("bold");
		    doc.setFont("Myriad Pro");
		    doc.setFontSize(14);
		    doc.text("INVOICE ", 395, 45);
		    
		    doc.setTextColor(25,25,25);
		    doc.setFontType("normal");
		    doc.setFont("Myriad Pro");
		    doc.setFontSize(9);
		    doc.text("Date : " + that.onGetToday(), 395, 60);
		    
		  };
		
		if(oCustomerVendorRows.length>0)
		{ 
			
			var options1 = {            
            beforePageContent: header,
            margin: {
		      top: 30
		    },
            styles: { overflow: 'linebreak', overflowColumns: false,fontSize: 9,font:'Myriad Pro' },
            headerStyles: {
                fillColor:[255,255,255],
                textColor:[25,25,25],
                halign: 'center',
                fontSize:12
            }, 
           columnStyles: {
			    0: {columnWidth: 349},
			    1: {columnWidth: 165},
			    // etc
			    text: {fontSize: 10},
			    
			},
            theme: 'plain',
            startY:80,
            createdCell: function(CellHookData, opts) 
            {
                    		
                    		
                    		if(CellHookData.row.section === 'body')
                    		{
                    				CellHookData.cell.styles.fontStyle = 'normal';
        							CellHookData.cell.styles.halign = 'left';
        							CellHookData.cell.styles.cellPadding = {vertical:2};	
                    		}else{
                    			CellHookData.cell.styles.fontStyle = 'bold';
        							CellHookData.cell.styles.halign = 'left';
        							CellHookData.cell.styles.cellPadding = {vertical:2};
                    		}
              }
        	};
			
			doc.autoTable(oVendorCustomerColums, oCustomerVendorRows, options1); 
			
		}
		
		
		if(oFlightRows.length > 0)
		{ 
			var oFColumns =["FLIGHTS"];
			var oFRows =[];
			doc.autoTable(oFColumns, oFRows,{styles:{ fontSize:12,font:'Myriad Pro'},
													  startY: doc.lastAutoTable.finalY + 8,
													  headerStyles: { fillColor:[255,255,255],
														                textColor:[25,25,25],
														                halign: 'left',
														                fontSize:12
																	},
													  theme: 'plain',
													 
			}); 
			
			
			doc.autoTable(oFlightColums, oFlightRows, {	styles:{fontSize:9,font:'Myriad Pro'},
															startY: doc.lastAutoTable.finalY,
															headerStyles: { halign: 'center'}, 
															createdCell: function(CellHookData, opts) 
															{
        															CellHookData.cell.styles.halign = 'center';
        															if(CellHookData.row.section ==='body')
        															{
        																CellHookData.cell.styles.fontStyle = 'bold';
        																CellHookData.cell.styles.textColor =  [25, 25, 25];
        															}
        															if(CellHookData.row.section === 'body' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        																//CellHookData.cell.styles.textColor =  [128,0,0];
        															}
        															
        															if(CellHookData.row.section === 'head' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        															}
																
															},
															columnStyles: {
																    0: {columnWidth: 180},
																    1: {columnWidth: 50},
																    4: {columnWidth: 60}
															}
				
			});
			
		}
		
		  
		if(oTransferRows.length > 0)
		{ 
			var oTColumns =["TRANSFERS"];
			var oTRows =[];
			doc.autoTable(oTColumns, oTRows,{styles:{ fontSize:12,font:'Myriad Pro'},
													  startY: doc.lastAutoTable.finalY + 8,
													  headerStyles: { fillColor:[255,255,255],
														                textColor:[25,25,25],
														                halign: 'left',
														                fontSize:12
																	},
													  theme: 'plain',
													 
			}); 
			
			
			doc.autoTable(oTransferColums, oTransferRows, {	styles:{fontSize:9,font:'Myriad Pro'},
															startY: doc.lastAutoTable.finalY,
															headerStyles: { halign: 'center'}, 
															createdCell: function(CellHookData, opts) 
															{
        															CellHookData.cell.styles.halign = 'center';
        															if(CellHookData.row.section ==='body')
        															{
        																CellHookData.cell.styles.fontStyle = 'bold';
        																CellHookData.cell.styles.textColor =  [25, 25, 25];
        															}
        															if(CellHookData.row.section === 'body' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        																//CellHookData.cell.styles.textColor =  [128,0,0];
        															}
        															
        															if(CellHookData.row.section === 'head' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        															}
																
															},
															columnStyles: {
																    0: {columnWidth: 180},
																    1: {columnWidth: 50},
																    4: {columnWidth: 60}
															}
				
			});
			
		}
		
		if(oActivityRows.length > 0)
		{ 
			var oAColumns =["ACTIVITIES"];
			var oARows =[];
			doc.autoTable(oAColumns, oARows,{styles:{ fontSize:12,font:'Myriad Pro'},
													  startY: doc.lastAutoTable.finalY + 8,
													  headerStyles: { fillColor:[255,255,255],
														                textColor:[25,25,25],
														                halign: 'left',
														                fontSize:12
																	},
													  theme: 'plain',
													 
			}); 
			doc.autoTable(oActivityColums, oActivityRows, { styles:{fontSize:9,font:'Myriad Pro'},
															startY: doc.lastAutoTable.finalY,
															headerStyles: {halign: 'center'}, 
															createdCell: function(CellHookData, opts) 
															{
        															CellHookData.cell.styles.halign = 'center';
        															if(CellHookData.row.section ==='body')
        															{
        																CellHookData.cell.styles.fontStyle = 'bold';
        																CellHookData.cell.styles.textColor =  [25, 25, 25];;
        															}
        															if(CellHookData.row.section === 'body' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        																//CellHookData.cell.styles.textColor =  [128,0,0];
        															}
        															
        															if(CellHookData.row.section === 'head' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        															}
            												},
            												columnStyles: {
																    0: {columnWidth: 180},
																    1: {columnWidth: 50},
																    5: {columnWidth: 60}
															}
				
			});
			
		}
		
		if(oHotelRows.length > 0)
		{ 
			var oHColumns =["HOTELS"];
			var oHRows =[];
			doc.autoTable(oHColumns, oHRows,{styles:{ fontSize:12,font:'Myriad Pro'},
													  startY: doc.lastAutoTable.finalY + 8,
													  headerStyles: { fillColor:[255,255,255],
														                textColor:[25,25,25],
														                halign: 'left',
														                fontSize:12
																	},
													  theme: 'plain',
													 
			}); 
			doc.autoTable(oHotelColums, oHotelRows, { styles:{fontSize:9,font:'Myriad Pro'},
													  startY: doc.lastAutoTable.finalY,
													  headerStyles: { halign: 'center'}, 
													  createdCell: function(CellHookData, opts) {
        															CellHookData.cell.styles.halign = 'center';
        															if(CellHookData.row.section ==='body')
        															{
        																CellHookData.cell.styles.fontStyle = 'bold';
        																CellHookData.cell.styles.textColor =  [25, 25, 25];
        															}
        															
        															if(CellHookData.row.section === 'body' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        																//CellHookData.cell.styles.textColor =  [128,0,0];
        															}
        															
        															if(CellHookData.row.section === 'head' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        															}
        															
            										   },
            										   columnStyles: {
																     0: {columnWidth: 180,halign: 'left'},
																     1: {columnWidth: 50},
																     7: {columnWidth: 60}
															}
				
			});
			
			
		}
		if(oVisaRows.length > 0)
		{ 
			var oTColumns =["VISA"];
			var oTRows =[];
			doc.autoTable(oTColumns, oTRows,{styles:{ fontSize:12,font:'Myriad Pro'},
													  startY: doc.lastAutoTable.finalY + 8,
													  headerStyles: { fillColor:[255,255,255],
														                textColor:[25,25,25],
														                halign: 'left',
														                fontSize:12
																	},
													  theme: 'plain',
													 
			}); 
			
			
			doc.autoTable(oVisaColums, oVisaRows, {	styles:{fontSize:9,font:'Myriad Pro'},
															startY: doc.lastAutoTable.finalY,
															headerStyles: { halign: 'center'}, 
															createdCell: function(CellHookData, opts) 
															{
        															CellHookData.cell.styles.halign = 'center';
        															if(CellHookData.row.section ==='body')
        															{
        																CellHookData.cell.styles.fontStyle = 'bold';
        																CellHookData.cell.styles.textColor =  [25, 25, 25];
        															}
        															if(CellHookData.row.section === 'body' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        																//CellHookData.cell.styles.textColor =  [128,0,0];
        															}
        															
        															if(CellHookData.row.section === 'head' && CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.halign = 'left';
        															}
																
															},
															columnStyles: {
																    0: {columnWidth: 180},
																    1: {columnWidth: 50},
																    4: {columnWidth: 60}
															}
				
			});
			
		}
		
		
		
		
		if(oFooterRows1.length > 0){
			
			doc.autoTable(oFooterColums1, oFooterRows1, {
				
				headerStyles:{
					 halign:'left',
					 fontSize:12
					 
				},
				styles:{font:'Myriad Pro'},
				margin:{right:280},
				theme: 'plain', 
				startY: doc.lastAutoTable.finalY +10,
				 createdCell: function(CellHookData, opts) 
				 {
        					//CellHookData.cell.styles.fontStyle = 'bold';
        					CellHookData.cell.styles.cellPadding = {vertical:2};
        					//CellHookData.cell.styles.halign = 'center';
        					/*if(CellHookData.column.index === 0 && CellHookData.row.index === 4)
        					{
        						//CellHookData.cell.styles.halign = 'center'
        						//CellHookData.cell.styles.textColor =  [129, 65, 65];
        					}*/
        					
        					if(CellHookData.row.section === 'body')
                    		{
                    			CellHookData.cell.styles.fontStyle = 'normal';
                    		}else{
                    			CellHookData.cell.styles.fontStyle = 'bold';
                    		}
        					
            	 }
			});
		}
		if(oFooterRows2.length > 0){
			
			doc.autoTable(oFooterColums2, oFooterRows2, {
				
				headerStyles:{
					 halign:'left',
					 fontSize:12
					 
				},
				styles:{font:'Myriad Pro'},
				margin:{left:360},
				theme: 'plain', 
				startY: doc.lastAutoTable.finalY - doc.lastAutoTable.height,
				 createdCell: function(CellHookData, opts) 
				 {
        					CellHookData.cell.styles.fontStyle = 'bold';
        					CellHookData.cell.styles.cellPadding = {vertical:2};
        					CellHookData.cell.styles.fontSize = 12;
        					//CellHookData.cell.styles.halign = 'center';
        					if(CellHookData.column.index === 1)
        					{
        						CellHookData.cell.styles.halign = 'right'
        						//CellHookData.cell.styles.textColor =  [129, 65, 65];
        					}
        					
            	 }
			});
		}
		
	
         var oNames =oCustomer.Name.split(" ");
         var oName ="";
         for(var i=0;i<oNames.length;i++)
         {
         	oName += oNames[i];
         }
         
         doc.save(oName+"-Invoice"+".pdf");
         //doc.save(oCustomer.Name.split(" ")+".pdf");
		
		},
		
		
		onCreatePDFContentForItinerary:function(){
			
			this.getModel("invoiceView").setProperty("/RoundHotels",[]);
			this.getModel("invoiceView").setProperty("/RoundFlightsIDS",[]);
			var oArray = this.getOwnerComponent().getModel("Vacachi").getProperty("/ItenaryList");
			var newArray = oArray.filter(function (el) {
			  return el.type != "Visa" ;
			});
			
			// code for adding Freedayd dynimically...
			var daysOfPackage = [];
            //var endDate = new Date(newArray[newArray.length-1].planningdate); 
            var endDate = new Date(newArray[newArray.length-1].planningdate.replace(".", "-").replace(".","-").replace(".","-"));
            //var endDate = 
            
            //var startDate = new Date(newArray[0].planningdate);
            var startDate = new Date(newArray[0].planningdate.replace(".", "-").replace(".","-").replace(".","-"));
			for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {

				    
                    var oYear,oMonth, oDate,oCurrDate,oDateString;
				    oYear = d.getFullYear();
                    oMonth = d.getMonth()+1  < 10 ? "0"+(d.getMonth() + 1) : (d.getMonth() + 1) ;
                    oDate = parseInt(d.getDate(),10) <10 ? "0"+ (d.getDate()) : d.getDate()  ;
                    oDateString = oYear+"."+oMonth +"."+ oDate;


                    var elementPos = newArray.map(function(e) { return e.planningdate; }).indexOf(oDateString);
						//console.log("Position:"+ elementPos);
						if(elementPos === -1){
							var oObject = {};
							oObject.objectid = this.onGetrandomNumber();
							oObject.actiondatetime = oDateString + " " + "05:00:000";
							//oObject.actiondatetime = oDateString + " " + "05:00";
							oObject.planningdate = oDateString;
							oObject.suggestion =" Enjoy Your Free Day";
							oObject.type = "Freeday";
							oObject.price = "0";
							oObject.currency = "BDT";

							newArray.push(oObject);
						}
				daysOfPackage.push(oDateString);
			}
			// End of  code for adding Freedayd dynimically...
			//sort according to actiondatetime....
            var oFormattedArray = newArray.sort(function(a,b)
			{
				   //return new Date(a.actiondatetime) - new Date(b.actiondatetime);
				   var aDateTime = a.actiondatetime.split(" ")[0].replace(".", "-").replace(".","-").replace(".","-") + " " + a.actiondatetime.split(" ")[1]+":000";
				   var bDateTime = b.actiondatetime.split(" ")[0].replace(".", "-").replace(".","-").replace(".","-") + " " + b.actiondatetime.split(" ")[1]+":000";
				   
				   return new Date(aDateTime) - new Date(bDateTime);
				   //return new Date(aDateTime).getTime() - new Date(bDateTime).getTime();
				   //return  (new Date(bDateTime) > new Date(aDateTime)) ? 1 : ( new Date(bDateTime) < new Date(aDateTime)) ? -1 : 0;
				   
				   //return new Date(a.actiondatetime.replace(".", "-").replace(".","-").replace(".","-")) - new Date(b.actiondatetime.replace(".", "-").replace(".","-").replace(".","-")); 
			});
			console.log(oFormattedArray);

			var OBJ ={
				GroupByDate: this.groupByDateForItinerary(oFormattedArray, "planningdate")
			};
			

			var oCustomer =  this.getOwnerComponent().getModel("Vacachi").getProperty("/CustomerInfo");	
			var base64Img = "data:image/png;base64,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";
			var footerImg ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqMAAABKCAIAAAAAKcpcAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABm1SURBVHhe7Z29kRxHD4a/HJQBDWUgh65k0JYhevKoAEgFcEWbpZIv+QpAxQQYAANgAGQADIDfs/sOX+GA7rmZvf8lHmMLjUYD6G709Nzxjve/L03TNE3TnC990zdN0zTNOdM3fdM0TdOcM33TN03TNM05c3c3/cePH588efK/wHfffff+/ful+9p8/vz5xx9/JASBFtWE7ZYR5c9Ahi+qEcyIeQ0n+ObNG+kRonxaPs3Z8Ouvv6oYIig3lpxwFX348OH65bRSk3sr/OLiosu7maEip05cIVVTualn5gl+ZvUfiz82H0j93/VNz/MrNm9w/tv37LQqUcIMZPiiKvz777/eadBmo0SOw5Or0/JpzgyVgasCtpSccRXd6k1/QoXPXDUNqFSoIt+afH5/ZKVmbqqo9vqZ1b9moYJHH5t7Q9wS93bTA3L6muA6bF/Q05Y+bt6iukw1iIFib7VsGlVLrIrT6kR+VHWLaj9DJzWfaBZ7q2XTDFGp/HBEr4x8qqm6klliWJ+3Ta1qp8EtFrseYP3f89f0XgtWKn1LxAY///yz9KqDaBwLwouOXL3FUTi0JXoFkrHykauosRlvmvbsfARNlH7dE3rp++eff+wwotwUrmae1kpK59OcGSqDuL8rJVcr3FWUvqavlnKLzcrJSmdEnFbh7969m+XTFd7EalRp8ZnKr9awqx2D1JvqTUXLp4bIDEE1Fv0MA6E0K/VvnEBq1lTvuPgfxL/Tq0szl8yEeWAhyMZKViHKWnqaKL1n2PM59KZRWm6NskH0fHFxgVucaxcR7KrmQ5eIxsbFMQyk4Xwio4mZbxnYnBMqg7i52u7ZEUgV/unTJz6R400/tNxysuIZOeZy4LQKBwS5kr4rvDHecZ66Kgw+479ty2BW7fGZ6V4/wOVNpe7qjWU8K067inW4Uv+vXr2K9nE4KERMVaPusvjv7Wt6zT8unDXgddG01UUTJ14jD5E+ytXbX3/9NRwVvQECZfH8+XOUTlVgzBAGMjx6WLpv4qZXkjMPaipDFkfN5mxQGbgqYL3kpKE2AL0v+HjTDy33niw5gdMqPLqS8cyDml3h3xQuFX1bSFe45Fh+qiLqBNCnIk+9b9++pYR4gNs5Bqre9FSPxRk1dmU9rNT/lpv+fh/v9/nv9J6kuqIMs+dRXO6ot6yByRs7MRwlb4n0rUiNkiv0h2yCh8NMjqQ9E842Do8yNvYWkzTDDJNNcwaoDFwVMCs56SmDWOHDm35oufdkKRmgS66W9hGPkn+5jXJ0FUMYKRPJpjlXXCrv3r374YcfKM6ffvrpyhq2wfBp715d+XQRSHV4LK4DKrBYnBpOV3SFcEzzAEPUu7SP0ETJLY4xrnCIUsPVdIj7fbw/iJtegqbnNWK36mLR61EYR73l+Opkb1zew1HRW0W9ytmuDtkED7KEaCBNNIu9ydJmW176mnNFZeCqgFgn6lUtqSRUJ7YZfvd+aLn3ZB1SOWIP9EoTzWJvlKNNzMfEuM23hkuFAv7ll19ev34teVgz0VgGw6c9JYeGO/758+f1S2Q51FN9VpzR1XHQgar08Pj2nCxtc7+P9/u86ZG1DXHpmTNyWjsvFk7iImqg9LbRgq54i6OiN3vgpRIDzBjlV8KhJcrDTL4SJwKKjhI5Do8yXfZWk8TDlrjNGaDN1UZLM9v6WGaucF/w9aa/5sk65rIQHcKWCoeVEF3h3zhx96krVVcsg2ENu8iHT3tGAQJNeaZXzvEWn+pXBkJP00QbkBlKhXOs2HSI+3283+dP5AETVq+2AbB59eoVO/H27dvZEmiZIP6IZrSp3lhlbXAahbeYWHQlDQJNm6kpA3uIOAoorvRxeJTpit7icNeT7KUcBm3OAJWBqwJinajXu18r3D/iG2/6oeXKyZqdkcjeCp+FgK7wJpaKLk4+U82sVDsGtVc1KT3ejnGW8yVLhbNyJZDL2wzrP84iNWOIeyz+u7vpb4O4iIuqaZqm+ebRte0vJr9xHt9Nr9ci3e6A4JejpmmaptHVoGtiUX3bPMqv6fVNHtF72TRN0xj/825/QW8e93fvm6ZpmqZZp2/6pmmapjln+qZvmqZpmnOmb/qmaZqmOWf6pm+apmmac6Zv+qZpmqY5Z6Y3/fv373/55ZfPX/+7rpNZ9+P/k2j26xBx+E2ltI5+X19ZQUrs48ePP/30k3+vL/06R/z1P/B/zxRJ/k/+zwD0vwbN1i0lBs6t//uBSK3A2UKhh6VR8ILDbFOg1vBwYDWT5sOHDy9evLjL4xC5qdJdp+6IOXmRRdrBdJab7bC2PHy0EbUMVs6UiLtgYnUh0FSUZEwTZdrcuJXD3JzAetGun6n13hViSpra0rEBJqUjf3J0cZ83PXWgdV85cnH4TaW0ToxCSvrzSuqiGf83BvcCQsy/agxdM/+7wAPVM3ze1cQQFHRl1DdIrcDZQqHniA6fUOB1lvz999/zqa519g6k18UT5bshRiTnk0t3BRacZT+s/ufPxIr+kU9bZIFx3EH8xLPc7IJl1MFhm9LzpJ4p6UXcxARdri6XgQXZ1HCQtrLmZs/D4ZGYQ2W9d4aCuvCIvqvqTgta2X3Tk6jeTbSaTMBzkJwM7Ie5za7zla6YRkqJWAqEII0NAIEmAqsczVJ6NXSMgt5fQvGJTK/ta7jD+CM4n9VT9A/Rss4IrFTC1nBggLErU3BiVbOYNke8hsOFkvz8+fO4LxGPWtqBtKfJcjZQ+nfv3j179oxd5tHw9u1bybiipBmCjTWpNqyJ/tFISRMl05GlE0NDII+tpGwxq6WrsTG3i4sLnUEFEsneoLdZlCFFN9jIlY2rpacsG5rpLDcnc9iksE2mPpcg1kwi7pplQKBZbQTyylYqt5m3SvLPWJWWq9q9tWt2fJivDuzS/vLl5cuXzoHeFT+M0tnhk6cB0fmsgeQE5atXr2bLu++mj0rC4NQaQPj7779nBkcHA7Rks/wY7m/pgJcMPc8RthYQaEoZk6GJWy0HZpQCj8uUHkIiRfRqCvnhE9nOIXpzGmomYm9KfmVGKBXXZgjkOZzCMDHZgzw3JlVgXSgMjDQV1hknHDa2ZlGN9hRSbcwGYsap9leu1ng4GvUy0LWRqgUZjWy4etVLk9kpIjgxp+oKT2Dj6BhoYNR7LBrlFgWPtVxjsQs644CQFryuFa7SCkvpWEJ7JxbVcQqzmTYbma0h6xzPlKj7Eom9LgNkXMWnWdxBM0wjKnGeDvWQmINl+7Fm2DU7Poeamzw3YjimxqyrnxSUJ0AyAFU+AkcjrbnZd9Pjhf0zmoDeUAChGgz9VDTPpRGIw6OMcdx+jbUBINAEdpdMZDzMP2EnyF5EdQEab+QwB8mzrQWnJGw582Z7lSn2HhLNItUVxAcoTfU2ZrZQroe48jN02HwVMTxthL1JadJAmaV7fahBBgSaUsZqQaO0Cc2njirC06dPZ4lFbwk7F/hZOkpckLcqDO2lFOQjvb8ET8S1qiuMUGOpibfokOHpodzsgqVLj8eEd0TQHG6ocEmkqvA2WZA+UruQnRs5bHz6uVTcjFUae2ddgEBTHiBWnWoblAOfagrMqh9rJPgJUA3kfza73Tc9vpbGV6RUjGow9FOJyxGJw6McAyk0gg3iNkuvXfntt99SepUYBexcxJKyJSAoXDQY4lEpyeGM+NQTzcZxoVJupiYWR8VAjdESCWm0UDR1DoV7Vzj6OJjFpdZmeWukTHigzPbe9PhP1WKzi4sLegGB5uvXr2eJ2Zt6I7aJ/oHhKa4tqzC0l5+EElsaBa0VBmkiCDEWYLZs3hGa0hN9/ag2K7DI8UclWHwtr7cDjlu0dbXTrkW0s7iKziPJecotphELphJzwHJW1StdgEBTDgFjvWcs7VCoNZnqxxoJd3TTo9QKovfLEbPl7RsQqsHQj4jznKUYhyeZJT4u9X8PCysRlEYsDgSSrPkn6HUUXKXqjBo+vc2KizIOHxIN0kDJILcovUQIfnm0GdU2nII92BgzVxsOXfffOF5eQKC5slCHp8Vk3Rilk4/MWJdW3CzvSCyPlYGYnXDTp2qRW3qfPXtGFDQcgRcvXuBnlpi9MTZhG8nygFzj2rIKQ3tk4S6U9i/oqmtlM9BE6I2xImkHGdI3/WnU3THeQUCgKXm2KWbFgC4KGBAW1WXiVtbcyOHKp59SjTl4Igipqle6AIHmwekRNER3UBLzcxuz2XUJ8mONhHrT41CVHz1X1m565qDXNNDEAEdJA8gzAydKHvVcYSNjLUS18fAkA0M0Ns5NDpm5y8IhtNkpvWHEOPG0cMne3myGIM9i6D/OAmNXYZ0RA9k8NDjxLsqMJKkSNDUEoD96+s+V12E28W8TL4uPYloog4FshktHl0aBzIT12oi0+zAcKLN6r3/48IEyUMHYFSDQJKVaLYBbDQEERZklBvaWpmkbNVkfua1xbVkFBs7yFF5/6WMaw7VKE4GUp8HSoyB6jnJzJd4jEVcV3Bv17E48UHXBZ7sGKKk0Fduiukz0NszNSuVQo5OeDFxF9M6qeqULEGjKiYlZOQQ4rhKrfhSLuetpUG96O8GMfKLzyPSmvy8uLi7iBpwBD3ZG57fUd8Y3snQPZJp3k0Yfhzvmfhf8/LY73v2Vh3XTk+vff/+9NM6CBzuj81vqO+MbWboHMs27SaOPwx1zvwt+TtvN+4q+wQDpmyuRB/c1fdM0TdM0N0jf9E3TNE1zzvRN3zRN0zTnzNab/v3xJ9L9c31v3rx58mT5jZeKf4BwaY+oNrtGJWP/BCPo1x6kB2x+LH/wAKKHFW+zH2WcRUyuZmw0i7Da/nnR2aSiDczMmtPYUhh7OaESrgPhVn61ZIUteV7fJhWwF9x5DksaQRo/lOrA5gaJm8iCs+zaiy0FsItZoCvZmMmNJ7yLWrfWuG6rptZ21VR23PRPnz59+fIlMuvC6jw7/oauehNblq/anDZKMENXADb+fUoseS745xSwiWZ2lWQPR9bvOx4GXGYWMbpaYaOZwTnV4IJgRoquCWqDkw0MzZrTSLs8K4y97K2EaxLDMRdmtHEWW/K8pk0qYKcHXvla0gg4xObg4shwYHODsLDaRNaW/fKDxXo1r88s0JVszOTGE94OQQlNAkv7y393CpPV+27VQKrtqjk6y+y46Unrzz//1KL//vvvL168sFOOn94pdKdizHsAUdEo0WgjjRzizUd31ygLMvOKCGTVRDIjYX/FELtm8gorEess4MrpJ4MIZlf+FYd1G5DZ0mj2MywMKwGBJkrWOW0l+ueTP4BR3W7xOXRIBdJEufKHLmI46oSakXylfw/EchZxaGPPCDSHNoAmFbAtAYGmLA0eAH16wF05sLkmWmH97w6x0rzy7Is2fVZOsL1cUyBHiftbI8qmdkWimajOwY/0i8t/ril2pbh1OFNIVZrq1qBMj3FrGFX9J80y5jL7bvo//vgDgRVnwr7p0ShjQKAJ+ooHTcovaf755x8tmfxsHIXGgsaSUtxFfMpt0se14DN+G5P9szeGoEkbk5hFxG2ahZTDiXj61eDg9DLDrqQc2sBM3+yiFoY3DlRaw61E6TOSNsL2S3ubTzTJIej0IcTHYgKDWPaq4S3+ZRMPLMoUsdpEPzKuNhHMvD7xiCGkGdkSPSdOk5L9+sDm+rCJT58+Zc3jYxO0uf7fXbxH6FM5QSqexcVlhoEUhSYg0LQGb7Fc0dQuORHuXdoT53qkR8HOpUHWd5jcBWn4EuArtW4F5wJNXJCo4TPVdtVITuy76TmfOPrrr7/YS9/0NZKM42zp4lOz4hNZzfWH5nCUbCxobMwBWBpASPrk2R6SN0FipBczjMwi2hU4lvRXTj8aSBnBMlUqsk7L0h7ZQDVrrgPr6cJgVet285m2cmgm3LW0J8Z8Rp+QbKzBWMfw6CwTzWJh8Hmlf7pSxaaI1SYek5lNBKULuI6VDBjEkv706ZPS4AxitjKwuRFYeW4pbgGuNz33hEtCu3wj5VoDeay9STmMWLuOPhaimbAG5NyaFYGBhwtg9U/UyH8k1a2Uoq6JNJBqu2okJ/bd9B8+fND37RF23fQodbZ9RGVzcXHBJDVWmi2jMLCgsTEH8ISTGX78HIldySxy3L7/StlcGREQaKKcTcTTrwY4pDTBUeiKtzg29VUx2cDQrLk+KgwWVtvtjatbibHNYlUIdy3toFnxaRuQQ2vw4GqsRDOQ5Xb/wwNrP9UGpQt4ZhMhgXpCnYNsEGYlfdiS0dN26W5uCK8wAtcn2xr1fEF44+WK4EBW2j/6WcTaRTg/Wm2mcGBNdbUiMDDVXh2OTQx9jLagsUvjyExjb4AQ/VuzDLjMvpuedxAu+JcvX+J0/bv3KTbLrbkhxHcu3hg0xCG2jMLAAr0y8NrRpXyQMYgvg9hEM3uIMq5UGcgajuYw4DKziHYFCDRR2hhhOP1qgJzAf3wIOmIk2sDMrDkBtqYWhlcYQdfPcCv5rFUh3LW0w64hzHxCcoi9agmBPLGUt4QHImOpatniX5p4YGvEasOn5mJjSDYRzFzAcYicoIyycPLASac5HNjcICysygOZBfe5kJ6b/jbK1YFQalsRrjwgtevg9ys2W9qhwBDkHGQzFGSDPHsgQAohnBiobqMGYajBs9YNFKhqZJ/Yd9OT7uG94uvPf9kpGr2qkEo0BgSaWLJJGHCM40MBA2TWCGHXKAtKgK5j/ANpO7HBv7q8ahA9JG+eDiCjIZN4g8Isol0BgvRXTp8HXzKQt0jMgYkcIy8oyWQD1SwZNLuohQFaZM7Ys+MfVWJt61YOq0IgUz9HlwdUolf6HDpEjw0GmCEP9zqFU3pb/FtDrw4sA5EZ5YhDGy8aSiVQbUzKWf49FoaVb6U3JQ0cLkVzMt5ENVl/baX09Wlme0CgySjtkYtnuEezQNsPSO2SK4HZlafProaCftrOY1eGqzciS0gPk3WN1g08l6QZruTWm7656D+A0TwGeKbwZOH5gnw3RRsjNs0u7r5cb5CVW/yh0Tf9JtjL/gMYzUOGR6S+dgG9/t920daITbORuy/X26Bv+qZpmqZpHgR90zdN0zTNOdM3fdM0TdOcM33TN03TNM05c/M3ffwhhfUfWPj49b/dlpn/D8Wl+4Z48/WXfPxbEFVTf28BSC/+rkIdBTfl6jQNDJXNQ+PkQxGFxeIabCkqBGlcwNY8ebL82nQtctL78fLvstqzoBmVKzYpgaFN81g4ufLv7DqoxQzxiV0rsFY7pLoVVvrsVLPhwJgADG12cZ83vXvXza6DPQN7wzJVDav5Q/mfB/hkb7w9ddRQeZqr0zSzrJoHiHcqyRX3rpudQK2WqgEEaejCwMLi5VjPtch5/PEwQsA+laLNEFK4xSLY1AQWi2CztJvHgDc9yRX3rptdB3sGVSDlVIuZz/jENrap1Q7S0Osbml7CMeow+Eg1Q1MLHn1MYOh8L3d60/vlKL4W8anXN7/EMWr2h4+smc0ZM5wvjctbi0BziwaBt0sEh6g2G50jXOnqNM0sq+YB4p1KMqwfCjSyp7n3UKSzgBybsK6RTPR0vzp/QKC5dHxFA5fG8csRMkFI+sjQJspgm+YREas9ysDmqnoRUN7BdXCop8sVWIsZIT2xzbACk8+YCU5m76Y2i8MlryTgUUt7D7dy08f/dYidI3XpNW1AoAney7S1ttTEbImf9QOfthYYSz6AMNQwxAUUnTu6mtUP3JSr0zQwVDYPDW3TciT2HIp4OvYeCjTxLGDz+vVrpaEqrRqGKDdAYDia7/f8pTinp2ZKMoUT0aYmUG2aRwQbd1rl38Z1UCtwVsyOpSbEoCaZEQvPdoKQzo6IZnwOC74mkJzv5e6+pifFtKbulRC3VgIg0MSYSZq4eSbZKBbKuI40h5qUmOS41ijTqKESTnB1mmbo6hiteXDEgxBltiwVjHuT4NMBCCgxXmr9SDwUqUsh+FS1SFbopJHAEB5PfCEln9v/UhwVrqf20j4aODHkGk5yTJ5mSkDKaNM8FlzGSa5V5F4Jt3Ed8JkqEFIakuMTW9CbAtVqF9HPlr9Wh0CGqeBrAiI638Wjuek9dh0s434guyknVVPDqTeudR01VJ7m6jQNwlDZPEBcGEmOu4ZA071JGN706zuOgcsD5F+yKqdqJIvYK2TjxJyJehH0Jz3UhFj2MAyXbCK2X7FpHjiuliSzs+zv0WRc+bdxHdQKrM7Vm0quViCWqdqNPC+Nr1Rl1cT0akRRR23k7m565O3frpEACEfD/CeDjqEGpK2lGV/i6KqamI8yPA69tNZ11FB5mqvTNENXCM0DhHpQSVdZdQKunHQKJNSbHtYPBZpYEjQpEskINFc0uFVi0UZ1GFN1kUfZoFTOakZXCocws0nOo03ziIh7l2TtL7ic1Cvhlq6DVIExeixghHjR0qsc3IzGUD0npc5O1MjMmpUE6ijJu7ifn8hTrkzjyZMnbJU2dWVrMWaIxmrOcSHWwT4OHGrsPC5iClFHwU25Ok0DQ2Xz0Dj5UGAm+3rTY+xi0+6nMqs4lh9/VeOKcgFbY5ta5LYRsqQ3lWUNV21qAtWmeSycXPm3dB0MK1Aa1xskh6kCXaJCrqy0Z6jKFc1KAkPnu7j5m75pmqZpmodD3/RN0zRNc870Td80TdM050zf9E3TNE1zzvRN3zRN0zTnTN/0TdM0TXPO9E3fNE3TNOdM3/RN0zRNc870Td80TdM050zf9E3TNE1zzvRN3zRN0zTnTN/0TdM0TXPO9E3fNE3TNOdM3/RN0zRNc870Td80TdM050zf9E3TNE1zvnz58n8/kSMCdGyQCQAAAABJRU5ErkJggg==";
		    //var doc = new jsPDF();
		    var that =this;
		    var doc = new jsPDF('p', 'pt', 'a4');
		    var header = function(data) {
			    doc.setFontSize(9);
			    doc.setTextColor(40);
			    doc.setFontStyle('normal');
			    doc.addImage(base64Img, 'PNG', data.settings.margin.left, 30, 120, 35);
			    //addImage(imageData, format, x, y, width, height, alias, compression, rotation)
			   
			    doc.setTextColor(25,25,25);
			    doc.setFontType("normal");
			    doc.text("Date : " + that.onGetToday(), 475, 55);
			  };
		  
        	var oKeys = Object.keys(OBJ.GroupByDate);
        	
        	// code for adding Package include and conditons....adding extra keys....
        	oKeys.push("PACKAGE INCLUDES");
        	oKeys.push("CONDITIONS");
        	// code for adding Package include and conditons....adding extra keys....
        	//console.log(oKeys);
        	
        	// code for trip name and deatils alogn with number of adult and child..
        	var oTripRows=[];
        	var oTripS="";
        	var oTripColums=[oCustomer.TripName];
        	var oTripS="";
        	if(oKeys.length === 3)
        	{
        		oTripS+= oKeys.length -2 +" Day For "+oCustomer.Adults;
        	}else
        	{
        		oTripS+= oKeys.length -2 +" Days "+ (oKeys.length-3) +" Nights For "+oCustomer.Adults;
        	}
        	
        	oTripS+= parseInt(oCustomer.Adults,10) > 1 ? " Adults":" Adult";
        	if(parseInt(oCustomer.Child,10) > 0)
        	{
        		oTripS+=" & "+ oCustomer.Child +" Child";
        	}
        	if(parseInt(oCustomer.Infant,10) > 0)
        	{
        		oTripS+=" & "+ oCustomer.Infant +" Infant";
        	}
        	oTripRows.push([oTripS]);
        	oTripRows.push(["BDT "+this.numberWithCommas(parseInt(this.getOwnerComponent().getModel("Vacachi").getProperty("/TotalPrice"),10))]);
        	
        	//calculate per adult and per child price...
        				this.getModel("invoiceView").setProperty("/RoundHotels",[]);
						this.getModel("invoiceView").setProperty("/RoundFlightsIDS",[]);
						var perAdultPrice = 0.00, perChildPrice=0.00,perInfantPrice=0.00;
						 oArray.forEach(element => 
						 {      
						        if(element.type === "Visa"){
                                	
                                	if( parseInt(oCustomer.Adults,10) > 0){
                                	perAdultPrice = perAdultPrice + parseFloat(element.perpaxadultprice);
                                	}
                                	if(parseInt(oCustomer.Child,10) > 0){
                                	perChildPrice = perChildPrice + parseFloat(element.perpaxadultprice);
                                	}
                                	if(parseInt(oCustomer.Infant,10) > 0){
                                	perInfantPrice = perInfantPrice + parseFloat(element.perpaxadultprice);   
                                	}
                                }
						        
						        if(element.type=== "Transfer")
						        {
						        	var TPerpaxPrice = 0;
						        	if( parseInt(oCustomer.Adults,10) > 0 && parseInt(oCustomer.Child,10) > 0){
						        	    TPerpaxPrice = (parseInt(element.price,10)/ ( parseInt(oCustomer.Adults,10)+ parseInt(oCustomer.Child,10))).toFixed(2);
						        	}else{
						        		TPerpaxPrice = (parseInt(element.price,10)/ ( parseInt(oCustomer.Adults,10))).toFixed(2);
						        	}
						        	    perAdultPrice = perAdultPrice + parseFloat(TPerpaxPrice);
						        	if(parseInt(oCustomer.Child,10) > 0)
						        	{
									    perChildPrice = perChildPrice + parseFloat(TPerpaxPrice);
						        	}
						        }
				        
						        if(element.type=== "Activity")
						        {
						        	var AAdultPrice = 0, AChildPrice = 0;
						        	AAdultPrice = element.perpaxadultprice;
									AChildPrice = element.perpaxchildprice;
									
									if( parseInt(AAdultPrice,10)> 0){
										perAdultPrice = perAdultPrice + parseFloat(AAdultPrice);
									}
									
									
									if( parseInt(AChildPrice,10)> 0)
									{
									    perChildPrice = perChildPrice + parseFloat(AChildPrice);
						            }
						        }
				        
						        if(element.type=== "Hotel")
						        {
						        	var oHotelIDs= this.getModel("invoiceView").getProperty("/RoundHotels");
						        	if( oHotelIDs.indexOf(element.objectid) === -1 )
									{
										 this.getModel("invoiceView").getProperty("/RoundHotels").push(element.objectid);
										 var hAdultPrice =0, hChildPrice =0;
										 
										 if(parseInt(element.extrabedprice,10) === 0 && parseInt(element.numberofchild,10) > 0)
										 {
										 	hAdultPrice = ((parseInt(element.numberofrooms,10)*parseInt(element.numberofnight,10)*parseInt(element.roomperdayprice,10) )/ (parseInt(element.numberofchild,10) +parseInt(element.numberofadult,10))).toFixed(2);
											hChildPrice = hAdultPrice;
										 	
										 }else if( parseInt(element.extrabedprice,10) > 0 &&  parseInt(element.numberofchild,10) > 0 )
										 {
										 	hAdultPrice = ((parseInt(element.numberofrooms,10)*parseInt(element.numberofnight,10)*parseInt(element.roomperdayprice,10) )/ parseInt(element.numberofadult,10)).toFixed(2);
											hChildPrice = (( parseInt(element.numberofnight,10) * parseInt(element.extrabedprice,10) ) / parseInt(element.numberofchild,10)).toFixed(2);
										 	
										 }else if(parseInt(element.extrabedprice,10) === 0 && parseInt(element.numberofchild,10) === 0 && parseInt(element.numberofadult,10) > 0)
										 {
										 	hAdultPrice = ((parseInt(element.numberofrooms,10)*parseInt(element.numberofnight,10)*parseInt(element.roomperdayprice,10) )/ parseInt(element.numberofadult,10)).toFixed(2);
											hChildPrice = 0.0;
										 	
										 }else{
										 	hAdultPrice= 0.0;
										 	hChildPrice = 0.0;
										 }
										 

										 perAdultPrice = perAdultPrice + parseFloat( hAdultPrice);
										 perChildPrice = perChildPrice + parseFloat(hChildPrice); 
									}
						        }
						        
						        if(element.type=== "Flight")
						        {
						        	var oFlightIDs= this.getModel("invoiceView").getProperty("/RoundFlightsIDS");
						        	if( oFlightIDs.indexOf(element.objectid) === -1 )
									{
										 this.getModel("invoiceView").getProperty("/RoundFlightsIDS").push(element.objectid);
										 perAdultPrice = perAdultPrice + parseFloat(element.adultprice);
										 perChildPrice = perChildPrice + parseFloat(element.childprice);
										 perInfantPrice = perInfantPrice + parseFloat(element.infantprice);             
									}
						        }
				        
				    	});
        	var oPstr ="";
		    if(perAdultPrice> 0){
		    	oPstr+= "Adult-BDT "+ this.numberWithCommas(perAdultPrice.toFixed(2));
		    }
            if(perChildPrice > 0){
            	oPstr+="  Child- BDT "+this.numberWithCommas(perChildPrice.toFixed(2));
            }
            if(perInfantPrice > 0){
            	oPstr+="  Infant- BDT "+this.numberWithCommas(perInfantPrice.toFixed(2));
            }
            oTripRows.push([oPstr]);
        	// end of calculate...per adult , child and infant...
        	
        	//var AImage="data:image/png;base64,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";
        	//var CImage="data:image/png;base64,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";
        	//var IImage="data:image/png;base64,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";
        	
        	doc.autoTable(oTripColums, oTripRows, {
				styles:{font:'Myriad Pro'},
				headerStyles:{
					 halign:'left',
					 textColor:25
				},
				theme: 'plain', 
				startY: 55,
				 createdCell: function(CellHookData, opts) 
				 {
        					CellHookData.cell.styles.cellPadding = {vertical:1};
        					CellHookData.cell.styles.halign = 'center';
        					if(CellHookData.row.section ==='head'&& CellHookData.column.index === 0)
        					{
        						CellHookData.cell.styles.font="Denk One";
        						
        						CellHookData.cell.styles.textColor =  [52,52,52];
        						CellHookData.cell.styles.fontSize = 16;
        						
        					}
        					if(CellHookData.row.section ==='body' &&  (CellHookData.row.index === 0 || CellHookData.row.index === 1))
        					{
        						CellHookData.cell.styles.textColor =  [68,68,68];
        						CellHookData.cell.styles.fontSize = 12;
        						CellHookData.cell.styles.fontStyle='normal';
        						CellHookData.cell.styles.font ="Roboto" ;
        					}
        					
        					if(CellHookData.row.section ==='body' &&  CellHookData.row.index === 2)
        					{
        						CellHookData.cell.styles.textColor =  [68,68,68];
        						CellHookData.cell.styles.fontSize = 10;
        						CellHookData.cell.styles.fontStyle='bold';
        						CellHookData.cell.styles.font ="Roboto" ;
        					}
            	 }
            	 /*didDrawCell: function(data) 
				  {
				    if(data.row.section === 'body' && data.row.index === 2)
						{
							
							var oString = data.row.raw[0].split("  ");
							for(var pr=0; pr<oString.length;pr++)
							{
								if(pr === 0  )
								{
										doc.addImage(AImage, 'PNG', data.cell.x + 35, data.cell.y + 1, 10, 10);
								}
								if(pr === 1)
								{
										doc.addImage(CImage, 'PNG', data.cell.x + 35, data.cell.y + 1, 10, 10);
								}
								if(pr === 2)
								{
										doc.addImage(IImage, 'PNG', data.cell.x + 35, data.cell.y + 1, 10, 10);
								}
							}
							
																			            	
						}	
					},
				    willDrawCell: function(data) 
				       {
				            if (data.row.section === 'body' && data.row.index === 2) 
				            	{
									if (data.cell.raw.split(" ")[0] === "T" || data.cell.raw.split(" ")[0] === "A" || data.cell.raw.split(" ")[0] === "H" ||data.cell.raw.split(" ")[0] === "F") 
									{
										data.cell.text[0]=data.cell.raw.split(" ")[1];
									}
								}	
				        }*/
			});
			
			//end of  code for trip name and deatils alogn with number of adult and child..
			
			doc.setFontSize(12);
			doc.setFont('Roboto');
			doc.setTextColor(25,25,25);
			doc.setFontType("medium");
			doc.text("LEAD GUEST: "+oCustomer.Name, doc.lastAutoTable.pageStartX, doc.lastAutoTable.finalY + 10);
        	
        
        	
        	var TransferImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAwCAYAAABKfMccAAAFgElEQVRoge2aW2gdVRSGv5xcmjTXNloNbVNtK9pY7znqi/igKIL60gcf9UGsbYV6KVaEeqk+qaC+KOIFfRBURCHmQUUQkQr2eCtCim2t2to2sSbmfm2qrPBv3Y5zkjkzk+aY9IfF2XPO7Nlr/WftvdZee0paW1tJEYuAdcC5QDPQBJwhaQDqgBqgFqgC6kOG7gNGgAFgEOgHeoHfJceAQ8BPwF5gLIn6uVzu73ZZCjyUAFuBO4D1QGnC59VLzo5w7yTwPfAG8DzwZ5KB0yBjB/B4gX3snx+XDHvfLwYqgHK1Z4IRf6nEvG5nEkOSknEl8Ih33aV/6kfgKNAJHAa65epOxiM8u1xTy0mjpp15zHJgFXCxpiPS40Ngd1xjkpBhfV/zpsWzwANJXdXDBHBcMh1eBO6WHq8ClwEn4gyYSaDsJuBCtc0THk6RiEKwTQsqWrM2xX1QXDIaAvPzPmA0rhIJMQTc7z1ip/QrGHHJeMgb8HPggzkiwuE94Au1G6RfwYhDRpNCqcO2tCxKAJueD3rdt0rPghCHjO1ApdrvJlm9U8YueQjSb/tsk2Fsb1Tb/o1HT6W1EbDDW8Q3Fuod+UJrjULleYHv13he8Q7Qkaf/mcAKYJlS8Sal4PVeSl6he6uUxo8pGUN5iEvF+5SaH1M6/hvwa56Q2yG9bpOeuxXpfOzXgj8Y7Jxvb3In8HIeQx0uUWJkny3A+SKvWQbONkYUUs24H0TEHuUne2YY+y5nX5S9yVcaLJ9RY2J90SkwOh+q9AeY3BzQbdzzvCDMrlzYD/nI+A44RzvQWrn9S/IE5piEmRDUbULrx3FNt72aav9BGBmrgReAG7Qj/b+jXNsGB1tgPwY2Awd924LRxBadNuDGeUJEGEpkX5sXDKYQJONpb78x32F2PhNGxgVAO3DPAiHCYUs2m23PZrNm/1RotVX3ALCyKNSbG1jNZa15xi0LnAhk/61GxrVFoEwx4KIy7fbeB64DrjB3UY6RRn20GNGjkGqZ67fA1ya5XK6vTEWZTyUOpUqr1yjvWKlrV/5fIikvMmMnZWyXUnVbC37W/uSgPnv9Dn46bguopbP7YpbsauRNTwDXpGFNDJxUMef1CPXSMJRoNqw3MnqVsn6mVPWA50adER9oEemTACEDOsvoTtHwRhVuar3v7JjisYg6rpa3r9Wn5Rqt2klPTRN3srUh5AHDcrPDntt1ytX+0HFAhzZG92r+OTwJPJUOB/9Cn5JDNO5zalcDV4uwpd60XiVZMUNWXV42ze4OHeS0SPLhJp1XfCPPWqf7WjR4mhXzElXAHb701oDNCclfnEbE2CAy0LbekXG7ps1ACmM41MrVHfZ57cuTPrxMO9SzJEsljQVECl+5I9P8Nhvw17QoZ7MOE4o63V70+cXI2JKnQ7V3CFzntYPih6r9qoVkdE+ZV+JLUv0a8UqBJ1QOnNRi7/CRKlyuVOhL8Lsh1ykYWhPoGBtRDnl6I9yTGEEyXhFzPYoQYdIT9/yySFDqHWAv8T7dkmBF60Zz4+sVembCoEjqlZsNa3HsV3socD2q60ldjwcq4A4n1acupL7iKucVimylWkQrdV2n6+o8146A2gj2Ta0Z3RHJqJHM1x1ud0ZnEAsellSeJuMfHM3kScMXIjZklGwteBgPSd7cmXc4TYaHJGT0heQMc40R6RULSXatfkrt3t+s0zPrvEQJL1nyURk80RJGQ94Pc8kbXgLX7+1Tgu+TxiobpFX0HZackv3EbCET9tJGBHQVuV1x9BvM6AC2ULSnq3vqiKNfm+1am/XyxrKInY6oiBq1WDwXaJJNyyOObe9rZDMq9No74G/5RY8Q2EL1JnBVkRNhsPe/TE/Td7qyo9n7ttmfy+UO/QU+AE01ME4JwgAAAABJRU5ErkJggg==";
        	var FlightImage="data:image/png;base64,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";
        	var HotelImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAzCAYAAAAw/Z54AAACEUlEQVRoge2ZT0tVQRiHnyxI29TaxCQiahncwWUKurFQaBUIRovoA/RRghZt2yS4cWWFqOBGmIWLIF2EetFVi6KV/TGKgSOMt8Pc3z3Xez3X8z6rc8+ZeeedB+Yy78yFWq32l5PUgREqgvdemmhfVYS0i4kSMVEiJkrERImYKBETJWKiREyUiIkSuSS2uwzMAg+AYeAI+AgsAB+E/veAMeBqx2fUIs654w6/Q0UDrHjvjxqjKLXeKPA2Uf8tZxK/5Hy7ArwBHnVhzqfFFjDtvf8cx2u29IKk1SZF8gSwDlzL+fayxyQF7gLvnXP98cuUqNBwHhgQgt/OpMQMAk/bSvnsuAk8jkdPiXoC3Ggh1dlsgGPGw9LuHTf/MRm/SImaaTFwkPIw+j1UPMdScD1OIiXqVoFs70TPypItMyf+c1OiLhaYRJE+PUFK1H6BCdSrKOpdgXhLbeRSalKiXgPfW0h+BdisoqivwHMxzjfg2SnlVEqa7czDhnMO+JFoU8/2TDvnWZRSFIdabQ14AUxl5cwv4FMm8hVwmNNvG1jsQM7dYjcexy5AxQvQPFE/gY2OZNXD5C29cPZ0v+piGrETThETJWKiREyUiIkSMVEiJkrERImYKJG8nfkf4KCU2XaPocZj7TxRB1Uvip1ze41Xdbb0REyUiIkSMVEiJkrERImYKBETJWKiREyUiIkSMVEKwD/zaEptaZUQtwAAAABJRU5ErkJggg==";
        	var ActivityImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA+CAYAAAB9aNYrAAAFiklEQVR4nOWbWWgeVRTHf0nqp/bBihr7kLw14C6ISdUW1FRx37DRal0exKUqKChFLbiBuGBVFLEqVMSlKraCjS0ajFEhYDOCUqugDxasD+6tYqN+VSJHzsjHZGbuubN8MyR/mJeZ891758e9Z84993wd/f39zCD1AbcBZwI9wB/AFuBZ4FVgKvqqQRBMe/vOGQTkEmAbcLUCEe0LnAysAzYCcy0NzRQoJwEvAXun2JwDPGdprA5Q9gLuAnbo9P4WuBfYx6ONJ4Aug90y4ESXUdVQGsAGhdCr93oU0ieAxeEdDhzt0edlLoM5Kc/2N3ayG9hjH9P/kvX9JnBqwvNDgY+A+/T6O8HuSM9+j3AZxM0UWXs/ADuN1+/AM0CHx8AEyFspQELJkrhb4Rzm0X4uxUFZA3R7NCpL4Fpg0GgfArHai47V5XRLzJi3ebQj+txl0G6fkgVIKPmyPAKMAfu13P8C2OrRzssugzgo1wM/enTS1OBozGGXB0io7cCdwG+R+zcB/xh+/xrwocsoztHKwA8G5hn9hMXRFgFkAjgL+Dnm2QfA5cDzKbGK9H+VpaO0r8+vtrE6JXBHgIU52hAgpznGJGH8x75hfpzK9im+QIaBhyOD3xIDRGbwjcDXavsdsBr4HrhGY55OnaEyO1+xAsExU/IqC5Ah9VHvAC8AX2qIMBkB8hSwouXefOBWYAmwCPjTB0JUQnOpOtYp4/UX8Lij3TxARKPAUUYgrTpGZ0oudWrgdZBHIw319kkvLLNvUw4goX6JAOlS35AEJFQeZ/6fylg+srdYbLR9A7g0BkhUXbqclhvaPMBvuNMlM+U64CeP3zR1VzqR8PwUYzuS47i4YCCFaI7uUje0q0OVALnSEHC1HQglfZJHHc9rDYSSoMjeYjzlWa2BUBIUyXucDjzW4qskyLoZuMIApKHBViVASIBytkaIPnFLNJ+yW7f53drHAnXOroBKgKwHLir4Pb0Ud8SxoyU16CP56ryXYywhkHNzvtO4Bn1mBUGwq9W2zDDfR0UBQWOknT4/GBgYaGrqY2UQBJ/FzRRZPmt1P2FRU7fsKzLuN3yB7NETgDIky35R1SeEvkAkYNwM3FPimEaqPOKYq6d2ViBjuq8pKs+TpMGqfIpvJm6sZce8y2CfS1XMlA7NgmUBgqYeLfnYrBqrAsoZnksmmlPZrlm2MiSOdmUVUKy76DggoW4HbgC+KmhMYbbvhCAIttYlTsmiNXo1rCUWSapD8Daq+VSXBtUZJ82WUE1DTiZRVRTtSK729ci+6G19WYtCMLlmgq/KhBImr4f0HCbUlNaJuE4UQ7UdTFlQotn8R7XUKtSkLosRY3ttBVMGlLjjjUOAFyPVRpP6aR42tjuou/B5BY93moqGcmDKec9Szaa1gmnq8rKCOU7bLxVMkVAkofS+47xnuUazjZZ7vmAWlg2mKCjdOrUtpVZDWu7RqlqBKQKKDxA0m/9kzP0sYDaVEWvlhZIFSFo2PwSz3tjeYku1o6/yQCkaSKimVk+vM7Zr3UuZlRVKryeQtUYgtVCW9dirX5kFRvundUdrzd829NBsyGjvOpH0li+UdgDxydmOW6odfeWzfOoGZEJPHpIqsTPLCqWOQFyFgZllgTKrgGCA0qfFuFYgq0sGElcpWbjSHG2fzpAeY6cPae7UKte/OKJKy9kWqiQo7QCS9dyndMUtn1kNhBgosx4IESjzdRBlAenQgsNaAyECZZVHsc4qTyCi8/R00KJ3qwJCBIp1t3kH8ECGvpYY7YY1Uq0ECBl2yQLkwZLGQkpJelvVCsW128wLxFUPVwsgRKDcr3+UjlMRM2Sjng4mPasFECJQ5A9Ex2vGS0oSJFT/FDi/oCUj7V2g/khKUkXfqNO+sC5AAP4FKQSDZWPAkswAAAAASUVORK5CYII=";
        	
        	this.getModel("invoiceView").setProperty("/RoundHotels",[]);
			this.getModel("invoiceView").setProperty("/RoundFlightsIDS",[]);
        	
        	for(var i =0; i<oKeys.length;i++)
        	{
        			
        		if ( i < oKeys.length -2)
        		{
        			var oColumns =[];
        			var oRows =[];
        			var oItems =[];
        			var day = i+1;
        			var obj ={};
        			obj.Id = "DAY "+ day ;
        			//obj.date=new Date(oKeys[i]).toDateString(); // not working in firefox
        			obj.date=new Date(oKeys[i].replace(".", "-").replace(".","-").replace(".","-")).toDateString();
        			
        			oColumns=[obj];
        			oItems = OBJ.GroupByDate[Object.keys(OBJ.GroupByDate)[i]];
        			for(var j=0;j<oItems.length;j++)
        			{
        				var temp =[];
        				if(oItems[j].type ==="Transfer")
        				{
        					var sTr = "T " +oItems[j].picuptime+ "|||"+  "Transfer From "+oItems[j].origin+ " To "+oItems[j].destination;
	        				sTr+="\n";
	        				sTr+="Pick up Note"+ "|||"+ oItems[j].picupzone;
	        				if(oItems[j].remarks.length > 0)
	        				{
	        				   sTr+="\n";
	        				   sTr+="Remarks"+"|||"+oItems[j].remarks;
	        				}
        					temp =["",sTr];
        			
        				}else if(oItems[j].type ==="Hotel")
        				{
        					var oHotelIDs= this.getModel("invoiceView").getProperty("/RoundHotels");
	        				var sHr="";
	        				if( oHotelIDs.indexOf(oItems[j].objectid) === -1 )
        					{
        							this.getModel("invoiceView").getProperty("/RoundHotels").push(oItems[j].objectid);
        							sHr +="H " + oItems[j].checkintime+"|||"+ "Check in at "+oItems[j].hotelname;
		        					sHr+="\n";
		        					sHr+="Address"+"|||"+oItems[j].hoteladdress;
		        					
		        					if(oItems[j].confirmationnumber.length > 0 )
		        					{
		        						sHr+="\n";
		        						sHr+="Confirmation Number"+"|||"+oItems[j].confirmationnumber;
		        					}	
        					}else{
        							sHr +="H " + oItems[j].checkouttime+"|||"+ "Check out from "+oItems[j].hotelname;
		        					sHr+="\n";
		        					sHr+="Address"+"|||"+oItems[j].hoteladdress;
		        					
        					}
        					
        					temp =["",sHr];
        					
        				}else if(oItems[j].type ==="Activity")
        				{
        					
        					var sAr ="A " + oItems[j].picuptime+"|||"+oItems[j].activityname + "  for "+ oItems[j].numberofadult + " Adult ";
        					if(parseInt(oItems[j].numberofchild,10)> 0)
        					{
        						sAr+="  and " +oItems[j].numberofchild +" Child ";
        					}
        						sAr+="\n";
        						sAr+="Pick up Note"+"|||"+ oItems[j].picuplocation;
        					
        					if(oItems[j].remarks.length > 0)
        					{
        						sAr+="\n";
        						sAr+="Remarks"+"|||"+ oItems[j].remarks;
        					}
        					temp =["",sAr];
        					temp =["",sAr];
        					
        				}else if(oItems[j].type ==="Freeday")
        				{
        					
        					var sFr ="A Full" +"||| Day Available for Relax, Shopping, Roaming around etc";
        						sFr+="\n";
        						sFr+="Suggestion"+"|||"+ oItems[j].suggestion;
        						temp =["",sFr];
        					
        				}else if(oItems[j].type ==="Flight")
        				{
        					
        					var sFLr ="F " + oItems[j].departuretime+"|||"+oItems[j].origin + "  To "+ oItems[j].destination;
        						sFLr+="\n";
        						sFLr+="Carrier"+"|||"+ oItems[j].carriername +" "+oItems[j].departureflightnumber;
        					if(oItems[j].remarks.length > 0)
	        				{
	        				   sFLr+="\n";
	        				   sFLr+="Remarks"+"|||"+oItems[j].remarks;
	        				}
        					temp =["",sFLr];
        					
        				}
	        			if(temp.length >0){
        					oRows.push(temp);
        				}
	        		
        			}  // end of loop of items....
        			
        			var totalPagesExp = "{total_pages_count_string}";
        			var pageSize = doc.internal.pageSize;
                    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        			var oStartY = 0;
        		

        			doc.autoTable({
					        head: oColumns,
					        body: oRows,
					        margin: {top: 85},
					        startY: (i == 0 )? 140 : doc.lastAutoTable.finalY + 10,
					        styles:{fontSize:10,font:'Myriad Pro'},
					        theme: 'plain',
					        pageBreak:'avoid',
        					columnStyles: {
								0: {columnWidth: 55}
							},
							headerStyles: {
				                fillColor:[249,249,249]
				            },
        					
            				didDrawPage: function (data) 
					        {
					            doc.setFontSize(9);
							    doc.setTextColor(40);
							    doc.setFontStyle('normal');
							    doc.addImage(base64Img, 'PNG', data.settings.margin.left, 30, 120, 35);
							   
							    doc.setTextColor(25,25,25);
							    doc.setFontType("bold");
							    doc.setFontSize(14);
							    doc.setFont("Myriad Pro");
							    doc.text("ITINERARY", 475, 50);
							   
							    doc.setTextColor(25,25,25);
							    doc.setFontType("normal");
							    doc.setFont("Myriad Pro");
							    doc.setFontSize(9);
							    doc.text("Date : " + that.onGetToday(), 475, 65);
					            
					            // Footer
					            var str = "Page " + doc.internal.getNumberOfPages()
					            // Total page number plugin only available in jspdf v1.0+
					            if (typeof doc.putTotalPages === 'function') {
					                str = str + " of " + totalPagesExp;
					            }
					            doc.setFontSize(10);
					            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
					            var pageSize = doc.internal.pageSize;
					            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
					        	doc.addImage(footerImg, 'PNG', data.settings.margin.left, pageHeight - 45, 500, 48);
					            //doc.text(str, data.settings.margin.left, pageHeight - 10);
					            // End of Footer
    
					        },
					        createdCell: function(CellHookData, opts) 
															{
        															CellHookData.cell.styles.cellPadding = {vertical:7};
        															CellHookData.cell.styles.fontStyle = 'bold';
        															CellHookData.cell.styles.textColor =  [25, 25, 25];
	
        															if(CellHookData.row.section ==='head'&& CellHookData.column.index === 0)
        															{
        																CellHookData.cell.styles.textColor =  [242,101,34];
        																CellHookData.cell.styles.fontSize = 14;
        																CellHookData.cell.styles.font ="Denk One" ;
        															}
        															
        															if(CellHookData.row.section ==='head'&& CellHookData.column.index === 1)
        															{
        																
        																CellHookData.cell.styles.fontSize = 14;
        																CellHookData.cell.styles.font ="Roboto" ;
        																CellHookData.cell.styles.textColor =  [52,52,52];
        															}
        														
            												},
            												didDrawCell: function(data) 
            												{
													             if(data.row.section === 'body' && data.column.index === 1 )
													             {
													             	
													             	var oStr = data.row.raw[1].split("\n");
													             	var oheadColumns = [];
													             	var obodyRows = [];
													             	var obodyTemps = [];
													             	for(var k=0;k<oStr.length;k++)
													             	{
													             		if(k=== 0 )
													             		{
													             			var obj ={};
															        			obj.lbl = oStr[k].split("|||")[0];
															        			obj.nil =" ";
															        			obj.keyss=oStr[k].split("|||")[1];
															        			oheadColumns=[obj];
													             			
													             		}else
													             		{
													             			obodyTemps = [oStr[k].split("|||")[0]," ",oStr[k].split("|||")[1]];
													             			obodyRows.push(obodyTemps);
													             		}
													             	}
													        
													             	doc.autoTable({
																	        head: oheadColumns,
																	        body: obodyRows,
																	    	startY: data.cell.y + 2,
															                margin: {left: data.cell.x + data.cell.padding('left')},
															                headerStyles: {
																                textColor:[237,86,14],
																                fontSize:11
																            },
															                theme: 'plain',
															                styles: {
															                    fontSize: 9,
															                    font:'Myriad Pro',
															                    cellPadding:0.2
															                },
															                columnStyles: {
																				0: {columnWidth: 86,halign:'right'},
																				1: {columnWidth: 10}
																			}, createdCell: function(CellHookData, opts) 
															                {
				        														if( CellHookData.column.index === 0)
				        														{
				        															CellHookData.cell.styles.halign = 'right';	
				        														}
				        														
				        														if(CellHookData.row.section === 'head' && CellHookData.column.index===2)
				        														{
				        														    //CellHookData.cell.styles.textColor =[90,90,90];
				        														    CellHookData.cell.styles.font ="Roboto" ;
        																			CellHookData.cell.styles.textColor =  [52,52,52];
				        														}

                                                                                if(CellHookData.row.section === 'head' && CellHookData.column.index===0)
				        														{
				        														    CellHookData.cell.styles.fontSize=14;
				        														    //CellHookData.cell.styles.textColor =  [236,86,14];
				        														    CellHookData.cell.styles.textColor =  [242,101,34];
				        														    CellHookData.cell.styles.font ="Denk One" ;
				        														     
				        														}

				        														if(CellHookData.row.section === 'body' && CellHookData.column.index===0)
				        														{
				        														    CellHookData.cell.styles.fontStyle='bold';
				        														    CellHookData.cell.styles.font ="Roboto" ;
				        														    
				        														}
				        														if(CellHookData.row.section === 'body' && CellHookData.column.index===2)
				        														{
				        														    CellHookData.cell.styles.fontStyle='normal';
				        														    CellHookData.cell.styles.textColor =[90,90,90];
				        														    CellHookData.cell.styles.font ="Roboto" ;
				        														    
				        														}
				        														
				            												},
				            												didDrawCell: function(data) 
				            												{
				            														if(data.row.section === 'head' && data.column.index === 0 )
																			         {
																			            	if(data.row.raw.lbl.split(" ")[0] === "T")
																			            	{
																			            		doc.addImage(TransferImage, 'PNG', data.cell.x + 35, data.cell.y + 1, 10, 10);
																			            	}
																			            	
																			            	if(data.row.raw.lbl.split(" ")[0] === "H")
																			            	{
																			            		doc.addImage(HotelImage, 'PNG', data.cell.x + 35, data.cell.y + 1, 10, 10);
																			            	}
																			            	
																			            	if(data.row.raw.lbl.split(" ")[0] === "A")
																			            	{
																			            		doc.addImage(ActivityImage, 'PNG', data.cell.x + 35, data.cell.y + 1, 10, 10);
																			            	}
																			            	
																			            	if(data.row.raw.lbl.split(" ")[0] === "F")
																			            	{
																			            		doc.addImage(FlightImage, 'PNG', data.cell.x + 35, data.cell.y + 1, 13, 13);
																			            	}
																			          }	
				            												},
				            												 willDrawCell: function(data) 
				            												 {
				            														if (data.row.section === 'head' && data.column.index === 0) 
				            														{
																		                if (data.cell.raw.split(" ")[0] === "T" || data.cell.raw.split(" ")[0] === "A" || data.cell.raw.split(" ")[0] === "H" ||data.cell.raw.split(" ")[0] === "F") 
																		                {
																		                    data.cell.text[0]=data.cell.raw.split(" ")[1];
																		                }
																		            }	
				            												 }
													             	});
													             	
													             }
													        },
													        // just before they are drawn to the page.
													        willDrawCell: function(data) 
													        {

													             if (data.row.section === 'body' && data.column.index === 1) 
													             {
													             	for(var i=0;i<data.cell.text.length;i++)
													             	{
													             		data.cell.text[i]="";
													             	}
													             }
													        }
					        
					});
        	
	        		 // Total page number plugin only available in jspdf v1.0+
				    if (typeof doc.putTotalPages === 'function') {
				        doc.putTotalPages(totalPagesExp);
				    }
			    
        		} // end of IF oKeys.length -2
			    else if(i === oKeys.length - 2)
			    {
			    		var oCirleImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAA40lEQVQ4jaXUPw6BMRzG8S+zQZAwS0y4ymsXEosD4AA4ALFbJP7s3IAr4A4MRMQB5JFW6h2I9ln6pr/2k6bp703c20ViSQFtoAZUgQxwBfbAGpgCD3dLHKkDI6AQl52cgB6wslNJp9gHlj8ATH1p1n8gOsHgx+Z4tL5hEd3B+E/AZgKkhbSAvCeS1WmERJ6ATSSkHIhUhOQCkayQSyByEXIIRI5CNoHIWsgMOHsCuopF0jRTzxPpADf77NULPs9+rg+3AYemF9Sl36J606x/xUXsiUpAF9iZ/4iicWvmVV+8dwBPTXEo7KvjlVwAAAAASUVORK5CYII=";
                        var obj ={};
        			    obj.Id = "PACKAGE INCLUDES" ;
        			    obj.date= "";
        			    var oPackageColums=[obj];
        			    
						var oPackageRows = [];
						this.getModel("invoiceView").setProperty("/RoundHotels",[]);
						this.getModel("invoiceView").setProperty("/RoundFlightsIDS",[]);
						 oArray.forEach(element => 
						 {      
						        if(element.type=== "Transfer")
						        {
						        	var temp = ["","   "+" Transfer From "+element.origin+ " To "+element.destination];
						        	oPackageRows.push(temp);
						        }
				        
						        if(element.type=== "Activity")
						        {
						        	var tempActivity = ["","   "+" "+element.activityname+"  at "+element.origin];
						        	oPackageRows.push(tempActivity);
						        }
						        if(element.type=== "Visa")
						        {
						        	var tempVisa;
						        		tempVisa = ["","   "+" "+"Visa fees"];
						        	
						        	oPackageRows.push(tempVisa);
						        }
						        
						        if(element.type=== "Flight")
						        {
						        	var tempFlight;
						        	if(element.flighttype ==="round") 
						        	{
						        		tempFlight = ["","   "+" "+element.origin+" To "+element.destination+" return flight"];
						        	}else{
						        		tempFlight = ["","   "+" "+element.origin+" To "+element.destination+" oneway flight"];
						        	}
						        	
						        	var oFlightIDs= this.getModel("invoiceView").getProperty("/RoundFlightsIDS");
						        	if( oFlightIDs.indexOf(element.objectid) === -1 )
									{
										this.getModel("invoiceView").getProperty("/RoundFlightsIDS").push(element.objectid);
										oPackageRows.push(tempFlight);
									}
						        	
						        }
				        
						        if(element.type=== "Hotel")
						        {
						        	var tempHotel;
						        	if(element.breakfast === "Y"){
						        		tempHotel = ["","   "+" "+element.numberofnight+" Night accomodation in "+element.hotelname+" With Breakfast "+ " at "+element.hotellocation];
						        	}else{
						        		tempHotel = ["","   "+" "+element.numberofnight+" Night accomodation in "+element.hotelname+" at "+element.origin];
						        	}
						        	
						        	var oHotelIDs= this.getModel("invoiceView").getProperty("/RoundHotels");
						        	if( oHotelIDs.indexOf(element.objectid) === -1 )
									{
										this.getModel("invoiceView").getProperty("/RoundHotels").push(element.objectid);
										oPackageRows.push(tempHotel);
									}
						        }
				        
				    	});
				    	
				    	 doc.autoTable({
					        head: oPackageColums,
					        body: oPackageRows,
					        margin: {top: 85},
					        startY: (i == 0 )? 140 : doc.lastAutoTable.finalY + 8,
					        styles:{fontSize:9,font:'Myriad Pro'},
							headerStyles:{
								 halign:'left'
							},
							columnStyles: {
						    	0: {columnWidth: 145}
							}, 
							theme: 'plain', 
							pageBreak:'avoid',
							didDrawPage: function (data) 
					        {
					            doc.setFontSize(9);
							    doc.setTextColor(40);
							    doc.setFontStyle('normal');
							    doc.addImage(base64Img, 'PNG', data.settings.margin.left, 30, 120, 35);
							   
							    doc.setTextColor(25,25,25);
							    doc.setFontType("bold");
							    doc.setFontSize(14);
							    doc.setFont("Myriad Pro");
							    doc.text("ITINERARY", 475, 50);
							   
							    doc.setTextColor(25,25,25);
							    doc.setFontType("normal");
							    doc.setFont("Myriad Pro");
							    doc.setFontSize(9);
							    doc.text("Date : " + that.onGetToday(), 475, 65);
					            
					            // Footer
					            
					            
					            
					            
					            
					            var str = "Page " + doc.internal.getNumberOfPages()
					            // Total page number plugin only available in jspdf v1.0+
					            if (typeof doc.putTotalPages === 'function') {
					                str = str + " of " + totalPagesExp;
					            }
					            doc.setFontSize(10);
					            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
					            var pageSize = doc.internal.pageSize;
					            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
					        	doc.addImage(footerImg, 'PNG', data.settings.margin.left, pageHeight - 45, 500, 48);
					            //doc.text(str, data.settings.margin.left, pageHeight - 10);
					            // End of Footer
    
					        },
							createdCell: function(CellHookData, opts) 
							 {
			        					CellHookData.cell.styles.fontStyle = 'bold';
			        					CellHookData.cell.styles.cellPadding = {vertical:1};
			        					
			                                   if(CellHookData.row.section === 'head' )
							        			{
							        				CellHookData.cell.styles.fontSize=12;
							        				CellHookData.cell.styles.halign= 'left';
							        				//CellHookData.cell.styles.textColor =  [236,86,14];
							        				CellHookData.cell.styles.textColor =  [242,101,34];
							        				CellHookData.cell.styles.font =  "Denk One";
							        			}
			
							        			if(CellHookData.row.section === 'body')
							        			{
							        				CellHookData.cell.styles.halign= 'left';
							        				CellHookData.cell.styles.fontStyle='normal';
							        				CellHookData.cell.styles.textColor =[52,52,52];
							        				CellHookData.cell.styles.font =  "Roboto";
							        			}
			        					
			            	 },
			            	 didDrawCell: function(data) 
							     {
							           if(data.row.section === 'body' && data.column.index === 1 )
										{
										 doc.addImage(oCirleImage, 'PNG', data.cell.x + 2, data.cell.y + 2, 4, 4);
										}	
							    }
				        });
				    	
			    
			    
			    
			    	
			    }else if(i === oKeys.length - 1)
			    {
			    			var obj ={};
        			        obj.Id = "CONDITIONS" ;
        			        obj.date= "";
        			        var oCondionColumns=[obj];

							var oCondionRows = [];
							
							 if(this.getModel("invoiceView").getProperty("/RoundHotels").length > 0){
								oCondionRows.push(["","    "+"Infant will share with parents bed(without extra bed).\n"+"    "+"If extra bed required,price shall charge"]);
							 }
				            	oCondionRows.push(["","    "+"Package has to purchase Minimum 20 days piror to departure.\n"+"    "+"Pick time surcharge may apply during blackout period"]);
				        		
        					doc.autoTable({
										head: oCondionColumns,
										body: oCondionRows,
										margin: {top: 85},
										startY: (i == 0 )? 140 : doc.lastAutoTable.finalY + 8,
										styles:{fontSize:9,font:'Myriad Pro'},
										headerStyles:{
											 halign:'left'
										},
										columnStyles: {
											0: {columnWidth: 145}
										}, 
										theme: 'plain',
										pageBreak:'avoid',
										didDrawPage: function (data) 
								        {
								            doc.setFontSize(9);
										    doc.setTextColor(40);
										    doc.setFontStyle('normal');
										    doc.addImage(base64Img, 'PNG', data.settings.margin.left, 30, 120, 35);
										   
										    doc.setTextColor(25,25,25);
										    doc.setFontType("bold");
										    doc.setFontSize(14);
										    doc.setFont("Myriad Pro");
										    doc.text("ITINERARY", 475, 50);
										   
										    doc.setTextColor(25,25,25);
										    doc.setFontType("normal");
										    doc.setFont("Myriad Pro");
										    doc.setFontSize(9);
										    doc.text("Date : " + that.onGetToday(), 475, 65);
								            
								            // Footer
								            
								            
								            
								            
								            
								            var str = "Page " + doc.internal.getNumberOfPages()
								            // Total page number plugin only available in jspdf v1.0+
								            if (typeof doc.putTotalPages === 'function') {
								                str = str + " of " + totalPagesExp;
								            }
								            doc.setFontSize(10);
								            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
								            var pageSize = doc.internal.pageSize;
								            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
								        	doc.addImage(footerImg, 'PNG', data.settings.margin.left, pageHeight - 45, 500, 48);
								            //doc.text(str, data.settings.margin.left, pageHeight - 10);
								            // End of Footer
			    
								        },
										createdCell: function(CellHookData, opts) 
											 {
														CellHookData.cell.styles.fontStyle = 'bold';
														CellHookData.cell.styles.cellPadding = {vertical:4};
															   if(CellHookData.row.section === 'head' )
																{
																	CellHookData.cell.styles.fontSize=12;
																	CellHookData.cell.styles.halign= 'left';
																	CellHookData.cell.styles.textColor =  [236,86,14];
																}
																if(CellHookData.row.section === 'body')
																{
																	CellHookData.cell.styles.halign= 'left';
																	CellHookData.cell.styles.fontStyle='normal';
																	CellHookData.cell.styles.textColor =[60,60,60];
																}
											 },
											 didDrawCell: function(data) 
												 {
													   if(data.row.section === 'body' && data.column.index === 1 )
														{
														 doc.addImage(oCirleImage, 'PNG', data.cell.x + 2, data.cell.y + 5, 4, 4);
														}	
												}
                            });

			    }
			    
        	}// end of loop of keys...
        	
			
		
			
			
        	
        	 //var oCustomer =  this.getOwnerComponent().getModel("Vacachi").getProperty("/CustomerInfo");
			 var oNames =oCustomer.Name.split(" ");
	         var oName ="";
	         for(var m=0;m<oNames.length;m++)
	         {
	         	oName += oNames[m];
	         }
        	 
			 doc.save(oName+"-Itinerary"+".pdf");
			
		},
		
	
		
		groupByDateForItinerary:function (array, key) {
		  // Return the end result
		  return array.reduce((result, currentValue) => {
		    // If an array already present for key, push it to the array. Else create an array and push the object
		    (result[currentValue[key]] = result[currentValue[key]] || []).push(
		      currentValue
		    );
		    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
		    return result;
		  }, {}); // empty object is the initial value for result object
		}
		
		
		
	
	});
	
});