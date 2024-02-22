SELECT
    s.name AS "Supplier Quotation:Link/Supplier Quotation:150",
    s.req_qutation AS "Request for Quotation:Link/Request for Quotation",
    s.supplier AS "Supplier:150",
    s.transaction_date AS "Date:Date:250",
    sl.item_code AS "Item Code:Link/Item:150",
    sl.item_name AS "Item Name",
    sl.uom AS "UOM:Link/UOM:150",
    FORMAT(sl.rate, 2) AS "Unit Rate Amount:Currency:150",
    FORMAT(sl.qty, 2) AS "Quantity:150",
    FORMAT(sl.amount, 2) AS "Total Amount:Currency:150",
    s.payment_term AS "Payment Term",
    s.delivery_time_in_days AS "Delivery Time",
   -- ROW_NUMBER() OVER (PARTITION BY s.name ORDER BY sl.item_code, sl.rate) AS Ranking,
    s.supplier_status AS "status",
    s.remark AS "Remark"
FROM
    `tabSupplier Quotation` s
INNER JOIN
    `tabSupplier Quotation Item` sl ON s.name = sl.parent
WHERE 
    COALESCE(s.supplier_status, '') IN ('', 'passed', 'failed') AND s.req_qutation= %(rfq_no)s   -- Handle NULL values
ORDER BY
    s.name,
    sl.item_code,
    sl.rate;
