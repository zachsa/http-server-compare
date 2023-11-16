import {
  startServers,
  shutdownServers,
  longestName,
} from "./_server-manager.ts"
import config from "../config.json" assert { type: "json" }
import doTests from "./_do-tests.ts"
const { BASE_PORT, TESTS, REPS, SERVERS, WARMUP_DELAY } = config
import { writeFile } from "fs/promises"

let servers = undefined

try {
  servers = await startServers(SERVERS, BASE_PORT, WARMUP_DELAY)

  const RESULTS = await doTests(TESTS, REPS, servers, longestName)

  // Write the data
  await writeFile("assets/results.json", JSON.stringify(RESULTS, null, 2), {
    encoding: "utf8",
    mode: 0o777,
  })
} catch (error) {
  console.error("An error occurred! Oh no...", error)
} finally {
  // Register cleanup handlers
  const cleanup = shutdownServers(servers)
  process.on("exit", cleanup)
  process.on("SIGINT", cleanup)
  process.on("SIGTERM", cleanup)

  // Stop all servers started for this test as they are no longer needed
  cleanup()
}
