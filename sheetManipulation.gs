////////////////////////////////////////////////////////////////////////////////////
///////// AUTOMATED MANIPULATION OF DEPOSITION DATA WITHIN THE SPREADSHEET /////////
////////////////////////////////////////////////////////////////////////////////////

/** Collects data from new orderer deposition sidebar
* @params {multiple} strings, bool Values from the form deployed through Google Sheet.
* @return Sequential array of values.
*/
function getNewDepositionData(orderedBy,orderedByEmail, witnessName, caseStyle, depoDate, depoHour, depoMinute, amPm, firm, attorney, attorneyEmail, attorneyPhone, firmAddress1, firmAddress2, city, state, zip, locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, locationPhone, services, courtReporter, videographer, pip, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyPhone, copyEmail, sendConfirmation) {
  // Updates progress to user through the sidebar UI
  SpreadsheetApp.getActiveSpreadsheet().toast('🚀️ Automation initiated');
  
  // Checks for orderedByEmail, if blank, exits script and alerts user
  if (orderedByEmail == '') {
    SpreadsheetApp.getActiveSpreadsheet().toast('⚠️️ Error: orderer email address was not included. Please add it.');
    return;
  };
  
  // Concatenates deposition time-related variables for print formatting
  var depoTime = depoHour + ':' + depoMinute + ' ' + amPm;
  
  // Converts PIP boolean value into "yes" or "no" string
  if (pip === true) {
    pip = 'Yes';
  } else {
    pip = 'No';
  };
  
  // Begins construction of deposition information array
  var newScheduledDepo = ['🟢 Current', depoDate, witnessName, orderedBy, orderedByEmail, caseStyle, depoTime, firm, attorney, firmAddress1, firmAddress2, city, state, zip, attorneyPhone, attorneyEmail, locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, locationPhone, services, courtReporter, videographer, pip, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyPhone,copyEmail];

  // Formats the array for Google Sheets setValue() method, calls printing function
  var formattedArray = [newScheduledDepo];
  printNewDeposition(formattedArray);
  SpreadsheetApp.getActiveSpreadsheet().toast('➕️ Depo added to Schedule a depo sheet');
  
  // Adds deposition to the Current List Sheet
  updateCurrentList (depoDate, witnessName, firm, city, courtReporter, videographer, pip);
  SpreadsheetApp.getActiveSpreadsheet().toast('🟢 Depo added to Current List sheet');
  
  // Adds deposition information to Video Worksheet
  updateVideoWorksheet(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, firm, attorney, attorneyEmail, firmAddress1, firmAddress2, city, state, zip, orderedBy, services, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyEmail);
  SpreadsheetApp.getActiveSpreadsheet().toast('🎥 Video Worksheet updated');
  
  // Adds deposition information to CR Worksheet
  updateCRWorksheet(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, firm, attorney, attorneyEmail, firmAddress1, firmAddress2, city, state, zip, attorneyPhone, orderedBy, services, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyEmail, copyPhone);
  SpreadsheetApp.getActiveSpreadsheet().toast('✍️ CR Worksheet updated');

  // Adds deposition information to Confirmation of Scheduling  
  updateConfirmationOfScheduling(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, firm, attorney, firmAddress1, firmAddress2, city, state, zip, attorneyPhone, orderedBy, videographer, pip);
  SpreadsheetApp.getActiveSpreadsheet().toast('🗓 Confirmation of Scheduling updated');
  
  // Adds the deposition to the Services calendar and logs it for internal record keeping.
  var event = addEvent(orderedBy, witnessName, caseStyle, depoDate, depoHour, depoMinute, amPm, firm, attorney, firmAddress1, firmAddress2, city, state, zip, locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, services, courtReporter, videographer, pip);
  addOrderToLog(orderedBy, firm);
  SpreadsheetApp.getActiveSpreadsheet().toast('📅 Deposition added to Services calendar');
  
  // If it was checked in the sidebar, sends a confirmation email to orderer
  Logger.log(sendConfirmation);
  if (sendConfirmation === true) {
    sendConfirmationToOrderer(orderedBy, orderedByEmail, caseStyle, depoDate, witnessName, depoHour, depoMinute, amPm, locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, services, courtReporter, videographer, pip);
    SpreadsheetApp.getActiveSpreadsheet().toast('📧 Confirmation email sent to orderer');
  };
};

