import { Agent } from "https"
import fetch from "node-fetch"

export default async (N = 1000, port = 3000) => {
  const responses = new Array(N).fill(null).map(async () => {
    const res = await fetch(`https://localhost:${port}`, {
      agent: new Agent({
        rejectUnauthorized: false,
      }),
    })
    return await res.text()
  })

  const startTime = process.hrtime.bigint()
  await Promise.all(responses)

  const elapsed = Number(process.hrtime.bigint() - startTime) / 1e9 // Convert nanoseconds to seconds
  return elapsed
}
