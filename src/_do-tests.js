import fetch from "./_fetch.js"

export default async function (TESTS, REPS, servers, longestName) {
  const RESULTS = { http: {}, https: {} }
  for (let i = 0; i < REPS; i++) {
    console.info(`\nTest ${i + 1} of ${REPS}`)

    for (const N of TESTS) {
      console.info(` ==> C=${String(N).padStart(3, "0")}`)

      for (const {
        port,
        protocol,
        type,
        name,
        testLimit = NaN,
      } of Object.values(servers)) {
        if (!isNaN(testLimit) && N > testLimit) continue

        const timing = (await fetch(N, port, protocol)).toFixed(3)
        const key = `c=${String(N).padStart(3, "0")}`

        console.info(
          `${name.padEnd(
            longestName + 1,
            " "
          )} :: ${key} requests :: in ${timing} seconds`
        )

        RESULTS[protocol][type] = RESULTS[protocol][type] || {}
        RESULTS[protocol][type][key] = [
          ...(RESULTS[protocol][type][key] || []),
          timing,
        ]
      }
    }
  }

  console.info()
  return RESULTS
}
