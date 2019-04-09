WITH p AS
         (SELECT uuid, street, MAX(nthumbsup) + 1 AS interactions, arbitrary(latitude) as latitude,
          arbitrary(longitude) as longitude
         FROM {table}
         WHERE {date_filters[0]}              
              AND city = '{city}'
              AND subtype = 'HAZARD_ON_ROAD_POT_HOLE'
         GROUP BY  uuid, street)
     
SELECT uuid, latitude, longitude, interactions, street
FROM p 
WHERE street IN 
    (
        SELECT street
        FROM 
            (SELECT street, SUM(interactions) AS interactions
            FROM p
            GROUP BY street
            ORDER BY interactions DESC)
        {limit}
    )