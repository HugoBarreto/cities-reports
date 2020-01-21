SELECT pub_utc_date, day, hour, detectiondate, id, 
    street, length, speed, trend, seconds, 
    delayseconds, severity, regularspeed, 
    jamlevel, type, highway, alertscount, 
    driverscount, nimages, ncomments, nthumbsup, 
    causetype, causealert, line_geojson
FROM mx_xalapa_waze_irregularities    
WHERE city = 'Xalapa'
  AND (year=2019 AND month=11 AND day BETWEEN 24 AND 30)