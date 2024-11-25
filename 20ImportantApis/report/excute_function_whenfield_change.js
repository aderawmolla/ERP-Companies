
// this is done by Muhammed N
// 

frappe.query_reports["Monthly Attendance Report"] = {
	"filters": [
		{
			"fieldname":"from_attendance_date_ec",
			"name": "from_attendance_date_ec",
			"label": __("From Date (E.C.)"),
			"fieldtype": "Data",
			"change": function(){ ConvertFromDate(); },
			"reqd": 1
		},
		{
			"fieldname":"from_attendance_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.add_months(frappe.datetime.get_today(), -1),
			"reqd": 1
		},
		{
			"fieldname":"to_attendance_date_ec",
			"label": __("To Date (E.C.)"),
			"fieldtype": "Data",
			"change": function(){ ConvertToDate(); },
			"reqd": 1
		},
		{
			"fieldname":"to_attendance_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": getCurrentDate(),
			"reqd": 1
		},
	]
}



function ConvertFromDate() {
	var val = $("input[data-fieldname=from_attendance_date_ec]").val();
	var finalgc = convertDateTOGC(val.toString());
	$("input[data-fieldname=from_attendance_date]").val(finalgc).trigger("change");
}

function ConvertToDate() {
	var val = $("input[data-fieldname=to_attendance_date_ec]").val();
	var finalgc = convertDateTOGC(val.toString());
	$("input[data-fieldname=to_attendance_date]").val(finalgc).trigger("change");
}

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

function n(num, len = 2) {
    return `${num}`.padStart(len, '0');
}

function convertDateTOGC(ecDate) {
    var valDate = ecDate.split("/");
    var convertedData = ethioipicToGreg(parseInt(valDate[0]), parseInt(valDate[1]), parseInt(valDate[2]));
    var gcDateVal = n(convertedData[2])+"/"+n(convertedData[1])+"/"+n(convertedData[0]);
    var month = parseInt(n(convertedData[1]));
    var day = parseInt(n(convertedData[2]));
    var year = parseInt(n(convertedData[0]));
    var date = new Date(year,month-1,day);
    //return (day.length > 1? day:'0'+day)  +"-"+((month-1).length > 1 ? (month-1):'0'+(month-1))+"-"+year;
	//return date;
	var newDay = (date.getDate().length>1?date.getDate():'0'+date.getDate());
	var newMonth = (date.getMonth() + 1).length>1? (date.getMonth() + 1):'0'+(date.getMonth() + 1);
	var newYear = date.getFullYear();

	var newdate= (newDay+ '-'+newMonth+ '-' + newYear);
	return newdate;
}


function getCurrentDate() {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth() + 1; // Note: Months are zero-indexed
	const day = currentDate.getDate();
  
	// Formatting the date as "YYYY-MM-DD", you can adjust the format as needed
	const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  
	return formattedDate;
  }