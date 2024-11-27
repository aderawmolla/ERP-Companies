//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

//fetch the list of task fields
cur_frm.add_fetch('activity', 'quantity', 'quantity');
cur_frm.add_fetch('activity', 'quantity', 'actual_quantity');
cur_frm.add_fetch('activity', 'quantity', 'remaining_planned_qty');
cur_frm.add_fetch('activity', 'direct_cost_after_conversion', 'rate');
cur_frm.add_fetch('activity', 'unit', 'uom');
cur_frm.add_fetch('activity', 'subject', 'activity_name');
cur_frm.add_fetch('activity', 'productivity', 'productivity');
cur_frm.add_fetch('activity', 'item_no', 'item_no');

//fetch the qquipment fields
cur_frm.add_fetch('id_mac', 'type', 'type');
cur_frm.add_fetch('id_mac', 'rental_rate', 'rental_rate');
cur_frm.add_fetch('id_mac', 'mc_number', 'uf');


// this is the code related to task sequencing and critical path by AD after ARRCA
cur_frm.add_fetch('activity', 'quantity', 'planned');
cur_frm.add_fetch('activity', 'subject', 'act_name');
cur_frm.add_fetch('activity', 'duration_in_days', 'duration');

frappe.ui.form.on('Operational Plan', {
	onload: function(frm) {
		console.log("abe", frm.doc.no)
		if (!frm.doc.no) {
			addRowToCPT(frm);

		}
	}
});

function addRowToCPT(frm, cdt, cdn) {
	console.log(frm.doc.no)
	var no = frm.doc.no;
	frm.clear_table("no");

	frm.set_value("no", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "No of working days", "no");
	tableRow1.sep = 30;
	tableRow1.oct = 30;
	tableRow1.nov = 30;
	tableRow1.dec = 30;
	tableRow1.jan = 30;
	tableRow1.feb = 30;
	tableRow1.mar = 30;
	tableRow1.apr = 30;
	tableRow1.may = 30;
	tableRow1.jun = 30;
	tableRow1.july = 30;
	tableRow1.aug = 30;

	console.log("table row", tableRow1)
	refresh_field("no");

}


var month_totals = {};


// Calfulate total Holidayss
frappe.ui.form.on('Holidayss', {
	from_date: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		console.log("child", child)
		if (child.from_date && child.to_date) {
			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var day_diff = end_date.getDate() - start_date.getDate() + 1;
			child.total = Math.ceil(day_diff);

			var month_number = start_date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
			child.month = month_number;
			console.log("month", child.month)



			frm.refresh_field("holiday")
		}


	},
	to_date: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		console.log("child", child)
		if (child.from_date && child.to_date) {

			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var day_diff = end_date.getDate() - start_date.getDate() + 1;


			var month_number = start_date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
			var month_number2 = end_date.getMonth() + 1;
			child.month = month_number;
			console.log("month number 1", month_number)
			console.log("month number 2", month_number2)


			if (month_number == month_number2) {
				child.total = Math.ceil(day_diff);
				if (month_totals[child.month]) {
					month_totals[child.month] += child.total;
				} else {
					month_totals[child.month] = child.total;
				}

				console.log("month", month_totals)
				console.log("no", frm.doc.no)

				frm.doc.no[0].sep = 30 - (month_totals[9] || 0);  // September
				frm.doc.no[0].oct = 30 - (month_totals[10] || 0); // October
				frm.doc.no[0].nov = 30 - (month_totals[11] || 0); // November
				frm.doc.no[0].dec = 30 - (month_totals[12] || 0); // December
				frm.doc.no[0].jan = 30 - (month_totals[1] || 0);  // January
				frm.doc.no[0].feb = 30 - (month_totals[2] || 0);  // February
				frm.doc.no[0].mar = 30 - (month_totals[3] || 0);  // March
				frm.doc.no[0].apr = 30 - (month_totals[4] || 0);  // April
				frm.doc.no[0].may = 30 - (month_totals[5] || 0);  // May
				frm.doc.no[0].jun = 30 - (month_totals[6] || 0);  // June
				frm.doc.no[0].july = 30 - (month_totals[7] || 0); // July
				frm.doc.no[0].aug = 30 - (month_totals[8] || 0);  // August

				frm.refresh_field("no")
				console.log("sth", frm.doc.no[0])

				frm.refresh_field("holiday")


			} else {
				frappe.show_alert("The month of the from date and the to date should be the same. Otherwise use additonal rows to add separetely")
				child.to_date = null;
				frm.refresh_field("holiday")

			}

		}
	}
});

