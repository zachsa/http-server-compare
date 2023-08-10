import { spawn } from "child_process"

export default (command, args, name) => {
  const child = spawn(command, args, {
    detached: true, // Detach the child process
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

  child.unref() // Unreference the child process

  return child
}