/** Collects data from repeat orderer deposition sidebar
* @params {multiple} strings, bool Values from the form deployed through Google Sheet.
* @return Sequential array of values.
*/
function getRepeatDepositionData(previousOrderer, witnessName, caseStyle, depoDate, depoHour, depoMinute, amPm, locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, locationPhone, services, courtReporter, videographer, pip, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyPhone, copyEmail, sendConfirmation) {
  // Updates progress to user through the sidebar UI
  SpreadsheetApp.getActiveSpreadsheet().toast('🚀️ Automation initiated');
  
  // Concatenates deposition time-related variables for print formatting
  var depoTime = depoHour + ':' + depoMinute + ' ' + amPm;
  
  // Gets email address from previous orderer, exits the process if not included on the "Schedule a depo" Sheet
  var ordererEmail = emailFromOrderer(previousOrderer);
  if (ordererEmail == '') {
    SpreadsheetApp.getActiveSpreadsheet().toast('⚠️️ Error: orderer email address is not included in column E of "Schedule a depo" sheet. Please add it.');
    return;
  };
  
  // Begins construction of deposition information array
  var newScheduledDepo = ['🟢 Current', depoDate, witnessName, previousOrderer, ordererEmail, caseStyle, depoTime];
  
  // Gets firm and attorney information from previous orderer, pushes it into the newScheduledDepo array
  var infoFromPreviousOrderer = firmInformationFromOrderer(previousOrderer);
  for (var i = 0; i < infoFromPreviousOrderer.length; i++) {
    newScheduledDepo.push(infoFromPreviousOrderer[i]);
  };
  SpreadsheetApp.getActiveSpreadsheet().toast('📙️ Found attorney and firm info');
  
  // Convert PIP boolean value into "yes" or "no" string
  if (pip === true) {
    pip = 'Yes';
  } else {
    pip = 'No';
  };

  newScheduledDepo.push(locationFirm); 
  newScheduledDepo.push(locationAddress1); 
  newScheduledDepo.push(locationAddress2); 
  newScheduledDepo.push(locationCity); 
  newScheduledDepo.push(locationState); 
  newScheduledDepo.push(locationZip); 
  newScheduledDepo.push(locationPhone); 
  newScheduledDepo.push(services); 
  newScheduledDepo.push(courtReporter); 
  newScheduledDepo.push(videographer); 
  newScheduledDepo.push(pip);
  newScheduledDepo.push(copyAttorney);
  newScheduledDepo.push(copyFirm);
  newScheduledDepo.push(copyAddress1);
  newScheduledDepo.push(copyAddress2);
  newScheduledDepo.push(copyCity);
  newScheduledDepo.push(copyState);
  newScheduledDepo.push(copyZip); 
  newScheduledDepo.push(copyPhone);
  newScheduledDepo.push(copyEmail);
  
  // Formats the array for Google Sheets setValue() method, calls printing function
  var formattedArray = [newScheduledDepo];
  printNewDeposition(formattedArray);
  SpreadsheetApp.getActiveSpreadsheet().toast('➕️ Depo added to Schedule a depo sheet');
  
  // Adds deposition to the Current List Sheet
  updateCurrentList (depoDate, witnessName, infoFromPreviousOrderer[1], infoFromPreviousOrderer[4], courtReporter, videographer, pip);
  SpreadsheetApp.getActiveSpreadsheet().toast('🟢 Depo added to Current List sheet');
  
  // Adds deposition information to Video Worksheet
  updateVideoWorksheet(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, infoFromPreviousOrderer[0], infoFromPreviousOrderer[1], infoFromPreviousOrderer[8], infoFromPreviousOrderer[2], infoFromPreviousOrderer[3], infoFromPreviousOrderer[4], infoFromPreviousOrderer[5], infoFromPreviousOrderer[6], previousOrderer, services, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyEmail);
  SpreadsheetApp.getActiveSpreadsheet().toast('🎥 Video Worksheet updated');
  
  // Adds deposition information to CR Worksheet
  updateCRWorksheet(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, infoFromPreviousOrderer[0], infoFromPreviousOrderer[1], infoFromPreviousOrderer[8], infoFromPreviousOrderer[2], infoFromPreviousOrderer[3], infoFromPreviousOrderer[4], infoFromPreviousOrderer[5], infoFromPreviousOrderer[6], infoFromPreviousOrderer[7], previousOrderer, services, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyEmail, copyPhone);
  SpreadsheetApp.getActiveSpreadsheet().toast('✍️ CR Worksheet updated');
  
  // Adds deposition information to Confirmation of Scheduling  
  updateConfirmationOfScheduling(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, infoFromPreviousOrderer[0], infoFromPreviousOrderer[1], infoFromPreviousOrderer[2], infoFromPreviousOrderer[3], infoFromPreviousOrderer[4], infoFromPreviousOrderer[5], infoFromPreviousOrderer[6], infoFromPreviousOrderer[7], previousOrderer, videographer, pip);
  SpreadsheetApp.getActiveSpreadsheet().toast('🗓 Confirmation of Scheduling updated');
  
  // Adds the deposition to the Services calendar and logs it.
  addEvent(previousOrderer, witnessName, caseStyle, depoDate, depoHour, depoMinute, amPm, infoFromPreviousOrderer[0], infoFromPreviousOrderer[1], infoFromPreviousOrderer[2], infoFromPreviousOrderer[3], infoFromPreviousOrderer[4], infoFromPreviousOrderer[5], infoFromPreviousOrderer[6], locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, services, courtReporter, videographer, pip);
  addOrderToLog(previousOrderer, infoFromPreviousOrderer[0]);
  SpreadsheetApp.getActiveSpreadsheet().toast('📅 Deposition added to Services calendar');
  
  // If it was checked in the sidebar, sends a confirmation email to orderer
  if (sendConfirmation === true) {
    sendConfirmationToOrderer(previousOrderer, ordererEmail, caseStyle, depoDate, witnessName, depoHour, depoMinute, amPm, locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, services, courtReporter, videographer, pip);
    SpreadsheetApp.getActiveSpreadsheet().toast('📧 Confirmation email sent to orderer');
  };
};

