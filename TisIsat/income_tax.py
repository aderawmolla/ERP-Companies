(salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.35-1500 if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>10900 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.30-950 if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>7800 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.15-142.50  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>5250 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.20-302.50  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>3200 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.20-302.50  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>1650else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.10-60  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>600 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)


(salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.35-1500 if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>10900 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.30-950 if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>7800 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.15-142.50  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>5250 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.20-302.50  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>3200 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.20-302.50  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>1650else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
*0.10-60  if (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)
>600 else (salary+housing_allowance+topup_allowance+professional_allowance + transport_allowance+overtime+responsibility_allowance+cash_indeminity+leave_encashment)


IF(K9>10900,K9*35%-1500,IF(K9>7800,K9*30%-955,IF(K9>5250,K9*25%-565,IF(K9>3200,K9*20%-302.5,IF(K9>1650,K9*15%-142.5,IF(K9>600,K9*10%-60,IF(K9<=600,K9*0)))))))