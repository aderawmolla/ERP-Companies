SELECT
    emp.employee AS "ተ.ቁ:Link/Employee",
    emp.employee_name AS "የሰራተኛዉ ስም",
    emp.department AS "ዲፓርትመንት",
    -- Convert date_of_joining to DATE type without specifying the format
    IF(emp.date_of_joining IS NOT NULL, 
        CAST(emp.date_of_joining AS DATE), 
        NULL
    ) AS "የቅጥር ዘመን በኩባንያዉ",

    -- Handle special case for renewal interval
    CASE 
        WHEN emp.የእድሳት_ጊዜ = '1 ዓመት' THEN '12 ወር'
        ELSE emp.የእድሳት_ጊዜ 
    END AS "የእድሳት ጊዜ (ወር)",

    -- Calculate the next renewal date based on date of joining and renewal interval (in months)
    DATE_ADD(
        IF(emp.date_of_joining IS NOT NULL, 
            CAST(emp.date_of_joining AS DATE), 
            NULL
        ), 
        INTERVAL CEIL(DATEDIFF(CURDATE(), 
            IF(emp.date_of_joining IS NOT NULL, 
                CAST(emp.date_of_joining AS DATE), 
                NULL
            )) / 
            (CASE 
                WHEN emp.የእድሳት_ጊዜ = '1 ዓመት' THEN 12
                ELSE TRIM(SUBSTRING_INDEX(emp.የእድሳት_ጊዜ, ' ', 1))
            END * 30)) * 
            (CASE 
                WHEN emp.የእድሳት_ጊዜ = '1 ዓመት' THEN 12
                ELSE TRIM(SUBSTRING_INDEX(emp.የእድሳት_ጊዜ, ' ', 1))
            END) MONTH
    ) AS "Next Renewal Date",

    -- Calculate remaining days until the next renewal
    DATEDIFF(
        DATE_ADD(
            IF(emp.date_of_joining IS NOT NULL, 
                CAST(emp.date_of_joining AS DATE), 
                NULL
            ), 
            INTERVAL CEIL(DATEDIFF(CURDATE(), 
                IF(emp.date_of_joining IS NOT NULL, 
                    CAST(emp.date_of_joining AS DATE), 
                    NULL
                )) / 
                (CASE 
                    WHEN emp.የእድሳት_ጊዜ = '1 ዓመት' THEN 12
                    ELSE TRIM(SUBSTRING_INDEX(emp.የእድሳት_ጊዜ, ' ', 1))
                END * 30)) * 
                (CASE 
                    WHEN emp.የእድሳት_ጊዜ = '1 ዓመት' THEN 12
                    ELSE TRIM(SUBSTRING_INDEX(emp.የእድሳት_ጊዜ, ' ', 1))
                END) MONTH
            ), 
            CURDATE()
        ) AS "Remaining Days",

    -- Calculate remaining months until the next renewal
    FLOOR(DATEDIFF(
        DATE_ADD(
            IF(emp.date_of_joining IS NOT NULL, 
                CAST(emp.date_of_joining AS DATE), 
                NULL
            ), 
            INTERVAL CEIL(DATEDIFF(CURDATE(), 
                IF(emp.date_of_joining IS NOT NULL, 
                    CAST(emp.date_of_joining AS DATE), 
                    NULL
                )) / 
                (CASE 
                    WHEN emp.የእድሳት_ጊዜ = '1 ዓመት' THEN 12
                    ELSE TRIM(SUBSTRING_INDEX(emp.የእድሳት_ጊዜ, ' ', 1))
                END * 30)) * 
                (CASE 
                    WHEN emp.የእድሳት_ጊዜ = '1 ዓመት' THEN 12
                    ELSE TRIM(SUBSTRING_INDEX(emp.የእድሳት_ጊዜ, ' ', 1))
                END) MONTH
            ), 
            CURDATE()) / 30) AS "Remaining Months",
       "_________________" AS "የዲፓርትመንት አጽዳቂዉ ፊርማ"
       


FROM 
    tabEmployee emp
WHERE 
    emp.date_of_joining IS NOT NULL
ORDER BY 
    "Next Renewal Date";