frappe.ui.form.on("Holidayss", {


    from_date_ec: function(frm,cdt,cdn) {
        console.log("I am touched")
        var child=locals[cdt][cdn]
        if (child.from_date_ec) {
            // Update fields for GC date and calculate duration
        let date = convertDateTOGC(child.from_date_ec.toString());
        let dateObject = new Date(date);
         console.log("why not a")
        // Format the date as a string in YYYY-MM-DD format
        let formattedDate = dateObject.toISOString().slice(0, 10);
        child.from_date=formattedDate
        frm.refresh_field("holiday");
        }
    },
    to_date_ec: function(frm,cdt,cdn) {
        console.log("I am  touched from todate")
        var child=locals[cdt][cdn]
        if (child.to_date_ec) {
            // Update fields for GC date and calculate duration
        let date = convertDateTOGC(child.to_date_ec.toString());
        let dateObject = new Date(date);
        
        // Format the date as a string in YYYY-MM-DD format
        let formattedDate = dateObject.toISOString().slice(0, 10);
        child.to_date=formattedDate
        frm.refresh_field("holiday");
        }
    }
});
frappe.ui.form.on('Operational Plan Detail', {
	planned: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("duration", frm.doc.duration_in_days)
		if (row.planned > row.quantity) {
			row.planned = null;
			frappe.show_alert("Please select lower amount of quantity. It can not be done with the specidied day duration!")
		} else if (row.duration > frm.doc.duration_in_days) {
			console.log("i am hereeee")
			row.planned = null;
			frappe.show_alert("Please select lower amount of quantity. It can not be done with the specidied operational task duration!")
		}
		else {
			row.planned_day = row.duration;
			console.log("ppppppppppppppp", row.planned_day, row.planned_day)
			frm.refresh_field("task_list");
			// AutoPopulate(frm, cdt, cdn);
		}
		frm.refresh_field("task_list")
	},
	activity:function(frm,cdt,cdn){
	   AutoPopulate(frm, cdt, cdn);
	   frm.refresh_field("task_list");


	}
	
});
frappe.ui.form.on('Operational Plan', {
    get_critical_path: function(frm) {

        const dependency = frm.doc.activity_sequencing;
        let nodes = {};

        if (dependency && frm.doc.start_date_of_first_task) {
            // Step 1: Initialize nodes with start and end dates based on dependencies
            dependency.forEach(task => {
                const duration = task.duration || 0;

                if (!nodes[task.activity]) {
                    if (!task.predecessor_activity) {
                        nodes[task.activity] = {
                            es: [frm.doc.start_date_of_first_task],
                            ef: [frappe.datetime.add_days(frm.doc.start_date_of_first_task, duration)],
                            ls: [],
                            lf: []
                        };
                    } else {
                        nodes[task.activity] = { es: [], ef: [], ls: [], lf: [] };
                        let predecessorEf = nodes[task.predecessor_activity]?.ef?.slice(-1)[0];

                        if (task.relationship_type === "Finish to Start" && predecessorEf) {
                            nodes[task.activity]["es"].push(
                                frappe.datetime.add_days(predecessorEf, task.lag_days - task.lead_days)
                            );
                            nodes[task.activity]["ef"].push(
                                frappe.datetime.add_days(nodes[task.activity]["es"][0], duration)
                            );
                        }
                    }
                } else {
                    if (task.relationship_type === "Finish to Start") {
                        let predecessorEf = nodes[task.predecessor_activity]?.ef?.slice(-1)[0];
                        nodes[task.activity]["es"].push(
                            frappe.datetime.add_days(predecessorEf, task.lag_days - task.lead_days)
                        );
                        nodes[task.activity]["ef"].push(
                            frappe.datetime.add_days(nodes[task.activity]["es"].slice(-1)[0], duration)
                        );
                    }
                }
            });

            // Step 2: Calculate all possible paths and track their durations
            let paths = [];
            const traversePaths = (activity, currentPath, totalDuration) => {
                const activityStart = nodes[activity].es[0];
                const activityFinish = nodes[activity].ef[0];
                const activityDuration = activityFinish && activityStart ? 
                    frappe.datetime.get_diff(activityFinish, activityStart) : 0;

                currentPath.push({ activity, duration: activityDuration });
                totalDuration += activityDuration;

                if (!dependency.some(task => task.predecessor_activity === activity)) {
                    paths.push({
                        path: currentPath.map(item => `${item.activity} (${item.duration} days)`).join(" ............... "),
                        duration: totalDuration
                    });
                } else {
                    dependency
                        .filter(task => task.predecessor_activity === activity)
                        .forEach(task => traversePaths(task.activity, [...currentPath], totalDuration));
                }
            };

            traversePaths(dependency[0].activity, [], 0);

            frm.set_value(
                "all_paths",
                paths.map((p, index) => `Path${index + 1}:\n${p.path} (Total: ${p.duration} days)`).join("\n\n")
            );
            frm.refresh_field("all_paths");

            // Step 3: Identify Critical Path
            let criticalPath = paths.reduce((max, path) => (path.duration > max.duration ? path : max), paths[0]);
            frm.set_value("tasks_on_the_critical_path", criticalPath.path);
            frm.set_value("critical_path_duration_in_days", criticalPath.duration);

            // Step 4: Calculate LS and LF for all tasks (Backward Pass)
            let latestFinishDate = frappe.datetime.add_days(frm.doc.start_date_of_first_task, criticalPath.duration);
            let criticalActivities = criticalPath.path.split(" ............... ").map(item => item.split(" (")[0]);

            // Backward pass for tasks on the critical path
            criticalActivities.reverse().forEach(activity => {
                let node = nodes[activity];
                node.lf = [latestFinishDate];
                node.ls = [frappe.datetime.add_days(latestFinishDate, -frappe.datetime.get_diff(node.ef[0], node.es[0]))];
                latestFinishDate = node.ls[0];
            });

            // Backward pass for non-critical path tasks
            dependency.reverse().forEach(task => {
                if (!nodes[task.activity].lf.length) {
                    let successors = dependency.filter(dep => dep.predecessor_activity === task.activity);
                    if (successors.length > 0) {
                        nodes[task.activity].lf = [Math.min(...successors.map(s => nodes[s.activity].ls[0]))];
                        nodes[task.activity].ls = [
                            frappe.datetime.add_days(nodes[task.activity].lf[0], -frappe.datetime.get_diff(nodes[task.activity].ef[0], nodes[task.activity].es[0]))
                        ];
                    }
                }
            });

            // Step 5: Populate critical_path_table
            frm.clear_table("critical_path_table");

            Object.keys(nodes).forEach(activity => {
                let task = nodes[activity];
                let tableRow = frm.add_child("critical_path_table");
                tableRow.activity = activity;
                tableRow.es = task.es[0];
                tableRow.ef = task.ef[0];
                tableRow.ls = task.ls[0];
                tableRow.lf = task.lf[0];
            });

            frm.refresh_field("critical_path_table");
            frm.refresh_field("tasks_on_the_critical_path");
            frm.refresh_field("critical_path_duration_in_days");

            console.log("All Paths with Durations", paths);
            console.log("Critical Path", criticalPath);
        } else {
            frappe.show_alert("Please select a list of activities first.");
        }
    }
});

// Function to get holidays from Operational Plan
function getHolidaysFromOperationalPlan(frm) {
    const holidays = frm.doc.holiday || []; // Assuming holiday list is linked to the operational plan
    return holidays;
}

// Function to distribute planned quantity for the first table (first half of the year)
// Function to distribute planned quantity for the first table (September to February period)
function AutoCalculateMonthValueOne(frm, child, planned, productivity, earlyStart, holidays) {
    console.log("AutoCalculateMonthValueOne function called");
    let remainingPlanned = planned;
    const workingHoursPerDay = 8;
    const daysProductivity = productivity * workingHoursPerDay;
	const workingDaysByMonth = getWorkingDaysFromDoc(frm) || {}; // Default to empty object if undefined

    // Months in the first half of the assignment period
    const months = ["sep", "oct", "nov", "dec", "jan", "feb"];
    
    // Determine if there's a year transition based on earlyStart month
    const startDate = new Date(earlyStart);
    const startMonth = startDate.getMonth(); // 0 for Jan, 8 for Sep, etc.
    const startYear = startDate.getFullYear();

    // Check if startMonth is September (8) or later, to decide on year transition
    const firstHalfYear = startYear;
    const secondHalfYear = (startMonth >= 8) ? startYear + 1 : startYear;

    months.forEach((month, index) => {
        const monthField = `m_${index + 1}`;
        
        // Assign year based on month position
        const currentYear = (["sep", "oct", "nov", "dec"].includes(month)) ? firstHalfYear : secondHalfYear;

        const workingDays = calculateWorkingDaysForMonth(
            workingDaysByMonth[month] || 0,
            holidays,
            earlyStart,
            month,
            currentYear  // Pass the dynamically calculated year
        );

        const monthlyAllocation = daysProductivity * workingDays;

        // Distribute based on remaining planned quantity
        const allocatedPlanned = Math.min(remainingPlanned, monthlyAllocation);
        child[monthField] = allocatedPlanned;

        console.log(`Remaining planned after ${month} ${currentYear}:`, remainingPlanned); // Log remaining quantity each month
        remainingPlanned -= allocatedPlanned;
    });

    child.planned = planned - remainingPlanned;
    frm.refresh_field("operational_plan_detail_one1");

    return Math.max(remainingPlanned, 0);
}

// Function to distribute planned quantity for the second table (March to August period)
function AutoCalculateMonthValueTwo(frm, child, remainingPlanned, productivity, earlyStart, holidays) {
    console.log("AutoCalculateMonthValueTwo function called for operational_plan_detail_two");
    const workingHoursPerDay = 8;
    const daysProductivity = productivity * workingHoursPerDay;
    child.planned = remainingPlanned;
	const workingDaysByMonth = getWorkingDaysFromDoc(frm) || {}; // Default to empty object if undefined

    const months = ["mar", "apr", "may", "jun", "jul", "aug"];
    
    const startDate = new Date(earlyStart);
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();

    // Determine the assignment year for the second half of the period (March-August)
    const secondHalfYear = (startMonth >= 8) ? startYear + 1 : startYear;

    months.forEach((month, index) => {
        const monthField = `m_${index + 7}`;

        const workingDays = calculateWorkingDaysForMonth(
			workingDaysByMonth[month] || 0,
            holidays,
            earlyStart,
            month,
            secondHalfYear  // Pass the dynamically calculated year for second half
        );

        const monthlyAllocation = daysProductivity * workingDays;

        // Distribute based on remaining planned quantity
        const allocatedPlanned = Math.min(remainingPlanned, monthlyAllocation);
        console.log(`Allocating ${allocatedPlanned} to ${monthField} for ${month} ${secondHalfYear}`);
        child[monthField] = allocatedPlanned;

        remainingPlanned -= allocatedPlanned;
    });

    frm.refresh_field("operational_plan_detail_two2");

    return Math.max(remainingPlanned, 0);
}


