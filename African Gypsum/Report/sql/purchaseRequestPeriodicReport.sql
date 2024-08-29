SELECT 
  pr.name      AS "Purchase Requisition No:Link/Material Request",
  pr.transaction_date        AS	"Purchase Requisition Date",
  pr.approved_date           AS  "Purchase Requisition Approved Date",
  mri.profit_center           AS	"Profit Center Code:Link/Profit Center",
  mri.cost_center          AS	"Cost Center Code:Link/Cost Center",
  mri.warehouse     AS	"Location",
  mri.item_code              AS	 "Item No:Link/Item",	
  mri.description           AS	"Description",	
  mri.uom                AS	 "UOM",
  pri.qty                 AS	"Requested Qty On Purchase Request",
   lp.rate                   AS	"Request Item Last Unit Price",
  po.assigned_purchaser_code     AS	"Assigned Purchaser Code",	
    sq.name                AS 	"Purchase Quote No",
    sq.transaction_date              AS 	"Purchase Quote Date",
    po.name                AS 	"Purchase Order No",
    po.transaction_date               AS 	"Purchase Order Status",
    po.status               AS 	"Purchase Order Date",
    po.approved_date                AS 	"Purchase Order Approved Date",
    po.supplier                AS 	"Vendor No",
    po.supplier_name               AS 	 "Vendor Name",
    poi.qty                AS 	"QTY On Purchase Order",
    poi.rate                AS 	"Unit Cost",
    (poi.qty*poi.rate)      AS "Total Cost",
    prti.qty               AS 	"Delivered Qty",
    (poi.qty-prti.qty)                AS 	"Out Standing Qty",
    prt.grn_no               AS 	"GRN No",
    prt.delivery_date               AS	"Last Delivery Date"
FROM 
  `tabMaterial Request` mr
RIGHT JOIN 
 `tabPurchase Request` pr on pr.mr_no=mr.name
LEFT JOIN 
   `tabPurchase Request Item` pri on pri.parent=pr.name
LEFT JOIN `tabSupplier Quotation` sq on sq.material_request=mr.name
LEFT JOIN  `tabMaterial Request Item` mri ON mri.parent = mr.name
LEFT JOIN (
    SELECT 
      mri.item_code,
      MAX(mr.transaction_date) AS max_transaction_date,
      mri.rate
    FROM 
      `tabMaterial Request` mr
    LEFT JOIN `tabMaterial Request Item` mri ON mri.parent = mr.name
    WHERE mr.material_request_type = 'Purchase'
    GROUP BY mri.item_code
) AS lp ON mri.item_code = lp.item_code 
LEFT JOIN `tabPurchase Order` po ON po.purchase_request_no = mr.name
LEFT JOIN `tabPurchase Order Item` poi ON po.name = poi.parent
LEFT JOIN `tabPurchase Receipt` prt ON prt.purchase_order = po.name
LEFT JOIN `tabPurchase Receipt Item` prti ON prt.name = prti.parent
WHERE  
    pr.transaction_date >= %(from_date)s AND pr.transaction_date <= %(to_date)s
-- WHERE mr.material_request_type = 'Purchase'
