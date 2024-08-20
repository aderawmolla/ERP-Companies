SELECT 
emp.designation AS "ዘርፍ/አገልግሎት",
COUNT(*) AS "የሰው ሀይል ብዛት",
SUM(uniform.ዋጋ) AS "የተከፈለ ገንዘብ መጠን",
NULL  AS "ምርመራ"

FROM `tabEmployee` emp
LEFT JOIN 
 `tabUniform registration form` as uniform on uniform.parent=emp.name

GROUP BY 
emp.designation
ORDER BY 
emp.designation;


   