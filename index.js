import startServer from "./start-server.js"
import fetch from "./fetch.js"
import _servers from "./servers.js"

const BASE_PORT = 5800
const TESTS = [100, 1000]
const REPS = 1

const servers = _servers.sort(({ protocol: a }, { protocol: b }) => {
  if (a > b) return 1
  if (b > a) return -1
  return 0
})

let longestName = 0
const activeServers = servers.map((config, i) => {
  const port = BASE_PORT + i
  console.info(`Starting ${config.name} on port`, port)
  longestName =
    Math.max(longestName, config.name.length) > longestName
      ? config.name.length
      : longestName
  return {
    ...config,
    port,
    childProcess: startServer(
      config.command,
      [...config.args, port],
      config.name
    ),
  }
})

// Give servers time to start
await new Promise(res => setTimeout(res, 1000))

const results = {
  http: {},
  https: {},
}

for (let i = 0; i < REPS; i++) {
  console.info("Test", i + 1, "of", REPS)
  for (const N of TESTS) {
    for (const { port, protocol, type, name } of activeServers) {
      const timing = (await fetch(N, port, protocol)).toFixed(3)
      const key = `c=${String(N).padStart(3, "0")}`
      console.info(
        `${name.padEnd(
          longestName + 1,
          " "
        )} :: ${key} requests :: in ${timing} seconds`
      )
      results[protocol][type] = results[protocol][type] || {}
      results[protocol][type][key] = [
        ...(results[protocol]?.[type]?.[key] || []),
        timing,
      ]
    }
  }
}

function isProcessRunning(pid) {
  try {
    // Attempt to send a signal 0 (does nothing but throws an error if process doesn't exist)
    process.kill(pid, 0)
    return true
  } catch (err) {
    if (err.code === "ESRCH") {
      return false // Process is not running
    }
    throw err // Unexpected error, rethrow it
  }
}

function killChildProcess(pid) {
  if (isProcessRunning(pid)) {
    try {
      // Kill the entire group of the child process
      process.kill(-pid, "SIGTERM")
    } catch (err) {
      if (err.code !== "ESRCH") {
        console.error(`Error stopping child process ${pid}`, err)
      } else {
        console.warn(`Child process ${pid} already exited.`)
      }
    }
  }
}

function killAllChildProcesses() {
  activeServers.forEach(({ childProcess }) => {
    killChildProcess(childProcess.pid)
  })
}

// Handlers to kill child processes when the main process exits
process.on("exit", killAllChildProcesses)
process.on("SIGINT", killAllChildProcesses) // Handles Ctrl+C
process.on("SIGTERM", killAllChildProcesses) // Handles `kill <pid>`

killAllChildProcesses()

console.log(JSON.stringify(results))