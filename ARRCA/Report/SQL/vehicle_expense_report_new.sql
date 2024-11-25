SELECT
    mwo.serial_or_plate_no AS "Plate No:Link/Equipment Birth Certificate Form",
    mwo.chasis_no AS "Chasis No",
    ct.group AS "Description Of Problem",
    mwo.location AS "Location",
    mwo.date_ec AS "Date",
    rp.description_parts_or_lubricants_or_materials_or_issued AS "Replaced Part Part Name",
    rp.part_no AS "Replaced Part Part_no",
    rp.qty AS "Replaced Part qty",
    rp.cost_summary_birr AS "Replaced Part cost",
    CASE WHEN item.item_group = 'fule& lubricant' THEN item.item_group END AS "Fuel and Lubricant type",
    CASE WHEN item.item_group = 'fule& lubricant' THEN sed.qty END AS "Fuel and Lubricant qty",
    CASE WHEN item.item_group = 'fule& lubricant' THEN COALESCE(sed.amount, 0) END AS " Fuel and Lubricant Cost",
    CASE WHEN item.item_group = 'Tyre' THEN item.item_group END AS "Tyre type",
    CASE WHEN item.item_group = 'Tyre' THEN sed.qty  END AS "Tyre qty",
    CASE WHEN item.item_group = 'Tyre' THEN COALESCE(sed.amount, 0) END AS "Tyre cost",
    cri.description   AS "Cannibalized Part Description",
    cri.qty AS "Cannibalized Part qty",
    COALESCE(cri.total_price,0) AS "Cannibalized Part cost",
    orpi.name_of_component_to_be_repaired AS "Outside maintenance Replaced Part",
    orpi.qty AS "Outside maintenance qty",
    COALESCE(orpi.qty * orpi.rate, 0) AS "Outside maintenance cost",
    i.insurance_type AS "Type of Insurance",
    i.from_date_ec AS "Begining Date",
    i.to_date_ec AS "End Date",
    COALESCE(i.cost, 0) AS "Cost",
    br.date_beg_ec AS "Bolo Begining Date",
    br.date_end_ec AS "Bolo End Date",
    COALESCE(br.bolo_cost, 0) AS "Bolo Cost",
    mpi.item_name AS "Maintenance plan Part Name",
    mpi.item_code AS "Maintenance Plan Part No",
    mpi.qty AS "Maintenance Plan qty",
    mpi.reserved AS "Reserved",
    pri.item_name AS "Procurement Part Name",
    pri.item_code AS "Procurement Part No",
    pri.qty AS "Procurement qty",
    bc.status AS "Status",
    COALESCE(rp.cost_summary_birr, 0) + COALESCE(sed.amount, 0) + COALESCE(orpi.qty * orpi.rate, 0) + COALESCE(i.cost, 0) + COALESCE(br.bolo_cost, 0) AS "Total Cost"
FROM
    `tabMaintenance Work order` mwo
LEFT JOIN
    `tabComplain Table` ct on mwo.name=ct.parent
LEFT JOIN `tabCannibalization request Form` cr on cr.to=mwo.serial_or_plate_no
LEFT JOIN `tabparts` cri on cri.parent=cr.name
LEFT JOIN `tabEquipment Birth Certificate Form` bc on mwo.serial_or_plate_no=bc.plate_no
LEFT JOIN `tabStock Entry` se ON se.plate_no = mwo.serial_or_plate_no
LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
LEFT JOIN `tabItem` item ON sed.item_code = item.name
LEFT JOIN `tabReplaced parts` rp ON mwo.name = rp.parent
LEFT JOIN `tabFuel Request for Equipment Form` fr ON mwo.serial_or_plate_no = fr.plate_no
LEFT JOIN `tabOutsdie Repair Permission Form` orp ON orp.plate_no = mwo.serial_or_plate_no
LEFT JOIN `tabOutsiderepair` orpi ON orpi.parent = orp.name
LEFT JOIN `tabBolo Request Form` br ON br.plate_no = mwo.serial_or_plate_no
LEFT JOIN `tabMaintenance Schedule` mp ON mp.vehicle_plate_no = mwo.serial_or_plate_no
LEFT JOIN `tabMaintenance Schedule Item` mpi ON mpi.parent = mp.name
LEFT JOIN `tabInsured Vehicles list` i ON i.plate_no = mwo.serial_or_plate_no
LEFT JOIN `tabPurchase Requisition` pr ON pr.plate_no = mwo.serial_or_plate_no
LEFT JOIN `tabMRI` pri ON pri.parent = pr.name;
