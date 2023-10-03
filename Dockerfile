# build stage
FROM	node:18-alpine as build
WORKDIR	/application
COPY	./application/ .
RUN		npm install
RUN		npm run build

# deploy stage
FROM				nginx:stable-alpine
# RUN					rm /etc/nginx/conf.d/default.conf
COPY --from=build	/application/build/ /application/
# COPY 				./transcendence.conf /etc/nginx/conf.d/
EXPOSE				8080

# #TODO: remove
# EXPOSE 8080
# CMD		sleep infinity
