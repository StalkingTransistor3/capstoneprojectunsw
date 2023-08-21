# https://stackoverflow.com/questions/31210973/how-do-i-seed-a-mongo-database-using-docker-compose

FROM mongo

COPY spyce.fooditems.json ./spyce.fooditems.json
COPY spyce.tables.json ./spyce.tables.json
COPY spyce.staffs.json ./spyce.staffs.json

CMD mongoimport --host mongo --db spyce --collection fooditems --type json --file /spyce.fooditems.json --jsonArray;\
    mongoimport --host mongo --db spyce --collection tables --type json --file /spyce.tables.json --jsonArray;\
    mongoimport --host mongo --db spyce --collection staffs --type json --file /spyce.staffs.json --jsonArray
