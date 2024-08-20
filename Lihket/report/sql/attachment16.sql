SELECT 
emp.department AS "ዘርፍ/አገልግሎ",
COUNT(*) AS "ጠቅላላ የሰራተኛ ብዛት",
SUM(CASE WHEN emp.የጡረታ__መለያ_ቁጥር="" THEN 0 else 1  END) AS  "የጡረታ ቁጥር ያላቸው",
SUM (CASE WHEN emp.የጡረታ__መለያ_ቁጥር ="" THEN 1 else 0 END ) AS "የጡረታ ቁጥር የሌላቸው ብዛት",
NULL AS "ምርምር"

FROM `tabEmployee` emp
GROUP BY 
emp.department
ORDER BY 
emp.department;






