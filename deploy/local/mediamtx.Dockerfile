FROM bluenviron/mediamtx:1-ffmpeg

RUN apk add --no-cache bash curl coreutils
COPY deploy/relay/visp-snapshot /usr/local/libexec/visp-snapshot
