SELECT
    s.name AS "Supplier Quatation:Link/Supplier Quotation:150",
    s.req_qutation AS "Request for quatation:Link/Request for Quotation",
    s.transaction_date As "Date:Date:250",
    s.supplier AS "Supplier:150",
    sl.item_code AS "Item Code:Link/Item:150",
    sl.uom AS "UOM:Link/UOM:150",
    FORMAT(sl.rate, 2) AS "Unit Rate Amount:Currency:150",
    FORMAT(sl.qty, 2) AS "Quantity:150",
    FORMAT(sl.amount, 2) AS "Tottal Amount:Currency:150",
    ROW_NUMBER() OVER (PARTITION BY sl.item_code ORDER BY sl.rate) AS Ranking
FROM
    `tabSupplier Quotation` s
INNER JOIN
    `tabSupplier Quotation Item` sl ON s.name = sl.parent
GROUP BY
    s.supplier, sl.item_code
ORDER BY
    sl.item_code, sl.rate;
