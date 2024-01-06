sap.ui.define([
	], function () {
		"use strict";
		function dateDiff( str1, str2 ) {
		    var diff = Date.parse( str2 ) - Date.parse( str1 ); 
		    return isNaN( diff ) ? NaN : {
		        diff : diff,
		        ms : Math.floor( diff            % 1000 ),
		        s  : Math.floor( diff /     1000 %   60 ),
		        m  : Math.floor( diff /    60000 %   60 ),
		        h  : Math.floor( diff /  3600000 %   24 ),
		        d  : Math.floor( diff / 86400000        )
		    };
		}
		return {
			flIconByType: function(flType)
		{
			if(flType === "F")
			{
				return "sap-icon://functional-location";
			}else if(flType === "E")
			{
				return "sap-icon://wrench";
			}else{
				return "sap-icon://less";
			}
		},
		flTextByType: function(flType)
		{
			if(flType === "F")
			{
				//return "Functional Location";
				return this.getResourceBundle().getText("FunctionalLocation");
			}else if(flType === "E")
			{
				//return "Equipment";
				return this.getResourceBundle().getText("Equipment");
			}else{
				return "Unknown Type";
			}
		},
		flMergeIDAndDesc: function(flType, flId, eqId, flText, eqText)
		{
			if(flType === "F")
			{
				return flId + " (" + flText + ")";	
			}else if(flType === "E")
			{
				return eqId + " (" + eqText + ")";	
			}
		},
		flDisplayID: function(flType, flId, eqId)
		{
			if(flType === "F")
			{
				return flId;
			}else if(flType === "E")
			{
				return eqId;
			}
		},
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(2);
			},
			
			dateValue: function(value) {
				if (value) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy.MM.dd"
					});
					return oDateFormat.format(value);
				} else {
					return value;
				}
			},
			
			dateValueState:function(CheckoutDate,CheckInDate){
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});
				
				
				var rd = dateDiff(oDateFormat.format(CheckInDate),oDateFormat.format(CheckoutDate) );
				//var rd = dateDiff(oDateFormat.format(createDate),oDateFormat.format(new Date()) );
				console.log(rd.d);
				
			
				
			}
			
			
				
			
		
		
			
			
			
			
			
			
			
			
			
		
		
			
			
			
				
				
			
			
		};

	}
);