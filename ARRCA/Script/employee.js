
cur_frm.add_fetch('employee', 'employee_name', 'employee_name');
frappe.ui.form.on("Gurante", {
  employee_name: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var emp = child.employee;

    // Flags to check for different types of guarantees
    var hasWorkGurante = false;
    var hasTrainingGurante = false;

    // Loop to identify if there are already "የስልጠና" or "የስራ" guarantees
    (frm.doc.gurante || []).forEach(function (row) {
      if (row.gurante_type === "የስልጠና" && (row.name !== child.name)) {
        hasTrainingGurante = true;
      } else if (row.gurante_type === "የስራ" && (row.name !== child.name) ) {
        hasWorkGurante = true;
      }
    });

    // Loop through the child table to validate conditions
    (frm.doc.gurante || []).forEach(function (row) {
      if (
        (hasWorkGurante || hasTrainingGurante) &&
        emp === row.employee &&
        row.name !== child.name
      ) {
        frappe.msgprint("የስራና የስልጠና ዋስ ከአንድ ጊዜ በላይ መሆን አይቻልም");
        return false; // Exit the loop early
      }
    });
  },
});


frappe.ui.form.on("Employee", {
  fetch_the_todates: function (frm) {
  if (frm.doc.internal_work_history) {
    var rows = frm.doc.internal_work_history;
    for (let index = 0; index < rows.length; index++) {
      let currentItem = rows[index];
      let nextItem = rows[index + 1];

      if (nextItem) {
        if (
          currentItem.from_date &&
          !currentItem.to_date &&
          nextItem.from_date
        ) {
          currentItem.to_date = frappe.datetime.add_days(
            nextItem.from_date,
            -1
          );
        }
        if (
          currentItem.from_date_ec &&
          !currentItem.to_date_ec &&
          nextItem.from_date_ec
        ) {
          // Manipulating the from_date_ec format
          let dateParts = nextItem.from_date_ec.split("/");
          if (dateParts.length === 3) {
            let day = parseInt(dateParts[0]);
            let month = dateParts[1];
            let year = dateParts[2];

            // Subtract 1 from the day
            let newDay = day - 1;
            if (newDay === 0) {
              // Handle going to the previous month
              // Example: If the date was 01/02/2023, it will become 31/01/2023
              let previousMonthDate = new Date(year, parseInt(month) - 1, 0);
              newDay = previousMonthDate.getDate();
              month = previousMonthDate.getMonth() + 1;
              month = month.toString().padStart(2, "0");
              year = previousMonthDate.getFullYear();
            }
            let formattedDay = newDay.toString().padStart(2, "0");

            // Reconstruct the date in the original format
            currentItem.to_date_ec = `${formattedDay}/${month}/${year}`;
          }

          calculateDayInternal(frm);
          refresh_field("internal_work_history");
        }
      }
    }
    refresh_field("internal_work_history");
  }
},
});

frappe.ui.form.on("Employee", {
date_of_birth_ec: function (frm, cdt, cdn) {
  var date = convertDateTOGC(frm.doc.date_of_birth_ec.toString());
  var dateObject = new Date(date);
  // Format the date as a string in a desired format
  var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
  frm.set_value("date_of_birth", formattedDate);
  frm.refresh_field("date_of_birth");
},
});

frappe.ui.form.on("Uniform registration form", {
qty: function (frm, cdt, cdn) {
  var child = locals[cdt][cdn];
  console.log("this is excuted")
  // Calculate the amount
  child.amount = flt(child.qty) * flt(child.unit_price);
  // Refresh the child table field
  frm.refresh_field("employee_registration"); // Replace "uniform_items" with the actual child table fieldname
},
});