/** Cancels a scheduled deposition. 
@param {eventId} string The eventId listed in the Schedule a depo Sheet.
@param {editRow} number Passed from the event object triggered by manually editing the Schedule a depo Sheet.
*/
function cancelDepo (eventId, editRow) {
  var ss = SpreadsheetApp.getActive();
  var currentListSheet = ss.getSheetByName('Current List');
  var scheduledDepoSheet = ss.getSheetByName('Schedule a depo');
  
  // Gets information about the deposition event and stores it.
  var servicesCal = CalendarApp.getCalendarById('salegalsolutions.com_17vfv1akbq03ro6jvtsre0rv84@group.calendar.google.com');
  var cancelledCal = CalendarApp.getCalendarById('salegalsolutions.com_vvgbtaerkh6db7jk87o6omskr4@group.calendar.google.com')
  var startTime = servicesCal.getEventById(eventId).getStartTime();
  var startTimeString = startTime.toString();
  var eventTitle = servicesCal.getEventById(eventId).getTitle();
  var cancelledEventTitle = 'Cancelled ' + eventTitle;
  var eventDescription = servicesCal.getEventById(eventId).getDescription();
  var eventLocation = servicesCal.getEventById(eventId).getLocation();
  
  // Formats event time so that it can be searched for in the Current List Sheet.
  var month = monthToMm(startTimeString.substring(4, 7));
  var day = startTimeString.substring(8, 10);
  var currentListSearchDate = month + '-' + day;
  
  // Creates an array of row numbers in the Current List matching the currentListSearchDate.
  var currentListData = currentListSheet.getRange(2, 1, currentListSheet.getLastRow(), currentListSheet.getLastColumn()).getValues();
  var matchingDateRows = [];
  for (var i = 0; i < currentListData.length; i++ ) {
    if (currentListData[i][0] === currentListSearchDate) {
      matchingDateRows.push(i + 2);
    };
  };
  
  var rowToDeleteFromCurrentList;
  
  // If there's more than one matching row from the Current List, cycle through and look for witness match.
  if (matchingDateRows.length === 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Matching depo not found in Current List. Nothing deleted from Current List.');
  } else if (matchingDateRows.length === 1) {
    rowToDeleteFromCurrentList = matchingDateRows[0];
  } else {
    var witness = eventDescription.match(/Witness Name:.*(?=\n)/)[0].slice(14);
    matchingDateRows.forEach(function(matchingRow) {
      if (currentListSheet.getRange(matchingRow, 2).getValue() === witness) {
        rowToDeleteFromCurrentList = matchingRow;
      };
    });
  };
  
  // Deletes the deposition from the Current List Sheet.
  currentListSheet.deleteRow(rowToDeleteFromCurrentList);
  SpreadsheetApp.getActiveSpreadsheet().toast('✂️ Deposition removed from Current List.');
  
  // Adds the cancelled deposition event to the Cancelled calendar.
  var event = cancelledCal.createEvent(cancelledEventTitle, 
                                new Date(startTime),
                                new Date(startTime),{
                                  description: eventDescription,
                                  location: eventLocation
                                });
  
  // Updates the Schedule a depo Sheet with the cancelled event ID.
  var cancelledEventId = event.getId();
  scheduledDepoSheet.getRange(editRow, 37).setValue(cancelledEventId);
  
  // Deletes the event from the Services Calendar. 
  servicesCal.getEventById(eventId).deleteEvent();
  
  SpreadsheetApp.getActiveSpreadsheet().toast('🔀 Deposition moved to Cancelled Calendar');
};

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// SHEET UPDATE FUNCTIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

