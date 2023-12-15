SELECT
    sq.name AS "Supplier Quotation:Link/Supplier Quotation",
    sq.transaction_date AS "Posting Date",
    sq.supplier_quotation_date_ec AS "Date EC",
    sq.req_qutation AS "Request Quatation:Link/Request for Quotation",
    sq.supplier AS "Supplier",
    sq.pr_no AS "Purchase Requisition:Link/Purchase Requisition",
    sq.base_total+(sq.value_addition*sq.base_total) AS "Lot Price:Currency:200",
    sq.base_total+(sq.value_addition*sq.base_total) AS "Lot Price After Value:Currency:200",
    CASE 
        WHEN sq.passing_status = 'failed' THEN NULL
        ELSE RANK() OVER (ORDER BY sq.base_total)
    END AS rank,
    sq.passing_status AS "Status",
    sq.remark AS "Remark"
FROM 
    `tabSupplier Quotation` sq
INNER JOIN
    `tabSupplier Quotation Item` sl ON s.name = sl.parent
WHERE 
    sq.passing_status != 'rejected'
ORDER BY
    sq.base_total;
