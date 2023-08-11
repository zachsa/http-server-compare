import startServer from "./start-server.js"
import fetch from "./fetch.js"

const serversConfig = [
  {
    type: "python",
    command: "python",
    args: ["./servers/http-server.py"],
    name: "Python HTTP Server",
    port: 3000,
    protocol: "http",
  },
  {
    type: "python",
    command: "python",
    args: ["./servers/https-server.py"],
    name: "Python HTTPS Server",
    port: 6001,
    protocol: "https",
  },
  {
    type: "node",
    command: "node",
    args: ["./servers/http-server.js"],
    name: "Node HTTP Server",
    port: 3001,
    protocol: "http",
  },
  {
    type: "node",
    command: "node",
    args: ["./servers/https-server.js"],
    name: "Node HTTPS Server",
    port: 3002,
    protocol: "https",
  },
].sort(({ protocol: a }, { protocol: b }) => {
  if (a > b) return 1
  if (b > a) return -1
  return 0
})

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

const TESTS = [5, 10, 15, 20]
const REPS = 1

const results = {
  http: {},
  https: {},
}

for (let i = 0; i < REPS; i++) {
  console.info("Test", i + 1, "of", REPS)
  for (const N of TESTS) {
    for (const { port, protocol, type } of servers) {
      const timing = (await fetch(N, port, protocol)).toFixed(3)
      const key = `c=${String(N).padStart(3, "0")}`
      console.info(
        `${protocol.padEnd(5, " ")} :: ${type.padEnd(
          6,
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

console.log(JSON.stringify(results))
