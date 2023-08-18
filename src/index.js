import fetch from "./_fetch.js"
import spawn from "./_spawn.js"
import _servers from "../servers.js"

const BASE_PORT = 7100
const TESTS = [10, 30]
const REPS = 1

// Sort the servers by protocol
const servers = _servers.sort(({ protocol: a }, { protocol: b }) =>
  a.localeCompare(b)
)

let longestName = 0

const activeServers = servers.map((config, i) => {
  const port = BASE_PORT + i
  console.info(`Starting ${config.name} on port`, port)

  longestName = Math.max(longestName, config.name.length)

  return {
    ...config,
    port,
    childProcess: spawn(config.command, [...config.args, port], config.name),
  }
})

// Wait for servers to start
await new Promise(res => setTimeout(res, 1000))

const results = { http: {}, https: {} }

console.info()
for (let i = 0; i < REPS; i++) {
  console.info(`Test ${i + 1} of ${REPS}`)
  for (const N of TESTS) {
    console.info(` ==> C=${String(N).padStart(3, "0")}`)
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
        ...(results[protocol][type][key] || []),
        timing,
      ]
    }
  }
}

console.info()

const isProcessRunning = pid => {
  try {
    process.kill(pid, 0)
    return true
  } catch (err) {
    return err.code !== "ESRCH"
  }
}

const killChildProcess = pid => {
  if (isProcessRunning(pid)) {
    try {
      process.kill(pid, "SIGTERM")
    } catch (err) {
      console.error(`Error stopping child process ${pid}`, err)
    }
  }
}

const killAllChildProcesses = () => {
  activeServers.forEach(({ childProcess }) => {
    killChildProcess(childProcess.pid)
  })
}

// Handlers to kill child processes when the main process exits
process.on("exit", killAllChildProcesses)
process.on("SIGINT", killAllChildProcesses)
process.on("SIGTERM", killAllChildProcesses)

killAllChildProcesses()

console.log(JSON.stringify(results))
