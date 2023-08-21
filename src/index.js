import {
  startServers,
  shutdownServers,
  longestName,
} from "./_server-manager.js"
import config from "../config.js"
import doTests from "./_do-tests.js"
const { BASE_PORT, TESTS, REPS, SERVERS, WARMUP_DELAY } = config

let servers = undefined

try {
  servers = await startServers(SERVERS, BASE_PORT, WARMUP_DELAY)

  const RESULTS = await doTests(TESTS, REPS, servers, longestName)
  console.log(JSON.stringify(RESULTS))
} catch (error) {
  console.log("hi", error)
} finally {
  // Register cleanup handlers
  const cleanup = shutdownServers(servers)
  process.on("exit", cleanup)
  process.on("SIGINT", cleanup)
  process.on("SIGTERM", cleanup)

  // Stop all servers started for this test as they are no longer needed
  cleanup()
}
