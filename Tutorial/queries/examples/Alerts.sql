WITH tmp AS
         (SELECT uuid, arbitrary(type) as type, arbitrary(subtype) AS subtype,
            MAX(nthumbsup) + 1 AS interactions, arbitrary(street) AS street,                          
            arbitrary(longitude) AS longitude, arbitrary(latitude) AS latitude,
            MIN(pub_utc_date) AS start_time, MAX(pub_utc_date) AS end_time,
            MAX(reliability) AS reliability, MAX(confidence) AS confidence,
            arbitrary(magvar) AS magvar
         
         FROM ec_quito_waze_alerts
         WHERE city = 'Quito'
             AND ((year=2019 AND month=11 AND day=24 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=25 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=26 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=27 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=28 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=29 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=30 AND hour BETWEEN 0 AND 23))              
         GROUP BY  uuid)
       

SELECT *, date_diff('minute', start_time, end_time) AS duration_min    
FROM tmp
ORDER BY start_time