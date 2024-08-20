SELECT
    emp.department AS "የስራ ዘርፍ",
    
    -- Employment Plan
    plan_table.emp_permanent AS "ቅጥር እቅድ ቋሚ",
    plan_table.emp_contract AS "ቅጥር እቅድ ኮንትራት",
    (plan_table.emp_permanent + plan_table.emp_contract) AS "ቅጥር እቅድ ድምር",
    
    -- Performed Employment
    SUM(CASE WHEN emp.employment_type IN ('Permanent', 'ቋሚ') THEN 1 ELSE 0 END) AS "ቅጥር ክንዉን ቋሚ",
    SUM(CASE WHEN emp.employment_type IN ('ኮንትራት', 'Contract') THEN 1 ELSE 0 END) AS "ቅጥር ክንዉን ኮንትራት",
    COUNT(*) AS "ቅጥር ክንዉን ድምር",
    
    -- Promotion Plan
    plan_table.promo_permanent AS "ሹመት እቅድ ቋሚ", -- Assuming the plan is the same as for plan_tableloyment
    plan_table.promo_contract AS "ሹመት እቅድ ኮንትራት",
    (plan_table.promo_permanent + plan_table.promo_contract) AS "ሹመት እቅድ ድምር",
    
    -- Performed Promotion
    promotion.permanent_employee AS "ሹመት ክንዉን ቋሚ",
    promotion.contract_employee AS "ሹመት ክንዉን ኮንትራት",
    (promotion.permanent_employee +  promotion.contract_employee) AS "ሹመት ክንዉን ድምር",
     

    --  transfer plan
    plan_table.trans_permanent AS "ዝውውር እቅድ ቋሚ", -- Assuming the plan is the same as for plan_tableloyment
    plan_table.trans_contract AS "ዝውውር እቅድ ኮንትራት",
    (plan_table.trans_permanent + plan_table.trans_contract) AS "ዝውውር እቅድ ድምር",
    
    -- Performed transfer
    transf.permanent_employee AS "ዝውውር ክንዉን ቋሚ",
    transf.contract_employee AS "ዝውውር ክንዉን ኮንትራት",
    (transf.permanent_employee +  transf.contract_employee) AS "ዝውውር ክንዉን ድምር"



FROM 
    `tabEmployee` emp
LEFT JOIN
    (
     SELECT 
        plan_table.department,
        SUM(plan_table.emp_permanent) AS emp_permanent,
        SUM(plan_table.emp_contract) AS emp_contract,
        SUM(plan_table.promo_permanent) AS promo_permanent,
        SUM(plan_table.promo_contract) AS promo_contract,
        SUM(plan_table.trans_permanent) AS trans_permanent,
        SUM(plan_table.trans_contract) AS trans_contract

     FROM 
        `tabEmployement Plan` plan
     LEFT JOIN 
        `tabEmployment Plan Table` plan_table 
     ON 
        plan.name = plan_table.parent
     WHERE 
        plan.year = %(year)s
     GROUP BY
        plan_table.department
    ) AS plan_table 
ON 
    emp.department = plan_table.department
LEFT JOIN
(
SELECT 
 emp.department AS department,
 SUM(CASE WHEN emp.employment_type IN ('Permanent', 'ቋሚ') THEN 1 ELSE 0 END) AS permanent_employee,
 SUM(CASE WHEN emp.employment_type IN ('ኮንትራት', 'Contract') THEN 1 ELSE 0 END) AS contract_employee
FROM `tabEmployee` emp
LEFT JOIN 
 `tabEmployee Promotion` promo on emp.name=promo.employee
WHERE 
 YEAR(promo.promotion_date)=%(year)s
GROUP BY emp.department
) AS promotion on promotion.department=emp.department
LEFT JOIN(

SELECT 
 emp.department AS department,
 SUM(CASE WHEN emp.employment_type IN ('Permanent', 'ቋሚ') THEN 1 ELSE 0 END) AS permanent_employee,
 SUM(CASE WHEN emp.employment_type IN ('ኮንትራት', 'Contract') THEN 1 ELSE 0 END) AS contract_employee
FROM `tabEmployee` emp
LEFT JOIN 
 `tabEmployee Transfer` transf on emp.name=transf.employee
WHERE 
 YEAR(transf.transfer_date)=%(year)s
GROUP BY emp.department

) AS transf
ON transf.department=emp.department

WHERE
    SUBSTRING_INDEX(emp.date_of_joining, '-', -1) = %(year)s
GROUP BY emp.department
ORDER BY 
    emp.department;