frappe.ui.form.on("Employee", {
date_of_birth_ec: function (frm, cdt, cdn) {
  if (frm.doc.date_of_birth_ec)
    // Convert Ethiopian date to Gregorian date
    var date = frm.doc.date_of_birth_ec;
  let dateParts = date.split("/");

  let day = parseFloat(dateParts[0]);
  let month = parseFloat(dateParts[1]);
  let year = parseFloat(dateParts[2]);

  let yearRetire = year + 60;
  var monthRetire;
  let dayRetire;
  if (day == 1) {
    dayRetire = day;
    monthRetire = month;
  } else if (month == 12 || month == 13) {
    dayRetire = 1;
    monthRetire = 1;
    yearRetire += 1;
  } else {
    dayRetire = 1;
    monthRetire = month + 1;
  }

  var retireDate = dayRetire + "/" + monthRetire + "/" + yearRetire;
  frm.set_value("retirement_date", retireDate);
  refresh_field("retirement_date");
},

date_of_joining_ec: function (frm, cdt, cdn) {
  if (frm.doc.date_of_joining_ec) {
    var parts = frm.doc.date_of_joining_ec.split("/");
    // Create a Date object by specifying year, month (0-based), and day
    var formatedDate = parts[2] + "-" + (parts[1] - 1) + "-" + parts[0];
    frm.set_value("date_of_joining", formatedDate);
    refresh_field("date_of_joining");
  }
},

releiving_date_ec: function (frm, cdt, cdn) {
  if (frm.doc.releiving_date_ec) {
    var date = convertDateTOGC(frm.doc.releiving_date_ec.toString());
            var dateObject = new Date(date);
    // Format the date as a string in a desired format
           var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("relieving_date", formattedDate);
            frm.refresh_field("relieving_date")
  }
},
});

frappe.ui.form.on("Employee External Work History", {
from_date_ec: function (frm, cdt, cdn) {
  if (frm.selected_doc.from_date_ec && frm.selected_doc.to_date_ec) {
    var finalgc = convertDateTOGC(frm.selected_doc.from_date_ec.toString());
    frm.selected_doc.from_date = finalgc;
    calculateDay(frm, cdt, cdn);
    calculateDayExternal(frm, cdt, cdn);
    refresh_field("external_work_history");
  }
},

to_date_ec: function (frm, cdt, cdn) {
  if (frm.selected_doc.to_date_ec && frm.selected_doc.from_date_ec) {
    var finalgc = convertDateTOGC(frm.selected_doc.to_date_ec.toString());
    frm.selected_doc.to_date = finalgc;
    calculateDay(frm, cdt, cdn);
    calculateDayExternal(frm, cdt, cdn);
    refresh_field("external_work_history");
  }
},
});

frappe.ui.form.on("Employee Education", {
year_of_finish_ec: function (frm, cdt, cdn) {
  if (frm.selected_doc.year_of_finish_ec) {
    var finalgc = convertDateTOGC(
      frm.selected_doc.year_of_finish_ec.toString()
    );
    frm.selected_doc.graduating_year = finalgc;
    refresh_field("education");
  }
},
});

frappe.ui.form.on("Child", {
child_birth_date_ec: function (frm, cdt, cdn) {
  if (frm.selected_doc.child_birth_date_ec) {
    var finalgc = convertDateTOGC(
      frm.selected_doc.child_birth_date_ec.toString()
    );
    frm.selected_doc.የልደት_ቀንና = finalgc;
    refresh_field("child");
  }
},
});

frappe.ui.form.on("Employee Internal Work History", {
from_date_ec: function (frm, cdt, cdn) {
  var row = locals[cdt][cdn];
  row.from_date = convertDateTOGC(frm.selected_doc.from_date_ec.toString());
  refresh_field("internal_work_history");
  if (row.from_date_ec && row.to_date_ec) {
    console.log("Test 1 from");
    calculateDay(frm, cdt, cdn);
    calculateDayInternal(frm, cdt, cdn);
    refresh_field("internal_work_history");
  }
},

to_date_ec: function (frm, cdt, cdn) {
  var row = locals[cdt][cdn];
  row.to_date = convertDateTOGC(frm.selected_doc.to_date_ec.toString());
  refresh_field("internal_work_history");
  if (row.from_date_ec && row.to_date_ec) {
    console.log("Test 1 to");
    calculateDay(frm, cdt, cdn);
    calculateDayInternal(frm, cdt, cdn);
    refresh_field("internal_work_history");
  }
},
});

function calculateDay(frm, cdt, cdn) {
var row = locals[cdt][cdn];

let fromDate = row.from_date_ec.split("/");
let toDate = row.to_date_ec.split("/");

let day_diff = parseFloat(toDate[0]) - parseFloat(fromDate[0]);
let month_diff = parseFloat(toDate[1]) - parseFloat(fromDate[1]);
let year_diff = parseFloat(toDate[2]) - parseFloat(fromDate[2]);

// Adjust negative day and month differences
if (day_diff < 0) {
  month_diff--; // Decrement month by 1
  day_diff += 30; // Assuming 30 days per month
}
if (month_diff < 0) {
  year_diff--; // Decrement year by 1
  month_diff += 12; // Assuming 12 months per year
}

// Loop until day and month differences are within limits
while (day_diff > 30 || month_diff > 12) {
  if (day_diff > 30) {
    month_diff++; // Increment month by 1
    day_diff -= 30; // Reset days
  }
  if (month_diff > 12) {
    year_diff++; // Increment year by 1
    month_diff -= 12; // Reset months
  }
}

var finalDiff =
  year_diff + " years " + month_diff + " months " + day_diff + " days ";
console.log("final diff", finalDiff);

row.total_experience = finalDiff;
refresh_field("internal_work_history");
refresh_field("internal_work_history");
}

