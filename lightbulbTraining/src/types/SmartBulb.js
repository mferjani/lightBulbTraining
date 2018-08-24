/*
* Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
* This material, including without limitation any software, is the confidential trade secret
* and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
* of this material in any form is strictly prohibited except as set forth in a written
* license agreement with C3 IoT and/or its authorized distributors.
* This product may be covered by one or more U.S. patents or pending patent applications.
~*/

/*
 * Returns the expected lumens of a light bulb based on wattage and bulbType
 */
function expectedLumens(wattage, bulbType) {
  if(bulbType == 'LED')
    return wattage * 84;
  if(bulbType == 'INCAN')
    return wattage * 14;
  if(bulbType == 'CFL')
    return wattage * 62;
}

/*
 * Returns the lifespan of a smart bulb in years.
 */
function lifeSpanInYears(bulbId){
  var bulb, startTime, defectFilter, defectDatum, defectTime, lifespan, conversionFactor, lifeSpanInYears;
  bulb = SmartBulb.get({id:bulbId});
  startTime = bulb.startDate;
  defectFilter = "status == 1 && lumens == 0 && parent.id == '" + 'SBMS_serialNo_' + bulb.id + "'";
  defectDatum = SmartBulbMeasurement.fetch({filter:defectFilter});
  defectTime = defectDatum.objs[0].end;
  lifespan = defectTime - startTime;
  conversionFactor = 1000*60*60*24*365;
  lifeSpanInYears = lifespan / conversionFactor;
  return lifeSpanInYears;
}

/*
 * Return the SmartBulbobject with the longest life span.
 */
function longestLifeSpanBulb(){
	var smartBulbIds = SmartBulb.fetch({include:"id", limit:100}).objs;
	var smartBulbWithLongestLifeSpanId;
	var longestLifeSpan = 0;
	var currentLifeSpan;
	var i = 0;
	for (i; i<smartBulbIds.length; i++) {
		currentLifeSpan = SmartBulb.lifeSpanInYears(smartBulbIds[i].id);
        if ( currentLifeSpan > longestLifeSpan) {
        	longestLifeSpan = currentLifeSpan;
        	smartBulbWithLongestLifeSpanId = smartBulbIds[i].id;
        }
    }
    return SmartBulb.get({id:smartBulbWithLongestLifeSpanId})
}

/*
 *  Return the SmartBulbobject with the shortestlife span.
 */
function shortestLifeSpanBulb(){
	var smartBulbIds = SmartBulb.fetch({include:"id", limit:-1}).objs;
	var smartBulbWithShortestLifeSpanId;
	var shortestLifeSpan = lifeSpanInYears(smartBulbIds[0].id); //init value
	var currentLifeSpan;
	var i = 0;
	for (i; i<smartBulbIds.length; i++) {
		currentLifeSpan = lifeSpanInYears(smartBulbIds[i].id);
        if ( currentLifeSpan < shortestLifeSpan) {
        	shortestLifeSpan = currentLifeSpan;
        	smartBulbWithShortestLifeSpanId = smartBulbIds[i].id;
        }
    }
    return SmartBulb.get({id:smartBulbWithShortestLifeSpanId});
}

/*
 * Return a doublerepresenting the average life span (in years) across all SmartBulbobjects. 
 */
function averageLifeSpan(){
	var smartBulbIds = SmartBulb.fetch({include:"id", limit:-1}).objs;
	var lifeSpanSum = 0;
	var i = 0;
	for (i; i<smartBulbIds.length; i++) {
		lifeSpanSum = lifeSpanSum + lifeSpanInYears(smartBulbIds[i].id);
    }
    return lifeSpanSum/smartBulbIds.length;
}