function calculateWorkingDaysForMonth(workingDays, holidays, earlyStart, month, year) {
    let adjustedWorkingDays = workingDays; // Start with the initial working days in the month
    console.log("________________________________");
    console.log("Month", month);
    console.log("Adjusted working days", adjustedWorkingDays);
    console.log("Early start", earlyStart);
    console.log("Holidays", holidays);

    // Mapping of abbreviated month names to month indices (0-indexed)
    const monthAbbreviations = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
    };

    // Retrieve the month index from the abbreviation
    let monthIndex = monthAbbreviations[month.toLowerCase()];

    if (monthIndex === undefined) {
        console.log("Invalid month abbreviation:", month);
        return;
    } else {
        console.log("Date month", monthIndex); // Corrected to output the month index
    }

    // Parse the early start date to get the start month and year
    const earlyStartDate = new Date(earlyStart);
    const startMonth = earlyStartDate.getMonth(); // 0-indexed month of earlyStart
    const startYear = earlyStartDate.getFullYear(); // Full year from earlyStart

    console.log("Early start year:", startYear);
    console.log("Early start month:", startMonth + 1); // Log the month in 1-indexed format

    // Skip months before the earlyStart month in the same year, or in a previous year
    if (year < startYear || (year === startYear && monthIndex < startMonth)) {
        console.log(`Skipping month: ${month} of ${year} because it's before the earlyStart month and year.`);
        adjustedWorkingDays = 0;  // Set to 0 for months before earlyStart
    }

    // Adjust working days based on early start and holidays
    if (year > startYear || (year === startYear && monthIndex >= startMonth)) {
        console.log("Processing for month:", month, "of year:", year);

        // For months where the early start is inside the same month and year
        if (monthIndex === startMonth && year === startYear) {
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            const remainingDays = daysInMonth - earlyStartDate.getDate() + 1;  // Remaining days from earlyStart onward
            adjustedWorkingDays = remainingDays; // Adjust to the working days remaining in the month
            console.log(`Adjusting for early start in the month: ${month}`);
            console.log(`Remaining working days: ${adjustedWorkingDays}`);
        }

        // Subtract holidays from working days by checking if any holiday range overlaps with the month and year
        // holidays.forEach(holiday => {
        //     // Parse the from_date and to_date of the holiday range
        //     const holidayFromDate = new Date(holiday.from_date);
        //     const holidayToDate = new Date(holiday.to_date);
            
        //     // Check if the holiday range falls within the target year and month
        //     if ((holidayFromDate.getFullYear() === year || holidayToDate.getFullYear() === year)) {
        //         // Check if the holiday is within the same month and year as the current month
        //         let currentHolidayDate = new Date(holidayFromDate);
        //         while (currentHolidayDate <= holidayToDate) {
        //             if (currentHolidayDate.getFullYear() === year && currentHolidayDate.getMonth() === monthIndex) {
        //                 adjustedWorkingDays--; // Subtract one day for each day in the holiday range within the month
        //                 console.log("Holiday from", holiday.from_date, "to", holiday.to_date, "subtracting 1 day");
        //             }
        //             // Move to the next day in the range
        //             currentHolidayDate.setDate(currentHolidayDate.getDate() + 1);
        //         }
        //     }
        // });
    }

    console.log("Adjusted working days for", month, "of year", year, ":", adjustedWorkingDays);
    console.log("________________________________");

    return adjustedWorkingDays;
}


// Function to access working days directly from the linked field in frm.doc.no
function getWorkingDaysFromDoc(frm) {
    console.log("the document before accessed is ", frm.doc.no);

    // Check if frm.doc.no exists and is an array or object
    if (!frm.doc.no || !Array.isArray(frm.doc.no) || frm.doc.no.length === 0) {
        console.warn("No working days found. Returning default values.");
        return {
            sep: 0,
            oct: 0,
            nov: 0,
            dec: 0,
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            july: 0,
            aug: 0
        };
    }

    // Access the first element if it exists
    const workingDays = frm.doc.no[0] || {};

    return {
        sep: workingDays.sep || 0,
        oct: workingDays.oct || 0,
        nov: workingDays.nov || 0,
        dec: workingDays.dec || 0,
        jan: workingDays.jan || 0,
        feb: workingDays.feb || 0,
        mar: workingDays.mar || 0,
        apr: workingDays.apr || 0,
        may: workingDays.may || 0,
        jun: workingDays.jun || 0,
        july: workingDays.july || 0,
        aug: workingDays.aug || 0
    };
}

//trigger on row deletion
frappe.ui.form.on('Operational Plan Detail', {
	task_list_before_remove: function(frm, cdt, cdn) {
		console.log("frm", frm)
		console.log("cdt", cdt)
		console.log("cdn", cdn)

		console.log('row remove is here sami. Awo eyesera new ende');
		var row = locals[cdt][cdn];
		console.log("removed row", row)
	}
})

frappe.ui.form.on('Operational Plan Detail One1', {
	m_1: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_1")
	},
	m_2: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_2")
	},
	m_3: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_3")
	},
	m_4: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_4")
	},
	m_5: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_5")
	},
	m_6: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_6")
	},
})

frappe.ui.form.on('Operational Plan Detail Two2', {
	m_7: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_7")
	},
	m_8: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_8")
	},
	m_9: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_9")
	},
	m_10: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_10")
	},
	m_11: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_11")
	},
	m_12: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_12")
	},
})

function prohobitUpperSum1(frm, cdt, cdn, month) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("localssss for each month", row);

	// Calculate the total
	total += row.m_1 ? parseFloat(row.m_1) : 0;
	total += row.m_2 ? parseFloat(row.m_2) : 0;
	total += row.m_3 ? parseFloat(row.m_3) : 0;
	total += row.m_4 ? parseFloat(row.m_4) : 0;
	total += row.m_5 ? parseFloat(row.m_5) : 0;
	total += row.m_6 ? parseFloat(row.m_6) : 0;

	console.log("total sum", total);

	if(total > row.planned){
		row[month] = null;
		frm.refresh_field("operational_plan_detail_one1")
		frappe.show_alert("Each month sum should be lower than the planned")
	}
}

function prohobitUpperSum2(frm, cdt, cdn, month) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("localssss for each month", row);

	// Calculate the total
	total += row.m_7 ? parseFloat(row.m_7) : 0;
	total += row.m_8 ? parseFloat(row.m_8) : 0;
	total += row.m_9 ? parseFloat(row.m_9) : 0;
	total += row.m_10 ? parseFloat(row.m_10) : 0;
	total += row.m_11 ? parseFloat(row.m_11) : 0;
	total += row.m_12 ? parseFloat(row.m_12) : 0;

	console.log("total sum", total);

	if(total > row.planned){
		row[month] = null;
		frm.refresh_field("operational_plan_detail_two2")
		frappe.show_alert("Each month sum should be lower than the planned")
	}
}

frappe.ui.form.on('Operational Plan Detail', {
	before_task_list_remove: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var removed_activity = row.activity;
		console.log("removed task id", removed_activity);

		var operational_plan_detail_one1 = frm.doc.operational_plan_detail_one1;
		var operational_plan_detail_two2 = frm.doc.operational_plan_detail_two2

		deleteRow(frm, removed_activity, "operational_plan_detail_one1");
		deleteRow(frm, removed_activity, "operational_plan_detail_two2");

		deleteRow(frm, removed_activity, "machinery");
		deleteRow(frm, removed_activity, "manpower1");
		deleteRow(frm, removed_activity, "material1");



	}
});

