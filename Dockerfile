FROM oven/bun:latest
WORKDIR /app
COPY . .
EXPOSE 3001
CMD ["bun", "run", "server.ts"]
