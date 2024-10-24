frappe.ui.form.on("Employee", {
    fetch_the_todates: function (frm) {
        if (frm.doc.internal_work_history) {
            var rows = frm.doc.internal_work_history;
            for (let index = 0; index < rows.length; index++) {
                let currentItem = rows[index];
                let nextItem = rows[index + 1];

                if (nextItem) {
                    if (currentItem.from_date && !currentItem.to_date && nextItem.from_date) {
                        currentItem.to_date = frappe.datetime.add_days(nextItem.from_date, -1);
                    }
                    if (currentItem.from_date_ec && !currentItem.to_date_ec && nextItem.from_date_ec) {
                        // Manipulating the from_date_ec format
                        let dateParts = nextItem.from_date_ec.split('/');
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
                                month = month.toString().padStart(2, '0');
                                year = previousMonthDate.getFullYear();
                            }
                            let formattedDay = newDay.toString().padStart(2, '0');

                            // Reconstruct the date in the original format
                            currentItem.to_date_ec = `${formattedDay}/${month}/${year}`;
                        }

                        calculateDayInternal(frm)
                        refresh_field("internal_work_history");
                    }
                }
            }
            var dep;
            var des;
            var branch;
            var project;
            rows.map((item, index) => {
                if (item.department) {
                    dep = item.department
                }
                else {
                    item.department = dep;
                }

                if (item.designation) {
                    des = item.designation
                }
                else {
                    item.designation = des;
                }

                if (item.branch) {
                    branch = item.branch
                }
                else {
                    item.branch = branch;
                }

                if (item.project) {
                    project = item.project
                }
                else {
                    item.project = project;
                }
                console.log("dep", dep)
                console.log("des", des)
                console.log("branch", branch)
                console.log("project", project)
                refresh_field("internal_work_history");
            })

            refresh_field("internal_work_history");
        }

    },
});


frappe.ui.form.on("Employee", {
    date_sami: function (frm) {
        if (frm.doc.date_sami) {
            var date = convertDateTOGC(frm.doc.date_sami.toString());
            var dateObject = new Date(date);
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("malekia_ken", formattedDate);
            frm.refresh_field("malekia_ken")
        }
    },
},




);


frappe.ui.form.on("Employee", {
    date_of_birth_ec: function (frm, cdt, cdn) {
        if (frm.doc.date_of_birth_ec)
            // Convert Ethiopian date to Gregorian date
            var date = frm.doc.date_of_birth_ec;
        let dateParts = date.split('/');

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


        var retireDate = dayRetire + '/' + monthRetire + '/' + yearRetire;

        console.log("retire date", retireDate)

        // var finalgc = convertDateTOGC(frm.doc.date_of_birth_ec.toString());
        // var dateObj = new Date(finalgc);


        //         // Extract year, month, and date parts
        // 		var yeardd = dateObj.getFullYear();
        // 		var monthdd = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 to month as it starts from 0
        // 		var daddy = ('0' + dateObj.getDate()).slice(-2);

        // 		console.log("year month date", dateObj.getFullYear(), dateObj.getMonth(), dateObj.getFullYear())

        // 		// Format the date in DD-MM-YYYY
        // 		var formattedDate = daddy + '-' + monthdd + '-' + yeardd;
        // 		console.log("format date", formattedDate)

        // 		frm.doc.date_of_birth = formattedDate;
        // 		frm.set_value("date_of_birth", formattedDate)
        // 		frm.refresh_field("date_of_birth");

        frm.set_value('retirement_date', retireDate);
        refresh_field('retirement_date');

    },

    date_of_joining_ec: function (frm, cdt, cdn) {
        if (frm.doc.date_of_joining_ec) {
            var finalgc = convertDateTOGC(frm.doc.date_of_joining_ec.toString());
            var dateObj = new Date(finalgc);

            // Extract year, month, and date parts
            var year = dateObj.getFullYear();
            var month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 to month as it starts from 0
            var day = ('0' + dateObj.getDate()).slice(-2);

            console.log("year month date", dateObj.getFullYear(), dateObj.getMonth(), dateObj.getFullYear())

            // Format the date in DD-MM-YYYY
            var formattedDate = day + '-' + month + '-' + year;
            console.log("format date", formattedDate)

            frm.doc.date_of_joining = formattedDate;
            frm.set_value("date_of_joining", formattedDate)
            console.log("date of value", frm.doc.date_of_joining)
            frm.refresh_field("date_of_joining");
            console.log("date of value again", frm.doc.date_of_joining)
        }
    },

   

    releiving_date_ec: function (frm, cdt, cdn) {

        if (frm.doc.releiving_date_ec) {

            var finalgc = convertDateTOGC(frm.doc.releiving_date_ec.toString());
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'relieving_date', finalgc);
            refresh_field("relieving_date");
        }
    },
    // before_save: function(frm) {
    //     console.log("I am excuting this one before save")
    //    try{
    //     var date = convertDateTOGC(frm.selected_doc.from_date_ec.toString());
    //     console.log("the date before convert is ")
    //     var dateObject = new Date(date);
    //     var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
    //     frm.selected_doc.to_date = formattedDate;
    //     refresh_field("external_work_history");
    //    }catch(error){
    //     console.log("the error is ",error)
    //    }
        
    // }

});



