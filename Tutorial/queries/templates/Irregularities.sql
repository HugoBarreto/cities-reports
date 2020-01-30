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
         FROM {table}
         WHERE city = '{city}'
             AND ({date_filter})              
         GROUP BY id)
       

SELECT *, date_diff('minute', start_time, end_time) AS duration_min    
FROM tmp
ORDER BY start_time