/** Updates the Current List on addition of a new deposition.
@params {depositionInformation} strings Deposition information received from the sidebar.
*/
function updateCurrentList (depoDate, witnessName, firm, city, courtReporter, videographer, pip) {  
  var ss = SpreadsheetApp.getActive();
  var currentListSheet = ss.getSheetByName('Current List');
  
  // Sets defaults for hasCourtReporter and hasVideo, then formats them based on value from sidebar.
  var hasCourtReporter = 'x';
  var hasVideo = 'x';
  
  if (courtReporter === '') {
    courtReporter = 'x';
  } else {
    hasCourtReporter = 'Yes';
  };
  
  if (videographer === '') {
    videographer = 'x';
  } else {
    hasVideo = 'Yes';
  };
  
  if (pip === 'No') {
    pip = 'x';
  };
  
  // Trims depoDate down to MM-DD format.
  depoDate = depoDate.toString();
  depoDate = depoDate.substring(5, 10);
  
  // Prints values to Current List Sheet.
  currentListSheet.insertRowBefore(2);
  currentListSheet.getRange('A2').setValue(depoDate);
  currentListSheet.getRange('B2').setValue(witnessName);
  currentListSheet.getRange('C2').setValue(firm);
  currentListSheet.getRange('D2').setValue(city);
  currentListSheet.getRange('F2').setValue(hasCourtReporter);
  currentListSheet.getRange('G2').setValue(courtReporter);
  currentListSheet.getRange('H2').setValue(hasVideo);
  currentListSheet.getRange('J2').setValue(pip);
  currentListSheet.getRange('L2').setValue(videographer);
};

/** Updates the Video Worksheet with the most recently-entered deposition information.
@params {depositionInformation} strings Deposition information received from the sidebar.
*/
function updateVideoWorksheet(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, firm, attorney, attorneyEmail, firmAddress1, firmAddress2, city, state, zip, orderedBy, services, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyEmail) {
  var videoSheet = SpreadsheetApp.getActive().getSheetByName('Video Worksheet');
  
  // Sets values inside video worksheet.
  videoSheet.getRange('B9').setValue(locationFirm);
  videoSheet.getRange('B10').setValue(locationAddress1);
  videoSheet.getRange('B11').setValue(locationAddress2);
  videoSheet.getRange('B12').setValue(locationCity);
  videoSheet.getRange('C12').setValue(locationState);
  videoSheet.getRange('D12').setValue(locationZip);
  videoSheet.getRange('F9').setValue(depoDate);
  videoSheet.getRange('A1').setValue(depoDate);
  videoSheet.getRange('F10').setValue(witnessName);
  videoSheet.getRange('D1').setValue(witnessName);
  videoSheet.getRange('F11').setValue(caseStyle);
  videoSheet.getRange('F14').setValue(depoTime);
  videoSheet.getRange('B13').setValue(courtReporter);
  videoSheet.getRange('B22').setValue(firm);
  videoSheet.getRange('B1').setValue(firm);
  videoSheet.getRange('B20').setValue(attorney);
  videoSheet.getRange('D21').setValue(attorneyEmail);
  videoSheet.getRange('B24').setValue(firmAddress1);
  videoSheet.getRange('B25').setValue(firmAddress2);
  videoSheet.getRange('A26').setValue(city);
  videoSheet.getRange('B26').setValue(state);
  videoSheet.getRange('C26').setValue(zip);
  videoSheet.getRange('H55').setValue(orderedBy);
  videoSheet.getRange('G1').setValue(services);
  videoSheet.getRange('B28').setValue(copyAttorney);
  videoSheet.getRange('B30').setValue(copyFirm);
  videoSheet.getRange('B32').setValue(copyAddress1);
  videoSheet.getRange('B33').setValue(copyAddress2);
  videoSheet.getRange('A34').setValue(copyCity);
  videoSheet.getRange('B34').setValue(copyState);
  videoSheet.getRange('C34').setValue(copyZip);
  videoSheet.getRange('D29').setValue(copyEmail);
};