function calculateDayInternal(frm, cdt, cdn) {
// Calculate the total experience
let total_day_diff = 0;
let total_month_diff = 0;
let total_year_diff = 0;

var table = frm.doc.internal_work_history;
table.map((item, index) => {
  if (item.from_date_ec && item.to_date_ec) {
    if (item.designation == "ትምህርት ክፍል") {
      console.log("do nothing");
    } else {
      let fromDates = item.from_date_ec.split("/");
      let toDates = item.to_date_ec.split("/");

      let day_diffs = parseFloat(toDates[0]) - parseFloat(fromDates[0] + 1);
      let month_diffs = parseFloat(toDates[1]) - parseFloat(fromDates[1]);
      let year_diffs = parseFloat(toDates[2]) - parseFloat(fromDates[2]);

      // Adjust negative day and month differences
      if (day_diffs < 0) {
        month_diffs--; // Decrement month by 1
        day_diffs += 30; // Assuming 30 days per month
      }
      if (month_diffs < 0) {
        year_diffs--; // Decrement year by 1
        month_diffs += 12; // Assuming 12 months per year
      }

      // Loop until day and month differences are within limits
      while (day_diffs > 30 || month_diffs > 12) {
        if (day_diffs > 30) {
          month_diffs++; // Increment month by 1
          day_diffs -= 30; // Reset days
        }
        if (month_diffs > 12) {
          year_diffs++; // Increment year by 1
          month_diffs -= 12; // Reset months
        }
      }

      total_day_diff += day_diffs;
      total_month_diff += month_diffs;
      total_year_diff += year_diffs;

      var finalll =
        year_diffs + " አመት " + month_diffs + " ወር " + day_diffs + " ቀን ";

      item.total_experience = finalll;
      frm.refresh_field("internal_work_history");
    }
  }
});

// Loop until total day and month differences are within limits
while (total_day_diff > 30 || total_month_diff > 12) {
  if (total_day_diff > 30) {
    total_month_diff++; // Increment month by 1
    total_day_diff -= 30; // Reset days
  }
  if (total_month_diff > 12) {
    total_year_diff++; // Increment year by 1
    total_month_diff -= 12; // Reset months
  }
}

var finalDiffs =
  total_year_diff +
  " years " +
  total_month_diff +
  " months " +
  total_day_diff +
  " days ";
console.log("total final diff", finalDiffs);

frm.set_value("total_current_experience", finalDiffs);
refresh_field("total_current_experience");
}

function calculateDayExternal(frm, cdt, cdn) {
// Calculate the total experience
let total_day_diff = 0;
let total_month_diff = 0;
let total_year_diff = 0;

var table = frm.doc.external_work_history;
table.map((item, index) => {
  if (item.from_date_ec && item.to_date_ec) {
    if (item.designation == "ትምህርት ክፍል") {
      console.log("do nothing");
    } else {
      let fromDates = item.from_date_ec.split("/");
      let toDates = item.to_date_ec.split("/");
      let day_diffs = parseFloat(toDates[0]) - parseFloat(fromDates[0] + 1);
      let month_diffs = parseFloat(toDates[1]) - parseFloat(fromDates[1]);
      let year_diffs = parseFloat(toDates[2]) - parseFloat(fromDates[2]);

      // Adjust negative day and month differences
      if (day_diffs < 0) {
        month_diffs--; // Decrement month by 1
        day_diffs += 30; // Assuming 30 days per month
      }
      if (month_diffs < 0) {
        year_diffs--; // Decrement year by 1
        month_diffs += 12; // Assuming 12 months per year
      }

      // Loop until day and month differences are within limits
      while (day_diffs > 30 || month_diffs > 12) {
        if (day_diffs > 30) {
          month_diffs++; // Increment month by 1
          day_diffs -= 30; // Reset days
        }
        if (month_diffs > 12) {
          year_diffs++; // Increment year by 1
          month_diffs -= 12; // Reset months
        }
      }

      total_day_diff += day_diffs;
      total_month_diff += month_diffs;
      total_year_diff += year_diffs;
    }
  }
});

// Loop until total day and month differences are within limits
while (total_day_diff > 30 || total_month_diff > 12) {
  if (total_day_diff > 30) {
    total_month_diff++; // Increment month by 1
    total_day_diff -= 30; // Reset days
  }
  if (total_month_diff > 12) {
    total_year_diff++; // Increment year by 1
    total_month_diff -= 12; // Reset months
  }
}

var finalDiffs =
  total_year_diff +
  " years " +
  total_month_diff +
  " months " +
  total_day_diff +
  " days ";
console.log("total final diff", finalDiffs);

frm.set_value("total_previous_experience", finalDiffs);
refresh_field("total_previous_experience");
}