function deleteRow(frm, removed_activity, childTable) {
	var table = frm.doc[childTable];
	for (var i = 0; i < table.length; i++) {
		if (table[i].activity === removed_activity) {
			// Remove the row from the child table
			console.log("removed")
			table.splice(i, 1);
			// Update the form
			frm.refresh_field(childTable);
		}
	}
}





//auto assign the start and end date table for the monthly plan use
frappe.ui.form.on("Operational Plan", {
	end_date: function(frm, cdt, cdn) {
		if (frm.doc.start_date && frm.doc.end_date) {
			frm.doc.operational_plan_months_date_data = [];
			var start_date = frm.doc.start_date;
			var end_date = frm.doc.end_date;

			// Loop through months
			for (var i = 0; i < 12; i++) {
				var row = frm.add_child("operational_plan_months_date_data")
				row.month_no = i + 1;
				if (i == 0) {
					console.log("first try")
					row.start_date = start_date;
					row.end_date = frappe.datetime.add_days(row.start_date, 29);

				} else {
					console.log("not first try")
					row.start_date = frappe.datetime.add_days(frm.doc.operational_plan_months_date_data[i - 1].end_date, 1);
					row.end_date = frappe.datetime.add_days(row.start_date, 29);

				}


				console.log("start date for month " + i + " is " + row.start_date);
				console.log("end date for month " + i + " is " + row.end_date);

				// Check if end date is in the past
				if (row.end_date > end_date) {
					console.log("now exited")
					row.end_date = end_date;
					break;
				}

			}
			console.log("operational_plan_months_date_data", frm.doc.operational_plan_months_date_data)

			frm.refresh_field("operational_plan_months_date_data"); // Move this line out of the loop
		}
	}

});

//calculation operatioanl plan detail table
frappe.ui.form.on('Operational Plan Detail', {
	to_date_executed: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("rowwws", row)
		row.remaining_planned_qty = (row.actual_quantity || 0) - (row.to_date_executed || 0);
		frm.refresh_field("task_list")
	}
});

//preventing assigning  a planed quantity which is greter than the remining
frappe.ui.form.on('Operational Plan Detail', {
	planned: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("rowwws", row)
		if (row.planned > row.remaining_planned_qty) {
			row.planned = null;
			frappe.show_alert("The palnned quantity shluld be less than the remaining!")
		}
		frm.refresh_field("task_list")
	}
});




//calculate the machinery plan fro the detail one
frappe.ui.form.on('Operational Plan Detail One1', {
	m_1: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "1");
		calculateMaterialValues(frm, cdt, cdn, "1");
		calculateManpowerValues(frm, cdt, cdn, "1");
	},
	m_2: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "2");
		calculateMaterialValues(frm, cdt, cdn, "2");
		calculateManpowerValues(frm, cdt, cdn, "2");
	},
	m_3: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "3");
		calculateMaterialValues(frm, cdt, cdn, "3");
		calculateManpowerValues(frm, cdt, cdn, "3");
	},
	m_4: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "4");
		calculateMaterialValues(frm, cdt, cdn, "4");
		calculateManpowerValues(frm, cdt, cdn, "4");
	},
	m_5: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "5");
		calculateMaterialValues(frm, cdt, cdn, "5");
		calculateManpowerValues(frm, cdt, cdn, "5");
	},
	m_6: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "6");
		calculateMaterialValues(frm, cdt, cdn, "6");
		calculateManpowerValues(frm, cdt, cdn, "6");
	},
});

frappe.ui.form.on('Operational Plan Detail Two2', {
	m_7: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "7");
		calculateMaterialValuesB(frm, cdt, cdn, "7");
		calculateManpowerValuesB(frm, cdt, cdn, "7");
	},
	m_8: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "8");
		calculateMaterialValuesB(frm, cdt, cdn, "8");
		calculateManpowerValuesB(frm, cdt, cdn, "8");
	},
	m_9: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "9");
		calculateMaterialValuesB(frm, cdt, cdn, "9");
		calculateManpowerValuesB(frm, cdt, cdn, "9");
	},
	m_10: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "10");
		calculateMaterialValuesB(frm, cdt, cdn, "10");
		calculateManpowerValuesB(frm, cdt, cdn, "10");
	},
	m_11: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "11");
		calculateMaterialValuesB(frm, cdt, cdn, "11");
		calculateManpowerValuesB(frm, cdt, cdn, "11");
	},
	m_12: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "12");
		calculateMaterialValuesB(frm, cdt, cdn, "12");
		calculateManpowerValuesB(frm, cdt, cdn, "12");
	},
});

function calculateMaterialValues(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};

	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one1.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one1[j];
			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}
	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_a[i];
		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {
			currentItem["op_m_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_m_m" + m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_a");
}
function calculateMaterialValuesB(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};

	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two2[j];
			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}
	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_b[i];
		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {
			currentItem["op_m_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_m_m" + m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_b");
}

function calculateManpowerValues(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one1.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one1[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		}
	}
	console.log("manpoere aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_a[i];
		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			currentItem["op_mp_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_mp_m" + m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_a");
}
function calculateManpowerValuesB(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two2[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		}
	}
	console.log("manpoere aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_b[i];
		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			currentItem["op_mp_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_mp_m" + m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_b");
}

function calculateMachineryValues(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};

	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one1.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one1[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData["m_" + m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		}
	}
	console.log("AGGRICAGE", machineryAggregatedValues)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_a[i];
		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			currentItem["op_e_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_e_m" + m] = 0; // or handle the case where there is no aggregated value for the type
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_a");
}
function calculateMachineryValuesB(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};

	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two2[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData["m_" + m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		}
	}
	console.log("AGGRICAGE", machineryAggregatedValues)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_b[i];
		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			currentItem["op_e_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_e_m" + m] = 0; // or handle the case where there is no aggregated value for the type
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_b");
}



// frappe.ui.form.on('Operational Plan Detail Two2', {
// 	m_7: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "7");
// 		calculateMaterialValuesB(frm, cdt, cdn, "7");
// 		calculateManpowerValuesB(frm, cdt, cdn, "7");
// 	},
// 	m_8: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "8");
// 		calculateMaterialValuesB(frm, cdt, cdn, "8");
// 		calculateManpowerValuesB(frm, cdt, cdn, "8");
// 	},
// 	m_9: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "9");
// 		calculateMaterialValuesB(frm, cdt, cdn, "9");
// 		calculateManpowerValuesB(frm, cdt, cdn, "9");
// 	},
// 	m_10: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "10");
// 		calculateMaterialValuesB(frm, cdt, cdn, "10");
// 		calculateManpowerValuesB(frm, cdt, cdn, "10");
// 	},
// 	m_11: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "11");
// 		calculateMaterialValuesB(frm, cdt, cdn, "11");
// 		calculateManpowerValuesB(frm, cdt, cdn, "11");
// 	},
// 	m_12: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "12");
// 		calculateMaterialValuesB(frm, cdt, cdn, "12");
// 		calculateManpowerValuesB(frm, cdt, cdn, "12");
// 	},
// });

//calculating duration
frappe.ui.form.on('Operational Plan', {
	end_date: function(frm) {
		if (frm.doc.start_date && frm.doc.end_date) {
			var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
			var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

			var time_difference = end_date.getTime() - start_date.getTime();
			var day_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24)); // Calculate days

			frm.set_value('duration', day_difference);
			console.log("duration", day_difference);
			frm.refresh_field("duration");
			if (day_difference < 180) {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 1);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 1);

			}
			else {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 0);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 0);
			}
			//calculating th months
			var start_month = start_date.getMonth() + 1; // Months are 0-indexed, so we add 1
			var end_month = end_date.getMonth() + 1;
			var month_numbers = [];

			if (end_date.getFullYear() > start_date.getFullYear()) {
				for (var i = start_month; i <= 12; i++) {
					month_numbers.push(i);
				}
				for (var i = 1; i <= end_month; i++) {
					month_numbers.push(i);
				}
			} else {
				for (var i = start_month; i <= end_month; i++) {
					month_numbers.push(i);
				}
			}

			// Add the month numbers to the table
			var table = frm.doc.month_numbers;
			frm.doc.month_numbers = []; // Clear existing entries
			$.each(month_numbers, function(i, month_number) {
				var row = frappe.model.add_child(frm.doc, 'Operational Plan Month Numbers', 'month_numbers');
				row.month = month_number;
			});

			frm.refresh_field("month_numbers");
		}
	},

	start_date: function(frm) {
		if (frm.doc.start_date && frm.doc.end_date) {
			var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
			var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

			var time_difference = end_date.getTime() - start_date.getTime();
			var day_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24)); // Calculate days

			frm.set_value('duration', day_difference);
			console.log("duration", day_difference);
			frm.refresh_field("duration");
			if (day_difference < 180) {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 1);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 1);

			}
			else {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 0);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 0);
			}
			//calculating th months
			var start_month = start_date.getMonth() + 1; // Months are 0-indexed, so we add 1
			var end_month = end_date.getMonth() + 1;
			var month_numbers = [];

			if (end_date.getFullYear() > start_date.getFullYear()) {
				for (var i = start_month; i <= 12; i++) {
					month_numbers.push(i);
				}
				for (var i = 1; i <= end_month; i++) {
					month_numbers.push(i);
				}
			} else {
				for (var i = start_month; i <= end_month; i++) {
					month_numbers.push(i);
				}
			}

			// Add the month numbers to the table
			var table = frm.doc.month_numbers;
			frm.doc.month_numbers = []; // Clear existing entries
			$.each(month_numbers, function(i, month_number) {
				var row = frappe.model.add_child(frm.doc, 'Operational Plan Month Numbers', 'month_numbers');
				row.month = month_number;
			});

			frm.refresh_field("month_numbers");
		}
	}
});

