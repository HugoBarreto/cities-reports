WITH p AS
         (SELECT uuid, street, MAX(nthumbsup) + 1 AS interactions, arbitrary(latitude) as latitude,
          arbitrary(longitude) as longitude, MAX(reliability) as reliability, MIN(pub_utc_date) as start_time,
          MAX(pub_utc_date) as end_time 
         FROM pe_lima_waze_alerts
         WHERE ((year=2019 AND month=11 AND day=24 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=25 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=26 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=27 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=28 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=29 AND hour BETWEEN 0 AND 23)
                  OR (year=2019 AND month=11 AND day=30 AND hour BETWEEN 0 AND 23))
              AND city = 'Miraflores'
              AND subtype = 'HAZARD_ON_ROAD_POT_HOLE'
         GROUP BY  uuid, street)
     
SELECT uuid, latitude, longitude, interactions, street, reliability, start_time, end_time,
    ROUND(CAST(interactions AS double) / (SUM(interactions) OVER (PARTITION BY street)), 4) AS share_street,
    SUM(CAST(interactions AS double)) OVER (PARTITION BY street ORDER BY interactions DESC, reliability DESC, start_time) / (SUM(interactions) OVER (PARTITION BY street)) AS cum_share_street
FROM p 
ORDER BY street ASC, interactions DESC