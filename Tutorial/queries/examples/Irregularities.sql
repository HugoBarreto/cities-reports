WITH tmp AS
         (SELECT id, arbitrary(type) as type,            
            MIN(pub_utc_date) AS start_time, MAX(pub_utc_date) AS end_time,
            MIN(detectiondate) AS detectiondate, MAX(length) AS max_length,
            MIN(speed) AS min_speed, MAX(seconds) AS max_seconds,
            MAX(delayseconds) AS max_delayseconds, arbitrary(regularspeed) AS regularspeed,
            MAX(jamlevel) AS jamlevel, bool_or(highway) AS highway,
            MAX(nthumbsup) AS nthumbsup, arbitrary(street) AS street,                                      
            MAX(alertscount) AS alertscount, MAX(driverscount) AS driverscount,
            arbitrary(causetype) AS causetype, arbitrary(causealert) AS causealert,
            arbitrary(line_geojson) AS line_geojson
         FROM uy_montevideo_waze_irregularities
         WHERE city = 'Montevideo'
             AND ((year=2019 AND month=11 AND day=24 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=25 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=26 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=27 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=28 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=29 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=30 AND hour BETWEEN 0 AND 23))              
         GROUP BY id)
       

SELECT *, date_diff('minute', start_time, end_time) AS duration_min    
FROM tmp
ORDER BY start_time