/** Updates the CR Worksheet with the most recently-entered deposition information.
@params {depositionInformation} strings Deposition information received from the sidebar.
*/
function updateCRWorksheet(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, firm, attorney, attorneyEmail, firmAddress1, firmAddress2, city, state, zip, attorneyPhone, orderedBy, services, copyAttorney, copyFirm, copyAddress1, copyAddress2, copyCity, copyState, copyZip, copyEmail, copyPhone) {
  var crSheet = SpreadsheetApp.getActive().getSheetByName('CR Worksheet');
  
  // Sets values inside CR Worksheet.
  crSheet.getRange('B7').setValue(locationFirm);
  crSheet.getRange('B8').setValue(locationAddress1);
  crSheet.getRange('B9').setValue(locationAddress2);
  crSheet.getRange('B10').setValue(locationCity);
  crSheet.getRange('C10').setValue(locationState);
  crSheet.getRange('D10').setValue(locationZip);
  crSheet.getRange('F7').setValue(depoDate);
  crSheet.getRange('A1').setValue(depoDate);
  crSheet.getRange('F8').setValue(witnessName);
  crSheet.getRange('D1').setValue(witnessName);
  crSheet.getRange('F9').setValue(caseStyle);
  crSheet.getRange('F11').setValue(depoTime);
  crSheet.getRange('B11').setValue(courtReporter);
  crSheet.getRange('D20').setValue(firm);
  crSheet.getRange('B1').setValue(firm);
  crSheet.getRange('B19').setValue(attorney);
  crSheet.getRange('E21').setValue(attorneyEmail);
  crSheet.getRange('A22').setValue(firmAddress1);
  crSheet.getRange('C22').setValue(firmAddress2);
  crSheet.getRange('A23').setValue(city);
  crSheet.getRange('B23').setValue(state);
  crSheet.getRange('C23').setValue(zip);
  crSheet.getRange('C21').setValue(attorneyPhone);
  crSheet.getRange('H57').setValue(orderedBy);
  crSheet.getRange('G1').setValue(services);
  crSheet.getRange('B28').setValue(copyAttorney);
  crSheet.getRange('D29').setValue(copyFirm);
  crSheet.getRange('A31').setValue(copyAddress1);
  crSheet.getRange('C31').setValue(copyAddress2);
  crSheet.getRange('A32').setValue(copyCity);
  crSheet.getRange('B32').setValue(copyState);
  crSheet.getRange('C32').setValue(copyZip);
  crSheet.getRange('D31').setValue(copyEmail);
  crSheet.getRange('C30').setValue(copyPhone);
};

/** Updates the Confirmation of Scheduling with the most recently-entered deposition information.
@params {depositionInformation} strings Deposition information received from the sidebar.
*/
function updateConfirmationOfScheduling(locationFirm, locationAddress1, locationAddress2, locationCity, locationState, locationZip, depoDate, witnessName, caseStyle, depoTime, courtReporter, firm, attorney, firmAddress1, firmAddress2, city, state, zip, attorneyPhone, orderedBy, videographer, pip) {
  var confSheet = SpreadsheetApp.getActive().getSheetByName('Confirmation of Scheduling');
  
  // Sets values inside CR Worksheet.
  confSheet.getRange('C18').setValue(locationFirm);
  confSheet.getRange('C19').setValue(locationAddress1);
  confSheet.getRange('C20').setValue(locationAddress2);
  confSheet.getRange('C21').setValue(locationCity);
  confSheet.getRange('D21').setValue(locationState);
  confSheet.getRange('E21').setValue(locationZip);
  confSheet.getRange('G16').setValue(depoDate);
  confSheet.getRange('G20').setValue(witnessName);
  confSheet.getRange('C16').setValue(caseStyle);
  confSheet.getRange('G18').setValue(depoTime);
  confSheet.getRange('C22').setValue(courtReporter);
  confSheet.getRange('C8').setValue(firm);
  confSheet.getRange('G22').setValue(attorney);
  confSheet.getRange('G8').setValue(firmAddress1);
  confSheet.getRange('G9').setValue(firmAddress2);
  confSheet.getRange('G10').setValue(city);
  confSheet.getRange('H10').setValue(state);
  confSheet.getRange('I10').setValue(zip);
  confSheet.getRange('E11').setValue(attorneyPhone);
  confSheet.getRange('C10').setValue(orderedBy);
  confSheet.getRange('E22').setValue(videographer);
  confSheet.getRange('D28').setValue(pip);
};


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// UTILITIES /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