frappe.ui.form.on('Operational Plan', {
	onload: function(frm){
		var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
		var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

		var time_difference = end_date.getTime() - start_date.getTime();
		var day_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24)); // Calculate days
		if(frm.doc.duration){
			if (day_difference < 180) {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 1);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 1);

			}
			else {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 0);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 0);
			}
		}
	}
})



//fetching the task for all other tables
frappe.ui.form.on('Operational Plan Detail', {
	activity: function(frm, cdt, cdn) {
		if (!frm.doc.project) {
			show_alert("Please select project first to effectively continue.");
			cur_frm.clear_table("task_list");
			cur_frm.refresh_fields("task_list");
			return;
		}
		var row = locals[cdt][cdn];
		var eqTable = frappe.model.add_child(frm.doc, "Operational Plan Machinery Detail", "machinery");
		eqTable.activity = frm.doc.task_list[0].activity;
		eqTable.productivity = frm.doc.task_list[0].productivity;
		eqTable.subject = frm.doc.task_list[0].activity_name;
		frm.refresh_field("machinery")
	}
});

//calculate the total machinery cost for each equipment
frappe.ui.form.on('Operational Plan Machinery Detail', {
	qty: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.qty && row.rental_rate) {
			row.total_hourly_cost = row.rental_rate * row.qty
		}
		if (row.total_hourly_cost && row.productivity) {
			row.machinery_cost = row.total_hourly_cost / row.productivity;
		}
		console.log("realy ork",)
		row.eqt_hour = (row.uf || 1 * row.efficiency || 1 * row.quantity * row.item_no) / row.productivity
		frm.refresh_field("machinery");
	}
});


//calculating amount
frappe.ui.form.on('Operational Plan Detail', {
	planned: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];

		if (row.planned && row.rate) {
			row.amount = row.planned * row.rate;
			console.log(row.amount)
			frm.refresh_field("machinary_detail_summarized_by_month_section_a")
		}
	}
});

