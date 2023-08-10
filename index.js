import startServer from "./start-server.js"
import fetch from "./fetch.js"

const serversConfig = [
  {
    type: "python",
    command: "python",
    args: ["./servers/http-server.py"],
    name: "Python HTTP Server",
    port: 11000,
    protocol: "http",
  },
  {
    type: "node",
    command: "node",
    args: ["./servers/http-server.js"],
    name: "Node HTTP Server",
    port: 11001,
    protocol: "http",
  },
  {
    type: "node",
    command: "node",
    args: ["./servers/https-server.js"],
    name: "Node HTTPS Server",
    port: 11002,
    protocol: "https",
  },
]

const servers = serversConfig.map(config => ({
  ...config,
  childProcess: startServer(
    config.command,
    [...config.args, config.port],
    config.name
  ),
}))

// Give servers time to start
await new Promise(res => setTimeout(res, 1000))

const TESTS = [1, 5]
const REPS = 5

const results = {
  http: {},
  https: {},
}

for (let i = 0; i < REPS; i++) {
  console.info("Test", i + 1, "of", REPS)
  for (const N of TESTS) {
    for (const { port, protocol, type } of servers) {
      const timing = await fetch(N, port, protocol)
      console.info(
        `Completed ${N} HTTP requests (port=${port}) in ${timing} seconds`
      )
      results[protocol][type] = results[protocol][type] || {}
      results[protocol][type][N] = [
        ...(results[protocol]?.[type]?.[N] || []),
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
      return false
    }
    throw err
  }
}

function killAllChildProcesses() {
  servers.forEach(({ childProcess }) => {
    if (isProcessRunning(childProcess.pid)) {
      try {
        process.kill(-childProcess.pid) // Kill the entire group of the child process
      } catch (error) {
        console.error(`Failed to kill process ${childProcess.pid}:`, error)
      }
    }
  })
}

// Handlers to kill child processes when the main process exits
process.on("exit", killAllChildProcesses)
process.on("SIGINT", killAllChildProcesses) // Handles Ctrl+C
process.on("SIGTERM", killAllChildProcesses) // Handles `kill <pid>`

killAllChildProcesses()

console.log(JSON.stringify(results, null, 2))