/** Return a clean array of previous deposition orderers 
* @return {array} Previous deposition orderers without duplicates, sorted alphabetically (by First Name).
*/
function getPreviousOrderers () {
  var ss = SpreadsheetApp.getActive()
  var depoSheet = ss.getSheetByName('Schedule a depo');
  var lastDepoSheetRow = depoSheet.getLastRow();
  var rawOrdererData = depoSheet.getRange(2, 4, lastDepoSheetRow, 1).getValues();
  
  // Creates a 2d array of previous orderers.
  var firstLevelArray = [];
  rawOrdererData.forEach(function(element) {
    firstLevelArray.push(element[0]);
  });
  
  /** Removes all elements that are empty strings from an array
  */
  function isntEmpty (element) {
  return element != '';
  };
  
  // Filter out empty strings, remove duplicate elements, and sort the array
  var firstLevelEmptiesRemoved = firstLevelArray.filter(isntEmpty);
  
  var uniqueArray = firstLevelEmptiesRemoved.filter(function(elem, index, self) {
    return index === self.indexOf(elem);
  });
  
  var sortedUniqueArray = uniqueArray.sort();
  
  return sortedUniqueArray;
};

/** Prints an array to the final row of the "Schedule a depo" sheet
@param {array} 1d array ordered to align with the columns in "Schedule a depo."
*/
function printNewDeposition (array) {
  var ss = SpreadsheetApp.getActive();
  var scheduleSheet = ss.getSheetByName('Schedule a depo');
  
  // Create an empty row for the new deposition at the top of the sheet, shift others down by 1, print to the new row
  scheduleSheet.insertRowBefore(2);
  scheduleSheet.getRange(2, 1, 1, 36).setValues(array);
};

/** Takes the most recently-scheduled depo by an orderer and returns an array with the lawyer and firm information.
@param {orderer} string The previous orderer's name as selected from the New Deposition from a Previous Orderer sidebar dropdown menu.
*/
function firmInformationFromOrderer (orderer) {
  var ss = SpreadsheetApp.getActive();
  var scheduleSheet = ss.getSheetByName('Schedule a depo');
  
  // Gets an array of row arrays that match orderer name
  var allScheduledRows = scheduleSheet.getRange(2, 1, scheduleSheet.getLastRow(), scheduleSheet.getLastColumn()).getValues();
  var attyAndFirmInformation = [];
  for (var i = 0; i < allScheduledRows.length; i++) {
    if (allScheduledRows[i][3] === orderer) {
      // allScheduledRows[i][n] because columns 7 - 15 contain the desired information on the "Schedule a depo" sheet
      attyAndFirmInformation.push(allScheduledRows[i][7]);
      attyAndFirmInformation.push(allScheduledRows[i][8]);
      attyAndFirmInformation.push(allScheduledRows[i][9]);
      attyAndFirmInformation.push(allScheduledRows[i][10]);
      attyAndFirmInformation.push(allScheduledRows[i][11]);
      attyAndFirmInformation.push(allScheduledRows[i][12]);
      attyAndFirmInformation.push(allScheduledRows[i][13]);
      attyAndFirmInformation.push(allScheduledRows[i][14]);
      attyAndFirmInformation.push(allScheduledRows[i][15]);
      break;
    };
  };
  return attyAndFirmInformation;
};


/** Gets the email address of a previous orderer from the most recently-scheduled depo from them
@param {orderer} string The previous orderer's name as selected from the New Deposition from a Previous Orderer sidebar dropdown menu.
*/
function emailFromOrderer (orderer) {
  var ss = SpreadsheetApp.getActive();
  var scheduleSheet = ss.getSheetByName('Schedule a depo');
  
  // Gets an array of row arrays that match orderer name
  var allScheduledRows = scheduleSheet.getRange(2, 1, scheduleSheet.getLastRow(), scheduleSheet.getLastColumn()).getValues();
  var ordererEmail = '';
  for (var i = 0; i < allScheduledRows.length; i++) {
    if (allScheduledRows[i][3] === orderer) {
      // allScheduledRows[i][n] because columns 7 - 15 contain the desired information on the "Schedule a depo" sheet
      ordererEmail = allScheduledRows[i][4];
      break;
    };
  };
  
  return ordererEmail;
};











