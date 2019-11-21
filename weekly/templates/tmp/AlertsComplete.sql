WITH tmp AS
    (SELECT uuid, arbitrary(type) as type, arbitrary(subtype) AS subtype,
    MAX(nthumbsup) + 1 AS interactions, arbitrary(street) AS street,                          
    arbitrary(longitude) AS longitude, arbitrary(latitude) AS latitude,
    MIN(pub_utc_date) AS start_time, MAX(pub_utc_date) AS end_time,
    MAX(reliability) AS reliability, MAX(confidence) AS confidence,
    arbitrary(magvar) AS magvar
    FROM {table}
    WHERE city = '{city}'
        AND ({date_filter})              
    GROUP BY  uuid)         

SELECT *, date_diff('minute', start_time, end_time) AS duration_min
FROM tmp
ORDER BY start_time

-- Missing reportrating, roadtype, reportdescription