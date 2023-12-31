import fetch from "./_fetch.ts"
import { ServerConfig } from "./types.ts"

export default async function (TESTS, REPS, data, longestName) {
  const RESULTS = {}
  for (let i = 0; i < REPS; i++) {
    console.info(`\nTest ${i + 1} of ${REPS}`)

    for (const N of TESTS) {
      console.info(` ==> C=${String(N).padStart(3, "0")}`)

      for (const { port, protocol, name, testLimit = NaN } of Object.values(
        data as Record<string, ServerConfig>
      )) {
        if (!isNaN(testLimit) && N > testLimit) continue

        const timing = (await fetch(N, port, protocol)).toFixed(3)
        const key = `c=${String(N).padStart(3, "0")}`

        console.info(
          `${name.padEnd(longestName + 1, " ")} :: ${key} :: ${timing} seconds`
        )
        if (!RESULTS[key]) RESULTS[key] = {}
        if (!RESULTS[key][protocol]) RESULTS[key][protocol] = {}
        if (!RESULTS[key][protocol][name]) RESULTS[key][protocol][name] = {}
        RESULTS[key][protocol][name].values = [
          ...(RESULTS[key][protocol][name].values || []),
          timing,
        ]
      }
    }
  }

  console.info()
  return RESULTS
}
