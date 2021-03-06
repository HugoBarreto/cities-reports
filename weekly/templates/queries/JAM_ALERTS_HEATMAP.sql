WITH p AS
         (SELECT uuid, street, MAX(nthumbsup) + 1 AS interactions, arbitrary(latitude) as latitude,
          arbitrary(longitude) as longitude, MAX(reliability) as reliability, MIN(pub_utc_date) as start_time,
          MAX(pub_utc_date) as end_time 
         FROM {table}
         WHERE ({date_filter})
              AND city = '{city}'
              AND type = 'JAM'
         GROUP BY  uuid, street)
     
SELECT uuid, latitude, longitude, interactions, street, reliability, start_time, end_time,
    ROUND(CAST(interactions AS double) / (SUM(interactions) OVER (PARTITION BY street)), 4) AS share_street,
    SUM(CAST(interactions AS double)) OVER (PARTITION BY street ORDER BY interactions DESC, reliability DESC, start_time) / (SUM(interactions) OVER (PARTITION BY street)) AS cum_share_street
FROM p 
ORDER BY street ASC, interactions DESC
