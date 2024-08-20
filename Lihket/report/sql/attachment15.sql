SELECT 
allo.department AS "የስር ዘርፍ",
allo.leave_type AS "የዕረፍት አይነት",
COUNT(*)  AS  "የሰራተኞች ብዛት", 
SUM(allo.total_leaves_allocated) AS "የተወሰደው ቀን ብዛት",
NULL AS "ምርመራ"

FROM `tabLeave Allocation` allo

GROUP BY 
allo.department,
allo.leave_type

ORDER BY 
allo.department,
allo.leave_type;





