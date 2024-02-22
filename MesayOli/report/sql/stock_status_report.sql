SELECT 
  sri.item_code AS "Item Code: Link/Item",
  -- pri.item_code AS "Purchase Receipt Item",
  -- transIn.item_code "transfered Item",
  sr.cost_center AS "Project",
  -- sr.purpose AS "Purpose",
  sr.name AS "Stock Reconciliation:Link/Stock Reconciliation",
  NULL AS "Beginning Balance LI",
  SUM(sri.qty) AS "Beginning Balance QTY",
  SUM(sri.amount) AS "Beginning Balance AMOUNT",
  NULL AS "Purchase LI",
  SUM(pri.qty) AS "Purchase QTY",
  SUM(pri.amount) AS "Purchase AMT",
  NULL AS "Manufacturing LI",
  manf.qty AS "Manufacturing QTY",
  manf.amount AS "Manufacturing AMT",
  NULL AS "Transfer In LI",
   transIn.qty AS "Transfer In  QTY",
   transIn.amount AS "Transfer AMT",
  retn.qty AS "Returned QTY",
  retn.amount AS "Returned AMT",
  NULL AS "Issued  LI",
  issued.qty AS "Issued  QTY",
  issued.amount AS "Issued AMT",
  transOut.qty AS "Transfer Out QTY",
  transOut.amount AS "Transfer Out AMT",
  NULl AS "Ending Balance LI",
  COALESCE(SUM(sri.qty), 0) + COALESCE(SUM(pri.qty), 0) + COALESCE(manf.qty, 0) + COALESCE(transIn.qty, 0)-COALESCE(issued.qty, 0)-COALESCE(transOut.qty, 0) AS "Ending Balance QTY",
  COALESCE(SUM(sri.amount), 0) + COALESCE(SUM(pri.amount), 0) + COALESCE(manf.amount, 0) + COALESCE(transIn.amount, 0) - COALESCE(transOut.amount, 0)- COALESCE(transOut.amount, 0) AS "Ending Balance AMT"
FROM
  `tabStock Reconciliation` sr
LEFT JOIN `tabStock Reconciliation Item` sri ON sri.parent = sr.name 
LEFT JOIN `tabPurchase Receipt Item` pri ON sri.item_code = pri.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Receipt" AND se.documentt = "Own Manufacturing"
  GROUP BY 
  sed.item_code
) AS manf ON sri.item_code = manf.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Receipt" AND se.documentt = "Transfer In"
   GROUP BY 
  sed.item_code
) AS transIn ON sri.item_code = transIn.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Receipt" AND se.documentt = "Material Return"
   GROUP BY 
  sed.item_code
) AS retn ON sri.item_code = retn.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Issue" AND se.documentt = "Issue"
   GROUP BY 
  sed.item_code
) AS issued ON sri.item_code = issued.item_code
LEFT JOIN (
  SELECT
    se.name AS "Stock Entry",
    sed.item_code AS "item_code",
    SUM(sed.qty) AS "qty",
    SUM(sed.amount) AS "amount"
  FROM `tabStock Entry` se
  LEFT JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
  WHERE se.purpose = "Material Issue" AND se.documentt = "Transfer Out"
   GROUP BY 
  sed.item_code
) AS transOut ON sri.item_code = transOut.item_code

WHERE 
  YEAR(sr.posting_date) = %(year)s and sr.purpose="Opening Stock"
GROUP BY
  sri.item_code,
  sr.cost_center,
  sr.purpose;