frappe.ui.form.on("Employee Education", {

    year_of_finish_ec: function (frm, cdt, cdn) {

        if (frm.selected_doc.year_of_finish_ec) {

            var finalgc = convertDateTOGC(frm.selected_doc.year_of_finish_ec.toString());
            frm.selected_doc.graduating_year = finalgc;
            refresh_field("education");
        }

    },
});


frappe.ui.form.on("Child", {

    child_birth_date_ec: function (frm, cdt, cdn) {

        if (frm.selected_doc.child_birth_date_ec) {

            var finalgc = convertDateTOGC(frm.selected_doc.child_birth_date_ec.toString());
            frm.selected_doc.የልደት_ቀንና = finalgc;
            refresh_field("child");
        }

    },
});

// frappe.ui.form.on("Cannibalization request Form", {
//     schedule_date_ec: function(frm) {
//         if(frm.doc.schedule_date_ec){
//             var date = convertDateTOGC(frm.doc.schedule_date_ec.toString());
//             var dateObject = new Date(date);
//     // Format the date as a string in a desired format
//            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
//             frm.set_value("date", formattedDate);
//             frm.refresh_field("date")
//         }
//     },
// });

frappe.ui.form.on("Employee Internal Work History", {

    from_date_ec: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn]
        var date = convertDateTOGC(frm.selected_doc.from_date_ec.toString());
        var dateObject = new Date(date)
        row.from_date = dateObject.toISOString().slice(0, 10);
        refresh_field("internal_work_history");
        if (row.from_date_ec && row.to_date_ec) {
            console.log("Test 1 from")
            calculateDay(frm, cdt, cdn)
            calculateDayInternal(frm, cdt, cdn)
            refresh_field("internal_work_history");
        }
    },

    to_date_ec: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn]
        var date = convertDateTOGC(frm.selected_doc.to_date_ec.toString());
        var dateObject = new Date(date)
        row.to_date = dateObject.toISOString().slice(0, 10);
        refresh_field("internal_work_history");
        if (row.from_date_ec && row.to_date_ec) {
            console.log("Test 1 to")
            calculateDay(frm, cdt, cdn)
            calculateDayInternal(frm, cdt, cdn)
            refresh_field("internal_work_history");
        }
    }
});

 


frappe.ui.form.on("Employee External Work History", {

    from_date_ec: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

        if (row.from_date_ec) {

            var finalgc = convertDateTOGC(row.from_date_ec.toString());
            row.from_date = finalgc;
            calculateDay(frm, cdt, cdn)
            calculateDayExternal(frm, cdt, cdn)
            refresh_field("external_work_history");

        }
    },

    to_date_ec: async function (frm, cdt, cdn) {

        if (frm.selected_doc.to_date_ec && frm.selected_doc.from_date_ec) {

            var finalgc = convertDateTOGC(frm.selected_doc.to_date_ec.toString());
            frm.selected_doc.to_date = finalgc;
             calculateDay(frm, cdt, cdn)
             calculateDayExternal(frm, cdt, cdn)
             refresh_field("external_work_history");
        var date = convertDateTOGC(frm.selected_doc.from_date_ec.toString());
        console.log("the date before convert is ")
        var dateObject = new Date(date);
        var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
        frm.selected_doc.to_date = formattedDate;

        }
    },
   
});

