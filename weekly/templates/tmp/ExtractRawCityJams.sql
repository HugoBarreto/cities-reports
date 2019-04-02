SELECT 
  pub_utc_date, year, month, day, hour, uuid, country, city, street,
  length, level, speedkmh, speed, delay, line, 
  roadtype, startnode, endnode, turntype, type, segments
FROM "cities"."br_xalapa_waze_jams"
WHERE year = 2019 AND month = 2