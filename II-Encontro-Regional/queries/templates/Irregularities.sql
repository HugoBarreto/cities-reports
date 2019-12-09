SELECT pub_utc_date, day, hour, detectiondate, id, 
    street, length, speed, trend, seconds, 
    delayseconds, severity, regularspeed, 
    jamlevel, type, highway, alertscount, 
    driverscount, nimages, ncomments, nthumbsup, 
    causetype, causealert, line_geojson
FROM {table}
WHERE city = '{city}'
    AND ({date_filter})
