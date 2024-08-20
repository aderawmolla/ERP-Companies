 -- Promotion Plan
    emp.promo_permanet AS "ሹመት እቅድ ቋሚ", -- Assuming the plan is the same as for employment
    emp.promot_contract AS "ሹመት እቅድ ኮንትራት",
    (emp.promo_permanet + emp.promot_contract) AS "ሹመት እቅድ ድምር",
    
    -- Performed Promotion
    COUNT(p_permanent.promotion_id) AS "ሹመት ክንዉን ቋሚ",
    COUNT(p_contract.promotion_id) AS "ሹመት ክንዉን ኮንትራት",
    (COUNT(p_permanent.promotion_id) + COUNT(p_contract.promotion_id)) AS "ሹመት ክንዉን ድምር",
    
    -- Transfer Plan
    emp.trans_permanet AS "ዝውውር እቅድ ቋሚ", -- Assuming the plan is the same as for employment
    emp.trans_contract AS "ዝውውር እቅድ ኮንትራት",
    (emp.trans_permanet + emp.trans_contract) AS "ዝውውር እቅድ ድምር",
    
    -- Performed Transfer
    COUNT(t_permanent.transfer_id) AS "ዝውውር ክንዉን ቋሚ",
    COUNT(t_contract.transfer_id) AS "ዝውውር ክንዉን ኮንትራት",
    (COUNT(t_permanent.transfer_id) + COUNT(t_contract.transfer_id)) AS "ዝውውር ክንዉን ድምር"



    LEFT JOIN 
   `tabEmployee Promotion` ep 
LEFT JOIN 
`tabEmployee Transfer` et
LEFT JOIN
`tabEmployement Plan` plan
LEFT JOIN
`tabEmployment Plan Table` plan_table