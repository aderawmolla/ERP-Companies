frappe.ui.form.on("Leave Application", {
  requested_half_from_date:function(frm,cdt,cdn){
    var date = convertDateTOGC(frm.doc.requested_half_from_date.toString());
    var dateObject = new Date(date);
    var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
    frm.set_value("requested_half_to_gc", formattedDate);
    frm.refresh_field("requested_half_to_gc");
  },
  requested_half_to_date:function(frm,cdt,cdn){
    var date = convertDateTOGC(frm.doc.requested_half_to_date.toString());
    var dateObject = new Date(date);
    var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
    frm.set_value("requested__half_to_date", formattedDate);
    frm.refresh_field("requested__half_to_date");
  },

  requsted_from_date: function (frm, cdt, cdn) {
    var date = convertDateTOGC(frm.doc.requsted_from_date.toString());
    var dateObject = new Date(date);
    var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
    frm.set_value("requsted_from_date_gc", formattedDate);
    frm.refresh_field("requsted_from_date_gc");
  },
  requested_to_date: function (frm, cdt, cdn) {
    var date = convertDateTOGC(frm.doc.requested_to_date.toString());
    var dateObject = new Date(date);
    var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
    frm.set_value("requested_to_date_gc", formattedDate);
    frm.refresh_field("requested_to_date_gc");

  },

  from_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.from_date_ec) {
      var date = convertDateTOGC(frm.doc.from_date_ec.toString());
      var dateObject = new Date(date);
    var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
    frm.set_value("from_date", formattedDate);
    refresh_field("from_date");
      // calculateUniteRate(frm, cdt, cdn);
    }
  },
  to_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.to_date_ec) {
      var date = convertDateTOGC(frm.doc.to_date_ec.toString());
      var dateObject = new Date(date);
      var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
       frm.set_value("to_date", formattedDate)
      refresh_field("to_date");
      // calculateUniteRate(frm, cdt, cdn);
    }
  },
  half_start_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.half_start_date_ec) {
    var date = convertDateTOGC(frm.doc.half_start_date_ec.toString());
    var dateObject = new Date(date);
     var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
     frm.set_value("half_start_date_gc", formattedDate);
      refresh_field("half_start_date_gc");
      //frm.refresh_field("total_leave_days");
    }
  },
  half_end_date_ec: function (frm, cdt, cdn) {
    if (frm.doc.half_end_date_ec) {
      var date = convertDateTOGC(frm.doc.half_end_date_ec.toString());
      var dateObject = new Date(date);
       var formattedDate = dateObject.toISOString().slice(0, 10); // YYYY-MM-DD
       frm.set_value("half_end_date_gc", formattedDate);
       refresh_field("half_end_date_gc");
      //frm.refresh_field("total_leave_days");
    }
  },
});


// handle the changes 


frappe.ui.form.on("Leave Application",{
  requested_to_date_gc:function(frm,cdt,cdn){
    var days=getLeaves(frm.doc.requsted_from_date_gc,frm.doc.requested_to_date_gc)
     frm.set_value('requested_leaves',days)
     frm.refresh_field('requested_leaves')

  },
  requested__half_to_date:function(frm,cdt,cdn){
    var days=getLeaves(frm.doc.requested_half_to_gc,frm.doc.requested__half_to_date)
    frm.set_value('requested_leaves',(frm.doc.requested_leaves||0)+days/2)
    frm.refresh_field('requested_leaves')
  },
  
  to_date:function(frm,cdt,cdn){
    var days=getLeaves(frm.doc.from_date,frm.doc.to_date)
    frm.set_value('total_leave_days',days)
    frm.refresh_field('total_leave_days')
  },
  half_end_date_gc:function(frm,cdt,cdn){
    var days=getLeaves(frm.doc.half_start_date_gc,frm.doc.half_end_date_gc)
    frm.set_value('total_leave_days',(frm.doc.requested_leaves||0)+days/2)
    frm.refresh_field('total_leave_days')
  }


});

function getDaysBetweenDates(from_date, to_date) {
  const startDate = new Date(from_date);
  const endDate = new Date(to_date);
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = endDate - startDate;
  // Convert milliseconds to days (1 day = 86,400,000 milliseconds)
  return Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
}

function getLeaves(from_date, to_date) {
  const startDate = new Date(from_date);
  const endDate = new Date(to_date);
  let totalDays = getDaysBetweenDates(from_date, to_date);
  let weekendAdjustment = 0;

  // Loop through all the days in the range
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0) {
      // Sunday
      weekendAdjustment += 1;
    } else if (dayOfWeek === 6) {
      // Saturday
      weekendAdjustment += 0.5;
    }
  }

  // Subtract the weekend adjustment from the total days
  return totalDays - weekendAdjustment;
}