function calculateDay(frm, cdt, cdn) {
    var row = locals[cdt][cdn];

    let fromDate = row.from_date_ec.split('/');
    let toDate = row.to_date_ec.split('/');

    let day_diff = parseFloat(toDate[0]) - parseFloat(fromDate[0]) + 1;
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
    while (day_diff >= 30 || month_diff > 12) {
        if (day_diff >= 30) {
            month_diff++; // Increment month by 1
            day_diff -= 30; // Reset days
        }
        if (month_diff > 12) {
            year_diff++; // Increment year by 1
            month_diff -= 12; // Reset months
        }
    }

    var finalDiff = year_diff + ' አመት ' + month_diff + ' ወር ' + day_diff + ' ቀን ';
    console.log("final diff", finalDiff);

    row.total_experience = finalDiff;
    refresh_field("internal_work_history");
}


function calculateDay(frm, cdt, cdn) {
    var row = locals[cdt][cdn];

    let fromDate = row.from_date_ec.split('/');
    let toDate = row.to_date_ec.split('/');

    let day_diff = parseFloat(toDate[0]) - parseFloat(fromDate[0]) + 1;
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
    while (day_diff >= 30 || month_diff > 12) {
        if (day_diff >= 30) {
            month_diff++; // Increment month by 1
            day_diff -= 30; // Reset days
        }
        if (month_diff > 12) {
            year_diff++; // Increment year by 1
            month_diff -= 12; // Reset months
        }
    }

    var finalDiff = year_diff + ' አመት ' + month_diff + ' ወር ' + day_diff + ' ቀን ';
    console.log("final diff", finalDiff);

    row.total_experience = finalDiff;
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
            let fromDates = item.from_date_ec.split('/');
            let toDates = item.to_date_ec.split('/');

            let day_diffs = parseFloat(toDates[0]) - parseFloat(fromDates[0]) + 1;
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
            while (day_diffs >= 30 || month_diffs > 12) {
                if (day_diffs >= 30) {
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

            // Loop until total day and month differences are within limits
            while (total_day_diff >= 30 || total_month_diff > 12) {
                if (total_day_diff >= 30) {
                    total_month_diff++; // Increment month by 1
                    total_day_diff -= 30; // Reset days
                }
                if (total_month_diff > 12) {
                    total_year_diff++; // Increment year by 1
                    total_month_diff -= 12; // Reset months
                }
            }

            var finalll = year_diffs + ' አመት ' + month_diffs + ' ወር ' + day_diffs + ' ቀን ';

            item.total_experience = finalll;
            frm.refresh_field("internal_work_history")
        }
    });

    // Loop until total day and month differences are within limits
    while (total_day_diff >= 30 || total_month_diff > 12) {
        if (total_day_diff > 30) {
            total_month_diff++; // Increment month by 1
            total_day_diff -= 30; // Reset days
        }
        if (total_month_diff > 12) {
            total_year_diff++; // Increment year by 1
            total_month_diff -= 12; // Reset months
        }
    }

    var finalDiffs = total_year_diff + ' አመት ' + total_month_diff + ' ወር ' + total_day_diff + ' ቀን ';
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
            let fromDates = item.from_date_ec.split('/');
            let toDates = item.to_date_ec.split('/');

            let day_diffs = parseFloat(toDates[0]) - parseFloat(fromDates[0]) + 1;
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
            while (day_diffs >= 30 || month_diffs > 12) {
                if (day_diffs >= 30) {
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
    });

    // Loop until total day and month differences are within limits
    while (total_day_diff >= 30 || total_month_diff > 12) {
        if (total_day_diff >= 30) {
            total_month_diff++; // Increment month by 1
            total_day_diff -= 30; // Reset days
        }
        if (total_month_diff > 12) {
            total_year_diff++; // Increment year by 1
            total_month_diff -= 12; // Reset months
        }
    }

    var finalDiffs = total_year_diff + ' አመት ' + total_month_diff + ' ወር ' + total_day_diff + ' ቀን ';
    console.log("total final diff", finalDiffs);

    frm.set_value("total_previous_experience", finalDiffs);
    refresh_field("total_previous_experience");
}


