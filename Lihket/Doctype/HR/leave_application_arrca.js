frappe.ui.form.on("Leave Application", {
  from_date: function (frm, cdt, cdn) {
    calculateUniteRate(frm, cdt, cdn);
  },
  to_date: function (frm, cdt, cdn) {
    calculateUniteRate(frm, cdt, cdn);
  },
  from_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.from_date_ec) {
      var finalgc = convertDateTOGC(frm.doc.from_date_ec.toString());
      frm.doc.from_date = finalgc;
      refresh_field("from_date");
      // calculateUniteRate(frm, cdt, cdn);
    }
  },
  to_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.to_date_ec) {
      var finalgc = convertDateTOGC(frm.doc.to_date_ec.toString());
      frm.doc.to_date = finalgc;
      refresh_field("to_date");
      // calculateUniteRate(frm, cdt, cdn);
    }
  },
  half_start_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.half_start_date_ec) {
      var finalgc = convertDateTOGC(frm.doc.half_start_date_ec.toString());
      frm.doc.half_start_date_gc = finalgc;
      refresh_field("half_start_date_gc");
      //frm.refresh_field("total_leave_days");
      halfDay(frm);
    }
  },
  half_end_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.half_end_date_ec) {
      var finalgc = convertDateTOGC(frm.doc.half_end_date_ec.toString());
      frm.doc.half_end_date_gc = finalgc;
      refresh_field("half_end_date_gc");
      //frm.refresh_field("total_leave_days");
      halfDay(frm);
    }
  },
});

function fullDay(frm) {
  var total_value = 0;
  var total_free_days = 0;
  var total_leave_days = 0;
  var total_days = 0;
  if (frm.doc.to_date && frm.doc.from_date) {
    var startDate = frappe.datetime.str_to_obj(frm.doc.from_date);
    var endDate = frappe.datetime.str_to_obj(frm.doc.to_date);
    calculateTotalDays(startDate, endDate, function (totalDays) {
      total_free_days = totalDays;
    });

    total_days = total_free_days - parseInt(frm.doc.total_holiday || 0);
    console.log("total_free_days  ", frm.doc.total_holiday);
    console.log("ftotal_value  ", total_free_days);

    frm.set_value("total_leave_days", total_days);
    frm.set_value("total_leave_day_hi", total_days);

    //frm.refresh_field('total_leave_days');
    console.log("total_value ", frm.doc.total_leave_days);
  }
}

function halfDay(frm) {
  var half_day_duration = 0;
  var number_of_days = 0;
  var Leave_day = frm.doc.total_leave_days;
  var total_value = 0;
  var holidays_value = 0;
  var total_free_days = 0;
  if (frm.doc.half_start_date_gc && frm.doc.half_end_date_gc) {
    // Extract the start and end dates

    var startDate = frappe.datetime.str_to_obj(frm.doc.half_start_date_gc);
    var endDate = frappe.datetime.str_to_obj(frm.doc.half_end_date_gc);

    if (endDate === startDate) {
      number_of_days = 0.5;
    } else {
      half_day_duration = frappe.datetime.get_diff(endDate, startDate);
      number_of_days += half_day_duration / 2;
    }

    console.log("days holder", frm.doc.total_leave_day_hi);
    console.log("total leave days before update", frm.doc.total_leave_days);
    // Fetch holidays and update total leave days
    get_holidays(
      frm.doc.employee,
      frm.doc.half_end_date_gc,
      frm.doc.half_start_date_gc,
      function (holidays) {
        console.log("days holidays", holidays);
        if (holidays !== null && holidays !== undefined) {
          // Update total leave days based on holidays
          holidays_value = holidays; // Subtract holidays from total leave days

          console.log(
            "Total leave days after deducting holidays",
            holidays_value
          );
        }
      }
    );
    //check holidays
    // number_of_days = flt(number_of_days) - flt(get_holidays( endDate, startDate))
    // number_of_days = flt(number_of_days) - holidays;
    // Update total_leave_days by adding the new calculated days divided by 2
    // total_value  = ( frm.doc.total_leave_day_hi || 0) + (number_of_days );
    //  frm.set_value('total_leave_days', total_value);
    //   frm.refresh_field('total_leave_days');
    //     console.log("total leave days after update", frm.doc.total_leave_days);

    // calculateTotalDays(startDate , endDate, function(totalDays) {

    // total_free_days =totalDays;
    //     // You can perform further actions here based on the total days
    // });

    calculateTotalhalfDays(startDate, endDate, function (totalDays) {
      total_free_days = totalDays;
      // You can perform further actions here based on the total days
    });
    total_value = (frm.doc.total_leave_day_hi || 0) + total_free_days;
    console.log(
      "frm.doc.total_leave_day_hi total ",
      frm.doc.total_leave_day_hi
    );
    console.log("frm.doc.total_leave_daystotal ", frm.doc.total_leave_days);

    frm.set_value("total_leave_days", roundToHalf(total_value));
    frm.refresh_field("total_leave_days");
    console.log("total leave days after update", frm.doc.total_leave_days);
    console.log("total leave days after update", total_free_days);
  }
}