//assign value to the Operational Plan Detail two
frappe.ui.form.on('Operational Plan Detail One1', {
	m_1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail two
function AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("localssss", row);

	// Calculate the total
	total += row.m_1 ? parseFloat(row.m_1) : 0;
	total += row.m_2 ? parseFloat(row.m_2) : 0;
	total += row.m_3 ? parseFloat(row.m_3) : 0;
	total += row.m_4 ? parseFloat(row.m_4) : 0;
	total += row.m_5 ? parseFloat(row.m_5) : 0;
	total += row.m_6 ? parseFloat(row.m_6) : 0;

	console.log("total sum", total);

	var matchingRow;
	frm.doc.operational_plan_detail_two2.forEach(function(item) {
		if (item.activity == row.activity) {
			matchingRow = item;
		}
	});

	if (matchingRow) {
		matchingRow.planned = row.planned - total;
		frm.refresh_field("operational_plan_detail_two2");
	} else {
		console.log("Matching row not found");
	}
}



//assign value to the machinery Plan Detail one
frappe.ui.form.on('Operational Plan Machinery Detail Summarized One', {
	op_e_m1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail one
function AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("locals", row);
	// Calculate the total
	total += row.op_e_m1 ? parseFloat(row.op_e_m1) : 0;
	total += row.op_e_m2 ? parseFloat(row.op_e_m2) : 0;
	total += row.op_e_m3 ? parseFloat(row.op_e_m3) : 0;
	total += row.op_e_m4 ? parseFloat(row.op_e_m4) : 0;
	total += row.op_e_m5 ? parseFloat(row.op_e_m5) : 0;
	total += row.op_e_m6 ? parseFloat(row.op_e_m6) : 0;

	console.log("total sum", total);
	var table = frm.doc.operational_plan_detail_two2[0];
	console.log("table", frm.doc.machinery[0])
	frm.refresh_field("machinary_detail_summarized_by_month_section_b")

}

//assign value to the Operational Plan Detail two
frappe.ui.form.on('Operational Plan Manpower Detail Summarized One', {
	op_mp_m1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail two
function AssignPlannedQuantityToManpower(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("locals", row);
	// Calculate the total
	total += row.op_mp_m1 ? parseFloat(row.op_mp_m1) : 0;
	total += row.op_mp_m2 ? parseFloat(row.op_mp_m2) : 0;
	total += row.op_mp_m3 ? parseFloat(row.op_mp_m3) : 0;
	total += row.op_mp_m4 ? parseFloat(row.op_mp_m4) : 0;
	total += row.op_mp_m5 ? parseFloat(row.op_mp_m5) : 0;
	total += row.op_mp_m6 ? parseFloat(row.op_mp_m6) : 0;

	console.log("total sum", total);
	frm.refresh_field("manpower_detail_summarized_by_month_section_b")

}



//assign value to the Operational Plan Detail two
frappe.ui.form.on('Operational Plan Material Detail Summarized One', {
	op_m_m1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail two
function AssignPlannedQuantityToMaterial(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("locals", row);
	// Calculate the total
	total += row.op_m_m1 ? parseFloat(row.op_m_m1) : 0;
	total += row.op_m_m2 ? parseFloat(row.op_m_m2) : 0;
	total += row.op_m_m3 ? parseFloat(row.op_m_m3) : 0;
	total += row.op_m_m4 ? parseFloat(row.op_m_m4) : 0;
	total += row.op_m_m5 ? parseFloat(row.op_m_m5) : 0;
	total += row.op_m_m6 ? parseFloat(row.op_m_m6) : 0;

	console.log("total sum", total);
	frm.refresh_field("material_detail_summarized_by_month_section_b")

}


function DurationMessage(years, months, days) {
	var message = "";
	if (years > 0) {

		if (years == 1)
			message += years + " year ";
		else
			message += years + " years ";
	}

	if (months > 0 || years > 0) {

		if (months == 1)
			message += months + " month ";
		else if (months != 0)
			message += months + " months";

	}

	if (days == 1)
		message += days + " day ";
	else if (days != 0)
		message += days + " days ";

	return message;
}

function CalDaysInBetweenDates(date1, date2) {
	if ((Object.prototype.toString.call(date1) === '[object Date]') && (Object.prototype.toString.call(date2) === '[object Date]')) {

		var diff = Math.floor(date2.getTime() - date1.getTime());
		var secs = Math.floor(diff / 1000);
		var mins = Math.floor(secs / 60);
		var hours = Math.floor(mins / 60);
		var days = Math.floor(hours / 24);
		return days;
	}
	var days = 0;
	return days;
}

function RemainDays(days) {
	days = Math.floor(days % 31);
	return days
}

function CalMonthFromDays(days) {
	var months = Math.floor(days / 31);
	return months;
}

function RemainMonths(months) {
	months = Math.floor(months % 12);
	return months
}

function CalYearFromMonth(months) {
	var years = Math.floor(months / 12);
	return years;
}

function GetDuration(date1, date2) {
	var totalDays = CalDaysInBetweenDates(date1, date2);
	var month = CalMonthFromDays(totalDays);
	var year = CalYearFromMonth(month);
	var remainDays = RemainDays(totalDays);
	var remainMonth = RemainMonths(month);
	var message = DurationMessage(year, remainMonth, remainDays);
	return message;
}

frappe.ui.form.on("Operational Plan", {
	quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Operational Plan", {
	productivity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Operational Plan", {
	project: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.set_query("activity", "task_list", function() {
			return {
				"filters": {
					"project": frm.doc.project,
					"is_group": 0
				}
			}
		});
	}
});

frappe.ui.form.on("Operational Plan", {
	onload: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});
		}
	}
});



function AutoPopulate(frm, cdt, cdn) {

	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	var d = locals[cdt][cdn];
	var activity = frappe.model.get_value(d.doctype, d.name, "activity");

	// if (activity && date1 && date2) {
	// 	frappe.call({
	// 		method: "erpnext.timesheet_sum_of_executed_qty.get_executed_quantity_from_timesheet",
	// 		args: { activity: activity, date1: date1, date2: date2 }
	// 	}).done((r) => {
	// 		if (r.message.length >= 1)
	// 			if (r.message[0]) {

	// 				var to_date_executed = r.message[0];
	// 				// frappe.model.set_value(d.doctype, d.name, "to_date_executed", (parseFloat(to_date_executed) || 0));
	// 				var quantity = frappe.model.get_value(d.doctype, d.name, "quantity");
	// 				var rate = frappe.model.get_value(d.doctype, d.name, "rate");
	// 				var amount = quantity * rate;
	// 				var remaining_planned_qty = quantity - parseFloat(to_date_executed);
	// 				frappe.model.set_value(d.doctype, d.name, "remaining_planned_qty", remaining_planned_qty);
	// 				frappe.model.set_value(d.doctype, d.name, "amount", amount);
	// 				frappe.model.set_value(d.doctype, d.name, "actual_quantity", quantity);
	// 				frappe.model.set_value(d.doctype, d.name, "to_date_executed", 0);


	// 			}
	// 	})

	// 	refresh_field("task_list");
	// }

	frm.doc.operational_plan_detail_one1 = []
	frm.doc.operational_plan_detail_two2 = []

	frm.doc.machinery = []
	frm.doc.manpower1 = []
	frm.doc.material1 = []

	frm.doc.machinery_detail_summerized = []
	// frm.doc.machinary_detail_summarized_by_month_section_a = []
	// frm.doc.machinary_detail_summarized_by_month_section_b = []

	frm.doc.manpower_detail_summerized = []
	// frm.doc.manpower_detail_summarized_by_month_section_a = []
	// frm.doc.manpower_detail_summarized_by_month_section_b = []

	frm.doc.material_detail_summerized = []
	// frm.doc.material_detail_summarized_by_month_section_a = []
	// frm.doc.material_detail_summarized_by_month_section_b = []

	var allMachinesMap = new Map();
	var allManpowerMap = new Map();
	var allMaterialMap = new Map();



	var grand_total_cost_for_machinary = 0;
	var number_of_items_for_machinary = 0;
	var sum_of_unit_rate_for_machinary = 0;

	var grand_total_cost_for_manpower = 0;
	var number_of_items_for_manpower = 0;
	var sum_of_unit_rate_for_manpower = 0;

	var grand_total_cost_for_material = 0;
	var number_of_items_for_material = 0;
	var sum_of_unit_rate_for_material = 0;

	allMachinesMap.clear();
	allManpowerMap.clear();
	allMaterialMap.clear();

	var task_lists = frm.doc.task_list;

	$.each(task_lists, function(_i, eMain) {

		//Script to populate child tables for machinary
		var taskParent = eMain.activity;
		var subject = eMain.activity_name;
		var planned_qty = eMain.planned ? eMain.planned : 1;




		if (taskParent) {
			frappe.call({
				method: "erpnext.machinary_populate_api.get_machinary_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {



					var entry = frm.add_child("machinery");
					entry.id_mac = e.id_mac;
					entry.type = e.type;
					entry.activity = taskParent;
					entry.item_no = e.qty;
					console.log("eee", e);
					entry.subject = subject;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.uf = e.uf;
							entry.efficency = e.efficency;
							entry.rental_rate = e.rental_rate;
							grand_total_cost_for_machinary += entry.qty * entry.rental_rate;
							number_of_items_for_machinary += 1;
							sum_of_unit_rate_for_machinary += entry.rental_rate;
							entry.total_hourly_cost = entry.qty * entry.rental_rate;
							entry.machinery_cost = entry.total_hourly_cost / entry.productivity
							console.log("uf ", entry.uf, "eff ", entry.efficency, "qty ", entry.qty, "item no ", entry.item_no, "prod", entry.productivity)
							entry.eqt_hour = (entry.uf * entry.efficency * entry.qty * entry.item_no) / entry.productivity;
							frm.refresh_field("machinery")

						}
					})





					if (allMachinesMap.has(e.id_mac)) {

						var existingVal = allMachinesMap.get(entry.id_mac);
						existingVal.qty += (entry.qty);
						existingVal.total_hourly_cost += (entry.total_hourly_cost);
						allMachinesMap.set(entry.id_mac, existingVal);
					}
					else {

						var newEntrySummerized = frm.add_child("machinery_detail_summerized");
						newEntrySummerized.id_mac = e.id_mac;
						newEntrySummerized.type = e.type;
						newEntrySummerized.qty = e.qty * planned_qty;
						newEntrySummerized.uf = e.uf;
						newEntrySummerized.efficency = e.efficency;
						newEntrySummerized.rental_rate = e.rental_rate;
						newEntrySummerized.total_hourly_cost = entry.qty * entry.rental_rate;
						allMachinesMap.set(e.id_mac, newEntrySummerized);

						var machinery_exist1 = false;
						var machinery_exist2 = false;

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							console.log("eeeee", e)
							if (row.activity === e.parent) {
								machinery_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});
						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								machinery_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						console.log("machinery exist 1", machinery_exist1)
						console.log("machinery exist 2", machinery_exist2)

						if (!machinery_exist1) {
							var newEntrySummerized_section_a = frm.add_child("machinary_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_mac = e.id_mac;
							newEntrySummerized_section_a.activity = e.parent;

							newEntrySummerized_section_a.type = e.type;
						}


						if (!machinery_exist2) {
							var newEntrySummerized_section_b = frm.add_child("machinary_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_mac = e.id_mac;
							newEntrySummerized_section_b.activity = e.parent;

							newEntrySummerized_section_b.type = e.type;
						}
					}

				})

				frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
				frm.doc.equipment_unit_rate = (sum_of_unit_rate_for_machinary / number_of_items_for_machinary);


				allMachinesMap.forEach(function(val, key) {


				})

				refresh_field("machinery");
				refresh_field("equipment_total_cost");
				refresh_field("equipment_unit_rate");
				refresh_field("machinery_detail_summerized");
				refresh_field("machinary_detail_summarized_by_month_section_a");
				refresh_field("machinary_detail_summarized_by_month_section_b");
			})
		}

		//Script to populate child tables for manpower
		if (taskParent) {
			frappe.call({
				method: "erpnext.manpower_populate_api.get_manpower_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {
					console.log("mppppe eeeee", e)
					var entry = frm.add_child("manpower1");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.activity = taskParent;
					entry.subject = subject;
					// entry.productivity = frm.doc.task_list[0].productivity;

					entry.qty = e.qty * planned_qty;
					entry.li_permanent = e.li_permanent;
					entry.mp_number = parseFloat(e.qty);
					console.log("mppppppp number", entry.mp_number)
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.hourly_cost = e.hourly_cost;
					entry.mp_hour = entry.uf
					grand_total_cost_for_manpower += entry.qty * entry.hourly_cost;
					number_of_items_for_manpower += 1;
					sum_of_unit_rate_for_manpower += entry.hourly_cost;
					entry.total_hourly_cost = entry.qty * entry.hourly_cost;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.act_quantity = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.mp_hour = (entry.uf * entry.li_permanent * entry.mp_number * entry.act_quantity) / entry.productivity;
							entry.act_quantity = entry.act_quantity;


							frm.refresh_field("manpower1")

						}
					})


					if (!frm.doc.manpower_detail_summarized_by_month_section_a) {
						console.log("first")
						var manpower_exist1 = false;
						var manpower_exist2 = false;
						console.log("eeeeeee2", e);
						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								manpower_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								manpower_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						if (!manpower_exist1) {
							var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_map = e.id_map;
							newEntrySummerized_section_a.activity = e.parent;

							newEntrySummerized_section_a.job_title = e.job_title;
						}

						if (!manpower_exist2) {
							var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_map = e.id_map;
							newEntrySummerized_section_b.activity = e.parent;

							newEntrySummerized_section_b.job_title = e.job_title;
						}


						var entryMPSummerized = frm.add_child("manpower_detail_summerized");
						entryMPSummerized.id_map = e.id_map;
						entryMPSummerized.job_title = e.job_title;
						entryMPSummerized.qty = e.qty * planned_qty;
						entryMPSummerized.uf = e.uf;
						entryMPSummerized.efficency = e.efficency;
						entryMPSummerized.hourly_cost = e.hourly_cost;
						entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
					}
					else {

						var manpower_exist = false;


						$.each(frm.doc.manpower_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_map === e.id_map) {
								manpower_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!manpower_exist) {

							var manpower_exist1 = false;
							var manpower_exist2 = false;
							console.log("eeeeeee2", e);
							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

							if (!manpower_exist1) {
								var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.id_map = e.id_map;
								newEntrySummerized_section_a.activity = e.parent;

								newEntrySummerized_section_a.job_title = e.job_title;
							}

							if (!manpower_exist2) {
								var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.id_map = e.id_map;
								newEntrySummerized_section_b.activity = e.parent;

								newEntrySummerized_section_b.job_title = e.job_title;
							}
						} else {
							var entryMPSummerized = frm.add_child("manpower_detail_summerized");
							entryMPSummerized.id_map = e.id_map;
							entryMPSummerized.job_title = e.job_title;
							entryMPSummerized.qty = e.qty * planned_qty;
							entryMPSummerized.uf = e.uf;
							entryMPSummerized.efficency = e.efficency;
							entryMPSummerized.hourly_cost = e.hourly_cost;
							entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
						}
					}










				})


				frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
				frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower / number_of_items_for_manpower);

				refresh_field("manpower1");
				refresh_field("man_power_total_cost");
				refresh_field("man_power_unit_rate");
				refresh_field("manpower_detail_summerized");
				refresh_field("manpower_detail_summarized_by_month_section_a");
				refresh_field("manpower_detail_summarized_by_month_section_b");
			})
		};
		//Script to populate child tables for material
		if (taskParent) {
			
			frappe.call({

				method: "erpnext.material_populate_api.get_material_by_task",
				args: { parent: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {

					var entry = frm.add_child("material1");
					entry.id_mat = e.id_mat;
					entry.item1 = e.item1;
					entry.activity = taskParent;
					entry.subject = subject;
					entry.uom = e.uom;
					entry.qty = e.qty;
					
					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.task_qty = response.message[0].quantity;
							entry.qty = e.qty
							entry.uf = e.uf;
							entry.efficency = e.efficency;
							entry.unit_price = e.unit_price;
							grand_total_cost_for_material += entry.qty * entry.unit_price;
							number_of_items_for_material += 1;
							sum_of_unit_rate_for_material += entry.unit_price;
							entry.total_cost = entry.qty * entry.unit_price;

							entry.material_no = entry.qty * entry.task_qty;


							frm.refresh_field("material1")

						}
					})


					if (!frm.doc.material_detail_summarized_by_month_section_a) {

						var entryMaterialSummerized = frm.add_child("material_detail_summerized");
						entryMaterialSummerized.id_mat = e.id_mat;
						entryMaterialSummerized.item1 = e.item1;
						entryMaterialSummerized.uom = e.uom;
						entryMaterialSummerized.qty = e.qty * planned_qty;
						entryMaterialSummerized.uf = e.uf;
						entryMaterialSummerized.efficency = e.efficency;
						entryMaterialSummerized.unit_price = e.unit_price;
						entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;

						var material_exist1 = false;
						var material_exist2 = false;

						console.log("eeeeeeeeee material", e);

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								material_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								material_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						console.log(" material exist 1", material_exist1);
						console.log(" material exist 2", material_exist2);


						if (!material_exist1) {
							var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_mat = e.id_mat;
							newEntrySummerized_section_a.unit = e.uom;
							newEntrySummerized_section_a.item = e.item1;
						}

						if (!material_exist2) {
							var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_mat = e.id_mat;
							newEntrySummerized_section_b.unit = e.uom;
							newEntrySummerized_section_b.item = e.item1;
						}
					}
					else {

						var material_exist = false;


						$.each(frm.doc.material_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_mat === e.id_mat) {
								material_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!material_exist) {
							var material_exist1 = false;
							var material_exist2 = false;

							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									material_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									material_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

							if (!material_exist1) {
								var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.id_mat = e.id_mat;
								newEntrySummerized_section_a.unit = e.uom;
								newEntrySummerized_section_a.item = e.item1;
							}

							if (!material_exist2) {
								var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.id_mat = e.id_mat;
								newEntrySummerized_section_b.unit = e.uom;
								newEntrySummerized_section_b.item = e.item1;
							}
						} else {
							var entryMaterialSummerized = frm.add_child("material_detail_summerized");
							entryMaterialSummerized.id_mat = e.id_mat;
							entryMaterialSummerized.item1 = e.item1;
							entryMaterialSummerized.uom = e.uom;
							entryMaterialSummerized.qty = e.qty * planned_qty;
							entryMaterialSummerized.uf = e.uf;
							entryMaterialSummerized.efficency = e.efficency;
							entryMaterialSummerized.unit_price = e.unit_price;
							entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;
						}
					}





				})

				frm.doc.material_total_cost = grand_total_cost_for_material;
				//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

				refresh_field("material1");
				refresh_field("material_total_cost");
				refresh_field("material_detail_summerized");
				refresh_field("material_detail_summarized_by_month_section_a");
				refresh_field("material_detail_summarized_by_month_section_b");
			})
		}

		// //Script to populate child tables for task detail by month
		// if (taskParent) {

		// 	frappe.call({

		// 		method: "erpnext.task_week_detail_populate_api.get_task_by_task_id",
		// 		args: { activity: taskParent }

		// 	}).done((r) => {
		// 		$.each(r.message, function(_i, e) {
		// 			var activity_exists1 = false;
		// 			var activity_exists2 = false;

		// 			$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
		// 				if (row.activity === e[0]) {
		// 					activity_exists1 = true;
		// 					if (eMain.planned) {
		// 						row.planned = eMain.planned;
		// 					}
		// 					return false;
		// 				}
		// 			});

		// 			$.each(frm.doc.operational_plan_detail_two2, function(index, row) {
		// 				if (row.activity === e[0]) {
		// 					activity_exists2 = true;
		// 					return false;
		// 				}
		// 			});

		// 			if (!activity_exists1) {
		// 				var entryOne = frm.add_child("operational_plan_detail_one1");
		// 				entryOne.activity = e[0];
		// 				entryOne.activity_name = e[17];
		// 				entryOne.uom = e[61];
		// 				if (eMain.planned) {
		// 					entryOne.planned = eMain.planned;
		// 				}
		// 			}

		// 			if (!activity_exists2) {
		// 				var entryTwo = frm.add_child("operational_plan_detail_two2");
		// 				entryTwo.activity = e[0];
		// 				entryTwo.activity_name = e[17];
		// 				entryTwo.uom = e[61];
		// 			}
		// 		});


		// 		refresh_field("operational_plan_detail_one1");
		// 		refresh_field("operational_plan_detail_two2");
		// 	})
		// }
			//Script to populate child tables for task detail by month AD
			if (taskParent) {
				frappe.call({
					method: "frappe.client.get_list",
					args: {
						doctype: "Task",
						filters: {
							name: taskParent
						},
						fields: "*"
					},
					callback: function(response) {
						console.log("The response of API from task list is:", response);
						if (response.message && Array.isArray(response.message)) {
							const tasks = response.message;
							tasks.forEach(function(e) {
								console.log("Processing task:", e);
				
								// Get Early Start (es) directly from frm.doc.critical_path_table for the current task
								let earlyStart = null;
	
										// Convert critical_path_table to an array, even if it's undefined or an object
										const criticalPathEntries = Array.isArray(frm.doc.critical_path_table)
										? frm.doc.critical_path_table
										: frm.doc.critical_path_table ? [frm.doc.critical_path_table] : [];
	
									// Find the matching activity in the critical path table
									const criticalPathEntry = criticalPathEntries.find(function(entry) {
										return entry.activity === e.name; // Match activity name
									});
	
									// If a matching entry is found, set earlyStart
									if (criticalPathEntry) {
										earlyStart = criticalPathEntry.es; // Set early start date if found
									}
	
				
								// Fetch holidays from the Operational Plan
								let holidays = getHolidaysFromOperationalPlan(frm);
				
								// Populate operational_plan_detail_one
								var entryOne = frm.add_child("operational_plan_detail_one1");
								entryOne.activity = e.name;
								entryOne.activity_name = e.task_specific_name;
								entryOne.duration = e.duration_in_days;
								entryOne.uom = e.unit;
								entryOne.productivity = e.productivity;
				                console.log("before you do your tasks check the following",entryOne,planned_qty,e.productivity,earlyStart)
								let remainingPlanned = AutoCalculateMonthValueOne(frm, entryOne, planned_qty, e.productivity, earlyStart, holidays);
								console.log("Remaining Planned after First Half Allocation:", remainingPlanned);
				             
								// Populate operational_plan_detail_two
								var entryTwo = frm.add_child("operational_plan_detail_two2");
								entryTwo.activity = e.name;
								entryTwo.activity_name = e.task_specific_name;
								entryTwo.duration = e.duration_in_days;
								entryTwo.uom = e.unit;
								remainingPlanned = AutoCalculateMonthValueTwo(frm, entryTwo, remainingPlanned, e.productivity, earlyStart, holidays);
				
								// Refresh both fields after all rows are added
								frm.refresh_field("operational_plan_detail_one1");
								frm.refresh_field("operational_plan_detail_two2");
							});
						}
					}
				});
	
			}	

	});
}

