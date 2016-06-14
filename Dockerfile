FROM alpine:3.3

MAINTAINER Jesse <dev@wsgeorge.com>
ENV BUILD_PAKS ruby-dev build-base make libffi-dev 
RUN echo 'gem: --no-rdoc --no-ri' > /etc/gemrc
RUN apk update && apk upgrade && apk --update add \
    bash ruby ruby-bundler $BUILD_PAKS
RUN gem install kramdown jekyll json 
RUN apk add nano
ENTRYPOINT ["/bin/bash"]
WORKDIR home