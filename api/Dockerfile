FROM golang

# if left blank app_env will run with dev settings
# to build production image run:
# $ docker build ./api --build-args app_env=production
ARG app_env
ENV APP_ENV $app_env

ADD . /go/src/github.com/McMenemy/GoDoRP_stack/api
WORKDIR /go/src/github.com/McMenemy/GoDoRP_stack/api

RUN go get github.com/McMenemy/GoDoRP_stack/api
RUN go build

RUN export ENV=${ENV}

# if dev setting will use pilu/fresh for code reloading via docker-compose volume sharing with local machine
# if production setting will build binary
CMD if [ ${APP_ENV} = "production" ]; \
	then \
	api; \
	else \
	go get github.com/pilu/fresh && \
	fresh; \
	fi
	
EXPOSE 8080
