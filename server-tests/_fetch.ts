import fetch from "node-fetch"
import { Agent } from "https"
import {FetchOptions} from './types.ts'

export default async (N = 1000, port = 3000, protocol = "http") => {
  const fetchOptions: FetchOptions = {}

  if (protocol === "https") {
    fetchOptions.agent = new Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      minVersion: "TLSv1.3",
      maxVersion: "TLSv1.3",
    })
  }

  const responses = new Array(N).fill(null).map(async () => {
    const res = await fetch(`${protocol}://localhost:${port}`, fetchOptions)
    return await res.text()
  })

  const startTime = process.hrtime.bigint()
  await Promise.all(responses)

  const elapsed = Number(process.hrtime.bigint() - startTime) / 1e9 // Convert nanoseconds to seconds
  return elapsed
}
