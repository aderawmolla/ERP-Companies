SELECT
    uc.employee AS "Employee:Link/Employee:120",
    uc.name_of_employee AS "Full Name:250",
    uc.name AS "Property Sheet:Link/User Card",
    uci.item AS "Item:100",
    uci.item_name_or_description AS "item Description",
    COALESCE(SUM(CASE WHEN uc.purpose = 'Take' THEN uci.qty ELSE 0 END), 0) AS "Taken Quantity:100",
    COALESCE(SUM(CASE WHEN uc.purpose = 'Receive' THEN uci.qty ELSE 0 END), 0) AS "Returned Quantity:100",
    COALESCE(SUM(CASE WHEN uc.purpose = 'Take' THEN uci.qty ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN uc.purpose = 'Receive' THEN uci.qty ELSE 0 END), 0) AS "Remaining Quantity:100"
FROM
    `tabProperty Sheet` uc
LEFT JOIN
    `tabProperty Sheet Table` uci ON uc.name = uci.parent
GROUP BY
    uc.employee,uc.name_of_employee,uci.item;
