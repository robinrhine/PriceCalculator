sap.ui.define([],function(){"use strict";function e(e,t){var r=Date.parse(t)-Date.parse(e);return isNaN(r)?NaN:{diff:r,ms:Math.floor(r%1e3),s:Math.floor(r/1e3%60),m:Math.floor(r/6e4%60),h:Math.floor(r/36e5%24),d:Math.floor(r/864e5)}}return{flIconByType:function(e){if(e==="F"){return"sap-icon://functional-location"}else if(e==="E"){return"sap-icon://wrench"}else{return"sap-icon://less"}},flTextByType:function(e){if(e==="F"){return this.getResourceBundle().getText("FunctionalLocation")}else if(e==="E"){return this.getResourceBundle().getText("Equipment")}else{return"Unknown Type"}},flMergeIDAndDesc:function(e,t,r,n,a){if(e==="F"){return t+" ("+n+")"}else if(e==="E"){return r+" ("+a+")"}},flDisplayID:function(e,t,r){if(e==="F"){return t}else if(e==="E"){return r}},currencyValue:function(e){if(!e){return""}return parseFloat(e).toFixed(2)},dateValue:function(e){if(e){var t=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"yyyy.MM.dd"});return t.format(e)}else{return e}},dateValueState:function(t,r){var n=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"yyyy-MM-dd"});var a=e(n.format(r),n.format(t));console.log(a.d)}}});