// function AutoCalculateMonthValueOne(doctype, name, planned) {

// 	console.log("One DocType: " + doctype);
// 	console.log("One Name: " + name);

// 	//frappe.model.set_value(doctype, name, 'm_1', (planned / 12));
// 	//frappe.model.set_value(doctype, name, 'm_2', (planned / 12));
// 	//frappe.model.set_value(doctype, name, 'm_3', (planned / 12));
// 	//frappe.model.set_value(doctype, name, 'm_4', (planned / 12));
// 	//frappe.model.set_value(doctype, name, 'm_5', (planned / 12));
// 	//frappe.model.set_value(doctype, name, 'm_6', (planned / 12));
// }

// function AutoCalculateMonthValueTwo(doctype, name, planned) {

// 	console.log("Two DocType: " + doctype);
// 	console.log("Two Name: " + name);

// 	//frappe.model.set_value(doctype, name, 'm_7', (planned / 25));
// 	//frappe.model.set_value(doctype, name, 'm_8', (planned / 26));
// 	//frappe.model.set_value(doctype, name, 'm_9', (planned / 27));
// 	//frappe.model.set_value(doctype, name, 'm_10', (planned / 26));
// 	//frappe.model.set_value(doctype, name, 'm_11', (planned / 25));
// 	//frappe.model.set_value(doctype, name, 'm_12', (planned / 24));
// }

