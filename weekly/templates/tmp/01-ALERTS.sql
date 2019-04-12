WITH day AS 
    (WITH p AS
         (SELECT uuid, street, MAX(nthumbsup) + 1 AS interactions, type, subtype, hour
         FROM {table}
         WHERE {date_filters[0]}              
              AND city = '{city}'              
         GROUP BY  uuid, street, type, subtype, hour)
     SELECT street, SUM(interactions) AS interactions_s1, 
       ROUND(CAST(SUM(interactions) AS double)/ (SELECT SUM(interactions) FROM p), 4) AS share_of_total_interactions_s1
     FROM p
     GROUP BY street, type, subtype, hour)

SELECT day.street, share_of_total_interactions_s1, share_of_total_interactions_s2,
       CAST(share_of_total_interactions_s1 AS double) / CAST(share_of_total_interactions_s2 AS double) - 1 AS variation
FROM s1 LEFT JOIN s2 on s1.street=s2.street
ORDER BY  share_of_total_interactions_s1 DESC
{limit}