frappe.ui.form.on("Employee", {
    fetch_the_todates: function (frm, cdt, cdn) {
        var internal = frm.doc.total_current_experience;
        var external = frm.doc.total_previous_experience;
        console.log("internal", internal);
        console.log("external", external);

        var totalYears = 0;
        var totalMonths = 0;
        var totalDays = 0;

        if (internal !== null && external !== null) {
            if (internal) {
                var intDuration = internal.split(' ');
                var yearsInt = parseInt(intDuration[0]) || 0; // Extracting years
                var monthsInt = parseInt(intDuration[2]) || 0; // Extracting months
                var daysInt = parseInt(intDuration[4]) || 0; // Extracting days
                totalYears += yearsInt;
                totalMonths += monthsInt;
                totalDays += daysInt;
            }

            if (external) {
                var extDuration = external.split(' ');
                var yearsExt = parseInt(extDuration[0]) || 0; // Extracting years
                var monthsExt = parseInt(extDuration[2]) || 0; // Extracting months
                var daysExt = parseInt(extDuration[4]) || 0; // Extracting days
                totalYears += yearsExt;
                totalMonths += monthsExt;
                totalDays += daysExt;
            }

            // Convert extra days to months and extra months to years
            totalMonths += Math.floor(totalDays / 30);
            totalDays = totalDays % 30;
            totalYears += Math.floor(totalMonths / 12);
            totalMonths = totalMonths % 12;

            var finalDiffs = totalYears + ' አመት ' + totalMonths + ' ወር ' + totalDays + ' ቀን ';

            frm.set_value("grand_total_experience", finalDiffs);
            refresh_field("grand_total_experience");
        } else {
            // Set total to 0 when both internal and external are undefined
            frm.set_value("grand_total_experience", "0 አመት 0 ወር 0 ቀን ");
            refresh_field("grand_total_experience");
        }
    },
});





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
    var forBIrth = 0;

    $.each(frm.doc.medicine, function (index, row) {
        if (row.reason !== "የመነፅር" && row.reason !== "ለወሊድ") {
            console.log("wer are  inside")

            // if (row.from_government == "Yes") {
            used += row.asked;
            // row.amount_paid = row.asked;
            refresh_field("medicine")

            // } else {
            // 	used += row.asked * 0.8;
            // 	row.amount_paid = row.asked * 0.8;
            // 	refresh_field("medicine")
            // }
            if (used > parseFloat(12000) && row.reason !== "የስራ ላይ አደጋ") {
                frappe.model.clear_doc(row.doctype, row.name);
                refresh_field("medicine")
                allowSave = false;
                frappe.throw("Total amount paid exceeds 12000 and reason is not 'የስራ ላይ አደጋ'. Cannot save the document.");
                return false;  // exit the loop
            }

        } else {
            console.log("we are not inside")
            if (row.reason == "የመነፅር") {
                // if (row.from_government == "Yes") {
                forGlass += row.asked;
                // row.amount_paid = row.asked;
                refresh_field("medicine")

                // } else {
                // 	forGlass += row.asked * 0.8;
                // 	row.amount_paid = row.asked * 0.8;
                // 	refresh_field("medicine")
                // }

                if (forGlass > parseFloat(3000)) {
                    frappe.model.clear_doc(row.doctype, row.name);
                    refresh_field("medicine")
                    allowSave = false;
                    frappe.throw("Total amount paid for glass can not exceed 3000.");
                    return false;  // exit the loop
                }
            } else {
                if (row.reason == "ለወሊድ") {
                    // if (row.from_government == "Yes") {
                    forBIrth += row.asked;
                    // row.amount_paid = row.asked;
                    refresh_field("medicine")

                    // } else {
                    // 	forBIrth += row.asked * 0.8;
                    // 	row.amount_paid = row.asked * 0.8;
                    // 	refresh_field("medicine")
                    // }

                    if (forBIrth > parseFloat(3000)) {
                        frappe.model.clear_doc(row.doctype, row.name);
                        refresh_field("medicine")
                        allowSave = false;
                        frappe.throw("Total amount paid for glass can not exceed 3000.");
                        return false;  // exit the loop
                    }
                }
            }

        }
    });

    if (allowSave) {
        frm.set_value("used_medicine__from_12000", used);
        frm.set_value("total_birr_for_glass", forGlass);
        frm.set_value("total_birr_for_birth", forBIrth);
        frm.set_value("ramaining_from_12000", parseFloat(12000) - used);
        frm.refresh_field("sed_medicine__from_12000");
        frm.refresh_field("total_birr_for_glass");
        frm.refresh_field("ramaining_from_12000");
    }
}

