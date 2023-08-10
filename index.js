import httpServer from "./http-server.js"
import httpsServer from "./https-server.js"
import fetchHttp from "./fetch-http.js"
import fetchHttps from "./fetch-https.js"

const HTTP_PORT = 3000
const HTTPS_PORT = 3001

const servers = [httpServer(HTTP_PORT), httpsServer(HTTPS_PORT)]

console.info("\n**** HTTP servers started ****")

const TESTS = [1, 10]
const REPS = 5

const results = {
  http: {},
  https: {},
}

for (let i = 0; i < REPS; i++) {
  console.info("Test", i + 1, "of", REPS)
  for (const N of TESTS) {
    const httpTiming = await fetchHttp(N, HTTP_PORT)
    console.info(
      `Completed ${N} HTTP requests (port=${HTTP_PORT}) in ${httpTiming} seconds`
    )
    results.http[N] = [...(results.http?.[N] || []), httpTiming]

    const httpsTiming = await fetchHttps(N, HTTPS_PORT)
    console.info(
      `Completed ${N} HTTPS requests (port=${HTTPS_PORT}) in ${httpsTiming} seconds`
    )

    results.https[N] = [...(results.https?.[N] || []), httpsTiming]
  }
}

servers.forEach(closeServer => closeServer())

console.log(results)