frappe.ui.form.on("Medical Form", {
asked: function (frm, cdt, cdn) {
  calculateMedicine(frm, cdt, cdn);
},
});

frappe.ui.form.on("Medical Form Two", {
asked: function (frm, cdt, cdn) {
  calculateMedicineTwo(frm, cdt, cdn);
},
});

function calculateMedicine(frm, cdt, cdn) {
var used = 0;
var allowSave = true;
var forGlass = 0;
var forBirth = 0;
$.each(frm.doc.medicine, function (index, row) {
  //ለወሊድ
  if (row.reason == "የመነፅር") {
    console.log("we are not inside");
    if (row.from_government == "Yes") {
      forGlass += row.asked;
      row.amount_paid = row.asked;
      refresh_field("medicine");
    } else {
      forGlass += row.asked * 0.8;
      row.amount_paid = row.asked * 0.8;
      refresh_field("medicine");
    }
    if (forGlass > parseFloat(3000)) {
      frappe.model.clear_doc(row.doctype, row.name);
      refresh_field("medicine");
      allowSave = false;
      frappe.throw("Total amount paid for glass can not exceed 3000.");
      return false; // exit the loop
    }
  } else if (row.reason == "ለወሊድ") {
    console.log("we are not inside");
    if (row.from_government == "Yes") {
      forBirth += row.asked;
      row.amount_paid = row.asked;
      refresh_field("medicine");
    } else {
      forBirth += row.asked * 0.8;
      row.amount_paid = row.asked * 0.8;
      refresh_field("medicine");
    }
    if (forGlass > parseFloat(3000)) {
      frappe.model.clear_doc(row.doctype, row.name);
      refresh_field("medicine");
      allowSave = false;
      frappe.throw("Total amount paid for glass can not exceed 3000.");
      return false; // exit the loop
    }
  } else {
    console.log("wer are  inside");
    if (row.from_government == "Yes") {
      used += row.asked;
      row.amount_paid = row.asked;
      refresh_field("medicine");
    } else {
      used += row.asked * 0.8;
      row.amount_paid = row.asked * 0.8;
      refresh_field("medicine");
    }
    if (used > parseFloat(12000) && row.reason !== "የስራ ላይ አደጋ") {
      frappe.model.clear_doc(row.doctype, row.name);
      refresh_field("medicine");
      allowSave = false;
      frappe.throw(
        "Total amount paid exceeds 12000 and reason is not 'የስራ ላይ አደጋ'. Cannot save the document."
      );
      return false; // exit the loop
    }
  }
});

if (allowSave) {
  frm.set_value("used_medicine__from_12000", used);
  frm.set_value("total_birr_for_glass", forGlass);
  frm.set_value("total_birr_for_birth", forBirth);
  frm.set_value("ramaining_from_12000", parseFloat(12000) - used);
  frm.refresh_field("sed_medicine__from_12000");
  frm.refresh_field("total_birr_for_birth");
  frm.refresh_field("total_birr_for_glass");
  frm.refresh_field("ramaining_from_12000");
}
}

function calculateMedicineTwo(frm, cdt, cdn) {
var used = 0;

$.each(frm.doc.medicine2, function (index, row) {
  if (row.from_government == "Yes") {
    used += row.asked;
    row.amount_paid = row.asked;
    refresh_field("medicine2");
  } else {
    used += row.asked * 0.8;
    row.amount_paid = row.asked * 0.8;
    refresh_field("medicine2");
  }
});

frm.set_value("total_medicine_in_birr", used);
frm.refresh_field("total_medicine_in_birr");
}

