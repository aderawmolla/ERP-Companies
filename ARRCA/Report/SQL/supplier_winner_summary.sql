SELECT
sq.name AS "Supplier Quatation:Link/Supplier Quotation",
sq.transaction_date AS "Posting Date",
sq.supplier_quotation_date_ec As "Date EC",
sq.req_qutation AS "Request Quatation:Link/Request for Quotation",
sq.supplier AS "Supplier",
sq.pr_no AS "Purchase Requisition:Link/Purchase Requisition",
sq.base_total AS "Lot Price:Currency:200"
FROM 
 `tabSupplier Quotation` sq
 
ORDER BY
    sq.base_total

