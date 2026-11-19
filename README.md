# Hireonix
Hireonix is an AI-powered platform for placement preparation that combines resume analysis, aptitude tests, coding assessments, and mock interview simulations. It uses NLP and speech processing to provide personalized feedback, performance analytics, and readiness scores, helping students improve skills and succeed in campus placements.

## Logs and Grafana

The Compose stack includes Grafana, Loki, and Promtail. Promtail collects stdout and stderr from the Compose containers, Loki stores the logs, and Grafana provisions the `Hireonix Logs and Errors` dashboard automatically.

Start the complete stack after starting Docker Desktop:

```bash
docker compose up -d --build
```

Open Grafana at `http://localhost:3001` with the default local-development credentials `admin` / `admin`. Change the password through `GRAFANA_ADMIN_PASSWORD` before using this outside local development.

The dashboard includes an error count, an error timeline, filtered application errors, and all container logs. The server emits structured JSON logs and records failed API responses, HTTP errors, unhandled exceptions, and unhandled promise rejections.

## Laptop hosting with a Hostinger domain and Cloudflare Tunnel

The application can run on your laptop while Cloudflare provides the public HTTPS domain. This requires Docker Desktop and `cloudflared` to remain running whenever the site is online.

1. Add your Hostinger domain to Cloudflare and replace the Hostinger nameservers with the nameservers Cloudflare provides.
2. Start Hireonix locally:

	```bash
	docker compose up -d --build
	```

3. Create two Cloudflare Tunnel hostnames:

	```text
	your-domain.com       -> http://localhost:3000
	api.your-domain.com   -> http://localhost:4000
	```

4. Set the ignored local environment files before rebuilding:

	`client/.env`

	```env
	VITE_BACKEND_URL=https://api.your-domain.com
	```

	`server/.env`

	```env
	CORS_ORIGINS=https://your-domain.com
	JWT_SECRET=replace-with-a-long-random-secret
	MONGODB_URL=mongodb://host.docker.internal:27017
	```

Use a remote MongoDB service such as MongoDB Atlas for production. Do not commit either `.env` file. A laptop-hosted site is unavailable when the laptop, Docker Desktop, internet connection, or tunnel is stopped.

GitHub stores the source code, but it does not automatically run this Docker stack. After pulling code updates, rebuild locally with `docker compose up -d --build`.