function CalculateExperiance(frm) {
var previousTotalDays = 0;
var currentTotalDays = 0;
var totalDays = 0;

var external_work_history = frm.doc.external_work_history;
$.each(external_work_history, function (_i, e) {
  if (e.from_date && e.to_date) {
    var date1 = new Date(e.from_date.toString());
    var date2 = new Date(e.to_date.toString());
    var total_days_for_each_experiance = CalDaysInBetweenDates(date1, date2);

    var tExperianceMonth = CalMonthFromDays(total_days_for_each_experiance);
    var tExperianceYear = CalYearFromMonth(tExperianceMonth);
    var tExperianceRemainDays = RemainDays(total_days_for_each_experiance);
    var tExperianceRemainMonth = RemainMonths(tExperianceMonth);
    var tExperianceMessage = DurationMessage(
      tExperianceYear,
      tExperianceRemainMonth,
      tExperianceRemainDays
    );

    e.total_experience = tExperianceMessage;
    previousTotalDays += total_days_for_each_experiance;
    refresh_field("external_work_history");
  }
});

var previousMonth = CalMonthFromDays(previousTotalDays);
var previousYear = CalYearFromMonth(previousMonth);
var previousRemainDays = RemainDays(previousTotalDays);
var previousRemainMonth = RemainMonths(previousMonth);
var previousMessage = DurationMessage(
  previousYear,
  previousRemainMonth,
  previousRemainDays
);
frm.doc.total_previous_experience = previousMessage;

var internal_work_history = frm.doc.internal_work_history;
$.each(internal_work_history, function (_i, e) {
  if (e.from_date && e.to_date) {
    var date1 = new Date(e.from_date.toString());
    var date2 = new Date(e.to_date.toString());
    var total_days_for_each_experiance = CalDaysInBetweenDates(date1, date2);

    var tExperianceMonth = CalMonthFromDays(total_days_for_each_experiance);
    var tExperianceYear = CalYearFromMonth(tExperianceMonth);
    var tExperianceRemainDays = RemainDays(total_days_for_each_experiance);
    var tExperianceRemainMonth = RemainMonths(tExperianceMonth);
    var tExperianceMessage = DurationMessage(
      tExperianceYear,
      tExperianceRemainMonth,
      tExperianceRemainDays
    );

    e.total_experience = tExperianceMessage;
    currentTotalDays += total_days_for_each_experiance;
    refresh_field("external_work_history");
  }
});

var currentMonth = CalMonthFromDays(currentTotalDays);
var currentYear = CalYearFromMonth(currentMonth);
var currentRemainDays = RemainDays(currentTotalDays);
var currentRemainMonth = RemainMonths(currentMonth);
var currentMessage = DurationMessage(
  currentYear,
  currentRemainMonth,
  currentRemainDays
);
frm.doc.total_current_experience = currentMessage;

totalDays = previousTotalDays + currentTotalDays;

var month = CalMonthFromDays(totalDays);
var year = CalYearFromMonth(month);
var remainDays = RemainDays(totalDays);
var remainMonth = RemainMonths(month);
var message = DurationMessage(year, remainMonth, remainDays);
frm.doc.grand_total_experience = message;

refresh_field("total_previous_experience");
refresh_field("total_current_experience");
refresh_field("grand_total_experience");
}

// function calculateYearDifference(frm, cdt, cdn, ) {
// 	console.log("wer are here outside")
// 	var row = locals[cdt][cdn];
// 	if (row.from_date && row.to_date) {
// 		console.log("we are here inside")
// 		// Convert date strings to Date objects
// 		const formattedDate1 = new Date(row.from_date);
// 		const formattedDate2 = new Date(row.to_date);

// 		// Calculate the year difference
// 		const yearDifference = Math.abs(formattedDate1.getFullYear() - formattedDate2.getFullYear());

// 		// Round the result to one decimal place
// 		const roundedDifference = yearDifference.toFixed(1);

// 		row.total_experience = roundedDifference;
// 		console.log("year difference is ", row.total_experience)
// 		frm.refresh_field("internal_work_history")
// 	}

// }

function calculateTotal(frm, childTable, valueField, input) {
var totalAmount = 0;

if (!frm || !frm.doc || !frm.doc[childTable]) {
  console.error("Invalid form or child table data.");
  return NaN;
}

frm.doc[childTable].forEach((row) => {
  if (typeof row[input] === "number") {
    totalAmount += row[input];
  } else if (
    typeof row[input] === "string" &&
    !isNaN(parseFloat(row[input]))
  ) {
    totalAmount += parseFloat(row[input]);
  } else {
    console.error("Invalid input value in the child table:", row[input]);
  }
});

frm.set_value(valueField, totalAmount);
frm.refresh_field(valueField);

frm.refresh_field(valueField, totalAmount);
frm.set_value(valueField, totalAmount);
return parseFloat(totalAmount);
}
