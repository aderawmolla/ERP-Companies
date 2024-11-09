SELECT 
    COALESCE(cr.to, i.plate_no, mwo.serial_or_plate_no, fr.plate_no) AS PlateNo,
    SUM(i.maintainance_cost + i.compansation_cost) AS AccidentInsuranceFollowupCost,
    SUM((fr.vehicle_km_litr + fr.others_liters_hr) * fr.rate) AS FuelCost,
    SUM(mwo.total_cost) AS MaintenanceWorkorderCost,
    SUM(cr.total_cost) AS CannibalizationCost,
    SUM(
        COALESCE(i.maintainance_cost, 0) +
        COALESCE(i.compansation_cost, 0) +
        COALESCE(mwo.total_cost, 0) +
        COALESCE((fr.vehicle_km_litr + fr.others_liters_hr) * fr.rate, 0)
    ) AS TotalCost
FROM 
    `tabFuel Request for Equipment Form` fr 
LEFT JOIN
    `tabAccident Insurance Followup` i 
    ON i.plate_no = fr.plate_no
LEFT JOIN 
    `tabCannibalization request Form` cr 
    ON cr.to = fr.plate_no
LEFT JOIN 
    `tabMaintenance Work order` mwo 
    ON mwo.serial_or_plate_no = fr.plate_no /* Adjust the join condition based on your data model */
-- WHERE
--     cr.date_ec>= %(from_date)s AND cr.date_ec<= %(to_date)s AND fr.date_ec >= %(from_date)s AND fr.date_ec <= %(to_date)s AND i.completed_date_ec >= %(from_date)s AND i.completed_date_ec <= %(to_date)s
GROUP BY 
    COALESCE(i.plate_no, fr.plate_no)

UNION

SELECT 
    COALESCE(cr.to, i.plate_no, mwo.serial_or_plate_no, fr.plate_no) AS PlateNo,
    SUM(i.maintainance_cost + i.compansation_cost) AS AccidentInsuranceFollowupCost,
    SUM((fr.vehicle_km_litr + fr.others_liters_hr) * fr.rate) AS FuelCost,
    SUM(mwo.total_cost) AS MaintenanceWorkorderCost,
    SUM(cr.total_cost) AS CannibalizationCost,
    SUM(
        COALESCE(i.maintainance_cost, 0) +
        COALESCE(i.compansation_cost, 0) +
        COALESCE(mwo.total_cost, 0) +
        COALESCE((fr.vehicle_km_litr + fr.others_liters_hr) * fr.rate, 0)
    ) AS TotalCost
FROM 
    `tabFuel Request for Equipment Form` fr 
RIGHT JOIN
    `tabAccident Insurance Followup` i 
    ON i.plate_no = fr.plate_no
RIGHT JOIN 
    `tabCannibalization request Form` cr 
    ON cr.to = fr.plate_no
RIGHT JOIN 
    `tabMaintenance Work order` mwo 
    ON mwo.serial_or_plate_no = fr.plate_no /* Adjust the join condition based on your data model */
-- WHERE
--     cr.date_ec>= %(from_date)s AND cr.date_ec<= %(to_date)s AND fr.date_ec >= %(from_date)s AND fr.date_ec <= %(to_date)s AND i.completed_date_ec >= %(from_date)s AND i.completed_date_ec <= %(to_date)s
GROUP BY 
    COALESCE(i.plate_no, fr.plate_no);