function get_holidays(employee, from_date, to_date, callback) {
  if (employee && from_date && to_date) {
    frappe.call({
      method:
        "erpnext.hr.doctype.leave_application.leave_application.get_holidays2_days",
      args: {
        employee: employee,
        from_date: from_date,
        to_date: to_date,
      },
      callback: function (r) {
        if (r && r.message !== null && r.message !== undefined) {
          var holidays = r.message;
          console.log("days employee", holidays);
          callback(holidays);
        } else {
          console.log("Error fetching holidays");
          callback(null); // Notify callback about error
        }
      },
    });
  }
}

function calculateTotalDays(from_date, to_date, callback) {
  const fromDateObj = new Date(from_date);
  const toDateObj = new Date(to_date);

  let totalDays = 0;

  console.log("From Date:", fromDateObj);
  console.log("To Date:", toDateObj);

  while (fromDateObj <= toDateObj) {
    const dayOfWeek = fromDateObj.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

    // console.log('Current Date:', fromDateObj, 'Day of Week:', dayOfWeek);

    // Count days based on day of week
    if (dayOfWeek === 0) {
      // Sunday
      totalDays += 0;
    } else if (dayOfWeek === 6) {
      // Saturday
      totalDays += 0.5;
    } else {
      // Weekdays (Monday to Friday)
      totalDays += 1;
    }

    // Move to the next day
    fromDateObj.setDate(fromDateObj.getDate() + 1);
  }
  console.log("totalDays Date:", totalDays);
  callback(totalDays);
}
function calculateTotalhalfDays(from_date, to_date, callback) {
  const fromDateObj = new Date(from_date);
  const toDateObj = new Date(to_date);

  let totalDays = 0;
  let totalSun = 0;
  let totalValue = 0;
  console.log("From Date:", fromDateObj);
  console.log("To Date:", toDateObj);

  while (fromDateObj <= toDateObj) {
    const dayOfWeek = fromDateObj.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

    // console.log('Current Date:', fromDateObj, 'Day of Week:', dayOfWeek);

    // Count days based on day of week
    if (dayOfWeek === 0) {
      // Sunday
      totalSun += 0;
    } else if (dayOfWeek === 6) {
      // Saturday
      totalSun += 0.5;
    } else {
      // Weekdays (Monday to Friday)
      totalDays += 1;
    }

    // Move to the next day
    fromDateObj.setDate(fromDateObj.getDate() + 1);
  }

  totalValue = totalDays / 2 + totalSun;
  console.log("totalDays Date:", totalValue);
  callback(totalValue);
}

//round
function roundToHalf(number) {
  return Math.round(number * 2) / 2;
}

function calculateUniteRate(frm, cdt, cdn) {
  if (frm.doc.to_date && frm.doc.from_date) {
    console.log(frm.doc.to && frm.doc.from);

    frappe.call({
      method:
        "erpnext.hr.doctype.leave_application.leave_application.get_holidays",
      args: {
        from_date: frm.doc.from_date,
        to_date: frm.doc.to_date,
      },
      callback: function (r) {
        //if (r.message) {
        console.log(frm.doc.to + " error");
        //frappe.msgprint("Room updated successfully!");
        frm.set_value("total_holiday", r.message);
        //refresh_field("total_holiday");
        fullDay(frm);
        // } else {
        // frm.set_value("total_holiday", r.message);
        // refresh_field("total_holiday");
        //fullDay(frm);
        console.log("No holidays found for the given dates.");
        console.log(r.message);
        //frappe.msgprint("No holidays found for the given dates.");
        // }
      },
      error: function (error) {
        console.error("An error occurred: ", error);
        // frappe.msgprint("An error occurred while fetching holidays.");
      },
    });
  }
}
