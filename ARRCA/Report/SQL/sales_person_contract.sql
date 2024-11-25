SELECT
    spc.name AS "Contract No:Link/Sales Person Contract",
    spc.sales_partner AS "Sales Partner",
    spc.contract_from AS "Sales Contract From",
    spc.contract_to AS "Sales Contract to",
    sii.item_code AS "Item",
    spc.total_to_be_paid AS "Agreed Amount",
    -- SUM(so.total_commission) AS "Ordered Commission",
    si.name AS "Sales Invoice:Link/Sales Invoice",
    SUM(si.total_commission) AS "Invoiced Amount",
    spc.total_to_be_paid - SUM(si.total_commission) AS "Remaining Commission"
FROM
    `tabSales Person Contract` spc
LEFT JOIN
    `tabSales Invoice` si ON spc.name = si.sales_contract_number
LEFT JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
-- LEFT JOIN `tabSales Order` so ON so.sales_contract_number = si.sales_contract_number
-- LEFT JOIN `tabSales Order Item` soi ON soi.parent = so.name
GROUP BY
    spc.name, spc.sales_partner;
