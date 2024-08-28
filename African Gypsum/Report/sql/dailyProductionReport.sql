SELECT 
    jc.posting_date AS "Produced Date",
    jc.workstation AS "Work Center Name",
    jc.production_item AS "Produced Item",
    SUM(jc.total_completed_qty) AS "Produced qty",
    -- SUM(wo.produced_qty) AS "Produced Qty",  
    woi.item_name AS "Consumed Item Name",
    SUM(woi.consumed_qty) AS "Consumed Quantity",
    SUM(wo.lead_time) AS "Daily R.H",
    SUM(wo.produced_qty) AS "Daily Prod.",
    wo.produced_qty /wo.lead_time AS "Daily T/H",
    MONTH(jc.posting_date) AS "Produced Month",
    (
        SELECT 
            SUM(wo_sub.lead_time)
        FROM `tabWork Order` wo_sub
        LEFT JOIN `tabJob Card` jc_sub ON jc_sub.work_order = wo_sub.name
        WHERE MONTH(jc_sub.posting_date) = MONTH(jc.posting_date) AND jc_sub.posting_date <= jc.posting_date
    ) AS "Monthly R.H",
    (
        SELECT 
            SUM(wo_sub.produced_qty)
        FROM `tabWork Order` wo_sub
        LEFT JOIN `tabJob Card` jc_sub ON jc_sub.work_order = wo_sub.name
        WHERE MONTH(jc_sub.posting_date) = MONTH(jc.posting_date) AND jc_sub.posting_date <= jc.posting_date
    ) AS "Monthly Prod.",
    (
        SELECT 
            SUM(wo_sub.produced_qty / wo_sub.lead_time)
        FROM `tabWork Order` wo_sub
        LEFT JOIN `tabJob Card` jc_sub ON jc_sub.work_order = wo_sub.name
        WHERE MONTH(jc_sub.posting_date) = MONTH(jc.posting_date) AND jc_sub.posting_date <= jc.posting_date
    ) AS "Monthly T/H",
    (
        SELECT 
            SUM(wo_sub.lead_time)
        FROM `tabWork Order` wo_sub
        LEFT JOIN `tabJob Card` jc_sub ON jc_sub.work_order = wo_sub.name
        WHERE jc_sub.posting_date <= jc.posting_date
    ) AS "Yearly R.H",
    (
        SELECT 
            SUM(wo_sub.produced_qty)
        FROM `tabWork Order` wo_sub
        LEFT JOIN `tabJob Card` jc_sub ON jc_sub.work_order = wo_sub.name
        WHERE jc_sub.posting_date <= jc.posting_date
    ) AS "Yearly Prod.",
    (
        SELECT 
            SUM(wo_sub.produced_qty / wo_sub.lead_time)
        FROM `tabWork Order` wo_sub
        LEFT JOIN `tabJob Card` jc_sub ON jc_sub.work_order = wo_sub.name
        WHERE jc_sub.posting_date <= jc.posting_date
    ) AS "Yearly T/H"
FROM `tabWork Order` wo
LEFT JOIN `tabWork Order Item` woi ON wo.name = woi.parent
LEFT JOIN `tabJob Card` jc ON jc.work_order = wo.name
WHERE  
    jc.posting_date >= %(from_date)s AND jc.posting_date <= %(to_date)s
GROUP BY
    jc.workstation, jc.posting_date, wo.production_item, woi.item_name, MONTH(jc.posting_date);
