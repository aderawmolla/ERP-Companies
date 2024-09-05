
frappe.ui.form.on("Guarantee Record", {
    total_amount: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'guarantee_amount', (d.total_amount * d.percent * 0.01));
    }
});

frappe.ui.form.on("Guarantee Record", {
    percent: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];

        frappe.model.set_value(d.doctype, d.name, 'guarantee_amount', (d.total_amount * d.percent * 0.01));

    }
});

frappe.ui.form.on("Guarantee Record", {
    date_ec: function (frm, cdt, cdn) {
        if (frm.doc.date_ec) {

            var finalgc = convertDateTOGC(frm.doc.date_ec.toString());
            var dateObject = new Date(finalgc);
            // Format the date as a string in a desired format
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("date_gc", formattedDate);
            frm.refresh_field("date_gc")
            refresh_field("date_gc");

        }
    },
    date: function (frm, cdt, cdn) {
        if (frm.doc.date) {

            var finalgc = convertDateTOGC(frm.doc.date_ec.toString());
            var dateObject = new Date(finalgc);
            // Format the date as a string in a desired format
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("g_gc", formattedDate);
            frm.refresh_field("g_gc")
            refresh_field("g_gc");

        }
    },
    g_gc: function (frm, cdt, cdn) {
        if (frm.doc.g_gc) {

           
              // Example usage:
              const gregorianDateString = frm.doc.g_gc;
               console.log("gregorian string is",gregorianDateString)
              const ethiopianDate = gregorianToEthiopian(gregorianDateString.toString());
               
              console.log(`Gregorian date: ${gregorianDateString}`);
              console.log(`Ethiopian date: ${ethiopianDate}`);
              

        }
    },
});
function gregorianToEthiopian(day, month, year) {
    const ethiopianMonths = [0, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Ethiopian months and their lengths
  
    // Check if the Gregorian year is a leap year
    const isGregorianLeapYear = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
  
    // Calculate the Ethiopian year, month, and day
    let ethiopianYear = year + 8; // Ethiopian calendar is approximately 8 years behind
    let ethiopianMonth = month + 6; // Ethiopian calendar has 13 months
    let ethiopianDay = day + 8;
  
    if (ethiopianMonth > 13) {
      ethiopianMonth -= 13;
      ethiopianYear += 1;
    }
  
    if (isGregorianLeapYear(year) && month > 2) {
      ethiopianMonth += 1;
      if (ethiopianMonth > 13) {
        ethiopianMonth -= 13;
        ethiopianYear += 1;
      }
    }
  
    // Adjust Ethiopian day for days in a month
    const daysInMonth = ethiopianMonths[ethiopianMonth];
    if (ethiopianDay > daysInMonth) {
      ethiopianDay -= daysInMonth;
      ethiopianMonth += 1;
      if (ethiopianMonth > 13) {
        ethiopianMonth -= 13;
        ethiopianYear += 1;
      }
    }
  
    return { ethiopianYear, ethiopianMonth, ethiopianDay };
  }
  
  
  