frappe.ui.form.on("Operational Plan", {
	fetch: function(frm, cdt, cdn) {
		AutoPopulate(frm, cdt, cdn);
	},
});

frappe.ui.form.on("Operational Plan Detail", {
	activity: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var table = frm.doc.task_list;
		console.log("row", row);
		console.log("table", table);

		for (var i = 0; i < table.length - 1; i++) {
			if (table[i].activity == row.activity) {
				frappe.show_alert("You cannot select a similar Task again!");
				frm.doc.task_list.splice(i, 1); // Remove the row from the task_list
				frm.refresh_field("task_list"); // Refresh the field to reflect the change
				return;
			}
		}
	},

	// planned: function(frm, cdt, cdn) {
	// 	AutoPopulate(frm, cdt, cdn);
	// }
});


// frappe.ui.form.on("Operational Plan Detail One1", {
// 	planned: function(frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		frm.refresh_field("planned");
// 		AutoCalculateMonthValueOne(d.doctype, d.name, d.planned);
// 	}
// });

// frappe.ui.form.on("Operational Plan Detail Two2", {
// 	planned: function(frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		frm.refresh_field("planned");
// 		AutoCalculateMonthValueTwo(d.doctype, d.name, d.planned);
// 	}
// });

function checkActivityExistence(activity, detail) {
	var exists = false;
	$.each(detail, function(index, row) {
		if (row.activity === activity) {
			exists = true;
			return false;
		}
	});
	return exists;
}


