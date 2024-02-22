SELECT
  transOut.item_code AS "Tout Code",
  transIn.item_code AS "Transfer in code",
  item.item_code AS "item code",
  transIn.transfer_out_no AS "Trans Out No:Link/Stock Entry",
  transIn.se AS "Transfer In No:Link/Stock Entry",
  transOut.se  AS "SIV No:Link/Stock Entry",
  transOut.date  AS "Date",
  transOut.from_warehouse AS "From Place",
  COALESCE(transOut.project, transOut.receiving_project)  AS "To Place",
  item.item_category AS "Major Category",
  item.item_sub_category AS "Item Category",
  item.description AS "Description",
  item.item_code AS "Item Code",
  item.stock_uom AS "Unit",
  transOut.qty  AS "STVList Qty",
  transIn.qty AS "IN QTY",
  transOut.amount AS "Total Cost"
FROM `tabItem` item
INNER JOIN (
  SELECT
    se.name AS "se",
    se.posting_date AS "date",
    se.from_warehouse AS "from_warehouse",
    se.project AS "project",
    se.receiving_project AS "receiving_project",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Issue" AND se.document = "Transfer Out"
  GROUP BY sed.item_code, se.name, se.project, se.receiving_project
) AS transOut ON item.item_code = transOut.item_code
LEFT JOIN (
  SELECT
    se.name AS "se",
    se.transfer_out_no AS "transfer_out_no",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Receipt" AND se.documentt = "Transfer In"
  GROUP BY sed.item_code, se.transfer_out_no
) AS transIn ON transOut.se=transIn.transfer_out_no
WHERE transIn.qty = 0
GROUP BY item.item_code;
