SELECT 
  pub_utc_date, year, month, day, hour, uuid, pubmillis, country, city, street, 
  type, subtype, roadtype, longitude, latitude, nthumbsup, reliability, reportrating, 
  confidence, magvar, reportdescription
FROM "cities"."br_xalapa_waze_alerts"
WHERE year = 2019 AND month = 2