function calculateMedicineTwo(frm, cdt, cdn) {
    var used = 0;

    $.each(frm.doc.medicine2, function (index, row) {

        // if (row.from_government == "Yes") {
        used += row.asked;
        // row.amount_paid = row.asked;
        refresh_field("medicine2")

        // } else {
        // 	used += row.asked * 0.8;
        // 	row.amount_paid = row.asked * 0.8;
        // 	refresh_field("medicine2")
        // }
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
            var tExperianceMessage = DurationMessage(tExperianceYear, tExperianceRemainMonth, tExperianceRemainDays);

            e.total_experience = tExperianceMessage;
            previousTotalDays += total_days_for_each_experiance;
            refresh_field("external_work_history");
        }

    });

    var previousMonth = CalMonthFromDays(previousTotalDays);
    var previousYear = CalYearFromMonth(previousMonth);
    var previousRemainDays = RemainDays(previousTotalDays);
    var previousRemainMonth = RemainMonths(previousMonth);
    var previousMessage = DurationMessage(previousYear, previousRemainMonth, previousRemainDays);
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
            var tExperianceMessage = DurationMessage(tExperianceYear, tExperianceRemainMonth, tExperianceRemainDays);

            e.total_experience = tExperianceMessage;
            currentTotalDays += total_days_for_each_experiance;
            refresh_field("external_work_history");
        }
    });

    var currentMonth = CalMonthFromDays(currentTotalDays);
    var currentYear = CalYearFromMonth(currentMonth);
    var currentRemainDays = RemainDays(currentTotalDays);
    var currentRemainMonth = RemainMonths(currentMonth);
    var currentMessage = DurationMessage(currentYear, currentRemainMonth, currentRemainDays);
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
        if (typeof row[input] === 'number') {
            totalAmount += row[input];
        } else if (typeof row[input] === 'string' && !isNaN(parseFloat(row[input]))) {
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




//codes related to wklina
//yewklina_date
//wklina_type 
// የ 45 ቀን
// የ 3 ወር
// የ 1 ዐመት
//wklina_end_date
//end_date_of_wklina


frappe.ui.form.on("Employee", {
    wklina_end_date: function (frm) {
        if (frm.doc.wklina_end_date) {
            var date = convertDateTOGC(frm.doc.wklina_end_date.toString());
            var dateObject = new Date(date);
            // Format the date as a string in a desired format
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("end_date_of_wklina", formattedDate);
            frm.refresh_field("end_date_of_wklina")
        }
    },
});
frappe.ui.form.on("Employee", {
    date_of_joining_ec: function (frm) {
        if (frm.doc.date_of_joining_ec) {
            var date = convertDateTOGC(frm.doc.date_of_joining_ec.toString());
            var dateObject = new Date(date);
            // Format the date as a string in a desired format
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            // frm.set_value("date_of_joiningg", formattedDate);
            //sfrm.refresh_field("date_of_joiningg")
        }
    },
});
frappe.ui.form.on("Employee", {
    date_of_birth_ec: function (frm) {
        if (frm.doc.date_of_birth_ec) {
            var date = convertDateTOGC(frm.doc.date_of_birth_ec.toString());
            var dateObject = new Date(date);
            // Format the date as a string in a desired format
            var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("date_of_birth", formattedDate);
            frm.refresh_field("date_of_birth")
        }
    },
});



// this code is salary matrix code 
frappe.ui.form.on('Employee', {
    grade: function (frm) {
        set_salary(frm);
    },
    scale: function (frm) {
        set_salary(frm);
    }
});

function set_salary(frm) {
    let grade = frm.doc.grade;
    let scale = frm.doc.scale;

    if (grade && scale) {
        let salary = get_salary(grade, scale);
        frm.set_value('salary', salary);
    }
}

function get_salary(grade, scale) {

    let salary_mapping = {
        '1': {
            'መነሻ': 1500, '1': 1632, '2': 1776, '3': 1932, '4': 2102, '5': 2278, '6': 2470, '7': 2687, '8': 2923, '9': 3137, 'ጣሪያ': 3404
        },
        '2': {
            'መነሻ': 1932, '1': 2102, '2': 2278, '3': 2470, '4': 2637, '5': 2923, '6': 3157, '7': 3404, '8': 3669, '9': 3955, 'ጣሪያ': 4248
        },
        '3': {
            'መነሻ': 2470, '1': 2707, '2': 2923, '3': 3157, '4': 3404, '5': 3669, '6': 3955, '7': 4248, '8': 4562, '9': 4900, 'ጣሪያ': 5233
        },
        '4': {
            'መነሻ': 3157, '1': 3404, '2': 3669, '3': 3955, '4': 4248, '5': 4562, '6': 4900, '7': 5233, '8': 5589, '9': 5969, 'ጣሪያ': 6351
        },
        '5': {
            'መነሻ': 3955, '1': 4248, '2': 4562, '3': 4900, '4': 5233, '5': 5589, '6': 5969, '7': 6351, '8': 6757, '9': 7190, 'ጣሪያ': 7621
        },
        '6': {
            'መነሻ': 4900, '1': 5233, '2': 5589, '3': 5969, '4': 6351, '5': 6757, '6': 7190, '7': 7621, '8': 8079, '9': 8563, 'ጣሪያ': 8992
        },
        '7': {
            'መነሻ': 5969, '1': 6351, '2': 6757, '3': 7190, '4': 7621, '5': 8079, '6': 8563, '7': 8992, '8': 9441, '9': 9913, 'ጣሪያ': 10359
        },
        '8': {
            'መነሻ': 7190, '1': 7621, '2': 8079, '3': 8563, '4': 8992, '5': 9441, '6': 9913, '7': 10359, '8': 10825, '9': 11313, 'ጣሪያ': 11765
        },
        '9': {
            'መነሻ': 8563, '1': 8992, '2': 9441, '3': 9913, '4': 10359, '5': 10825, '6': 11313, '7': 11765, '8': 12236, '9': 12725, 'ጣሪያ': 13183
        },
        '10': {
            'መነሻ': 9913, '1': 10359, '2': 10825, '3': 11313, '4': 11765, '5': 12236, '6': 12725, '7': 13183, '8': 13658, '9': 14150, 'ጣሪያ': 14574
        },
        '11': {
            'መነሻ': 11313, '1': 11765, '2': 12236, '3': 12725, '4': 13183, '5': 13658, '6': 14150, '7': 14574, '8': 15011, '9': 15462, 'ጣሪያ': 15894
        },
        '12': {
            'መነሻ': 12725, '1': 13183, '2': 13658, '3': 14150, '4': 14574, '5': 15011, '6': 15462, '7': 15894, '8': 16340, '9': 16797, 'ጣሪያ': 17200
        },
        '13': {
            'መነሻ': 14150, '1': 14574, '2': 15011, '3': 15462, '4': 15894, '5': 16340, '6': 16797, '7': 17200, '8': 17613, '9': 18036, 'ጣሪያ': 18450
        },
        '14': {
            'መነሻ': 15462, '1': 15894, '2': 16340, '3': 16797, '4': 17200, '5': 17613, '6': 18036, '7': 18450, '8': 18875, '9': 19309, 'ጣሪያ': 19734
        },
        '15': {
            'መነሻ': 16797, '1': 17200, '2': 17613, '3': 18036, '4': 18450, '5': 18875, '6': 19309, '7': 19734, '8': 20168, '9': 20612, 'ጣሪያ': 21044
        },
        '16': {
            'መነሻ': 18036, '1': 18450, '2': 18875, '3': 19309, '4': 19734, '5': 20168, '6': 20612, '7': 21044, '8': 21486, '9': 21938, 'ጣሪያ': 22376
        },
        '17': {
            'መነሻ': 19309, '1': 19734, '2': 20168, '3': 20612, '4': 21044, '5': 21486, '6': 21938, '7': 22376, '8': 22824, '9': 23280, 'ጣሪያ': 23746
        },
        '18': {
            'መነሻ': 20612, '1': 21044, '2': 21486, '3': 21938, '4': 22376, '5': 22824, '6': 23280, '7': 23746, '8': 24221, '9': 24705, 'ጣሪያ': 25199
        },
        '19': {
            'መነሻ': 21938, '1': 22376, '2': 22824, '3': 23280, '4': 23746, '5': 24221, '6': 24705, '7': 25199, '8': 25703, '9': 26217, 'ጣሪያ': 26742
        },
    };
    return salary_mapping[grade] ? salary_mapping[grade][scale] : 0;
}