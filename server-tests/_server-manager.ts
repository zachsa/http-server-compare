import { spawn } from "child_process"

export let longestName = 0

// Start server
function startServer(command, args, name) {
  const child = spawn(command, args, {
    detached: true, // This allows for the case where the child process also spawns child processes/threads
  })

  child.stdout.on("data", data => {
    console.info(`${name}: ${data}`)
  })

  child.stderr.on("data", data => {
    console.error(`${name} Error: ${data}`)
  })

  child.on("close", code => {})

  return child
}

// Start servers
export async function startServers(SERVERS, BASE_PORT, WARMUP_DELAY) {
  const servers = Object.fromEntries(
    [
      ...SERVERS.sort(
        (a, b) =>
          a.protocol.localeCompare(b.protocol) || a.name.localeCompare(b.name)
      ),
    ].map((config, i) => {
      const port = BASE_PORT + i
      longestName = Math.max(longestName, config.name.length)
      const ps = startServer(
        config.command,
        [...config.args, port],
        config.name
      )
      console.info(`Started ${config.name} on port`, port, `ps`, ps.pid)
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
  console.info(
    `Waiting ${WARMUP_DELAY / 1000} seconds for servers to settle...`
  )
  await new Promise(res => setTimeout(res, WARMUP_DELAY))
  return servers
}

function isProcessRunning(servers, pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (err) {
    return err.code !== "ESRCH"
  }
}

function shutdownServer(servers, pid) {
  if (isProcessRunning(servers, pid)) {
    const r = process.kill(-pid, "SIGTERM")
    delete servers[pid]
  }
}

export function shutdownServers(servers) {
  return function () {
    Object.keys(servers).forEach(pid => {
      try {
        shutdownServer(servers, pid)
      } catch (e) {
        console.error(`Error stopping child process ${pid}`, e)
      }
    })
  }
}
