WITH timePeriod AS 
    (
     WITH tmp AS
         (SELECT uuid, street, type, subtype, MAX(nthumbsup) + 1 AS interactions
         FROM {table}
         WHERE city = '{city}'
             AND ({date_filters}              )              
         GROUP BY  uuid, type, subtype, street)
    
     SELECT type, subtype, street, SUM(interactions) AS interactions
     FROM tmp
     GROUP BY type, subtype, street
     ORDER BY type, subtype
    )

SELECT *, 
      ROUND(CAST(interactions AS double) / (SUM(interactions) OVER (PARTITION BY type)), 4) AS share_type,
      ROUND(CAST(interactions AS double) / (SUM(interactions) OVER (PARTITION BY type, subtype)), 4) AS share_subtype
FROM timePeriod
ORDER BY type, subtype, interactions DESC