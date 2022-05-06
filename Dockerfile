FROM denoland/deno:1.21.2

USER deno

COPY cell.js .

ENV PORT=8000

ENTRYPOINT deno run --allow-read --allow-env=PORT --allow-net=:${PORT},deno.land --watch cell.js --allow-hrtime
