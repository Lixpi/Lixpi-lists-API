FROM golang

RUN mkdir -p /go/src/lixpi-lists

ADD . /go/src/lixpi-lists

RUN curl https://glide.sh/get | sh
RUN go get  github.com/canthefason/go-watcher
RUN go install github.com/canthefason/go-watcher/cmd/watcher

RUN cd /go/src/lixpi-lists && glide install

ENTRYPOINT  watcher -run lixpi-lists/todo/cmd -watch lixpi-lists/todo
