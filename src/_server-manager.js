import { spawn } from "child_process"

export let longestName = 0

// Start server
function startServer(command, args, name) {
  const child = spawn(command, args, {
    detached: false, // Don't detach the child process
  })

  child.stdout.on("data", data => {
    console.info(`${name}: ${data}`)
  })

  child.stderr.on("data", data => {
    console.error(`${name} Error: ${data}`)
  })

  child.on("close", code => {
    console.info(`${name} process exited with code ${code}`)
  })

  return child
}

// Start servers
export async function startServers(SERVERS, BASE_PORT, WARMUP_DELAY) {
  const servers = Object.fromEntries(
    [
      ...SERVERS.sort(
        (a, b) =>
          a.protocol.localeCompare(b.protocol) ||
          a.type.localeCompare(b.type) ||
          a.name.localeCompare(b.name)
      ),
    ].map((config, i) => {
      const port = BASE_PORT + i
      longestName = Math.max(longestName, config.name.length)
      console.info(`Starting ${config.name} on port`, port)
      const ps = startServer(
        config.command,
        [...config.args, port],
        config.name
      )
      return [
        ps.pid,
        {
          ...config,
          port,
          ps,
        },
      ]
    })
  )
  await new Promise(res => setTimeout(res, WARMUP_DELAY))
  return servers
}

function isProcessRunning(servers, pid) {
  try {
    process.kill(pid, 0)
    delete servers[pid]
    return true
  } catch (err) {
    return err.code !== "ESRCH"
  }
}

function shutdownServer(servers, pid) {
  if (isProcessRunning(servers, pid)) {
    try {
      process.kill(pid, "SIGTERM")
    } catch (err) {
      console.error(`Error stopping child process ${pid}`, err)
    }
  }
}

export function shutdownServers(servers) {
  return function () {
    Object.keys(servers).forEach(pid => {
      shutdownServer(servers, pid)
    })
  }
}
