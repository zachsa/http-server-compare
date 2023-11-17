import { transform } from "esbuild"
import tsconfigRaw from "../tsconfig.json" assert { type: "json" }

export async function load(url, ctx, next) {
  if (url.endsWith(".ts")) {
    const { source, format } = await next(url, { ...ctx, format: "module" })
    const { code } = await transform(source, {
      loader: "ts",
      tsconfigRaw: tsconfigRaw,
    })
    return { source: code, format }
  }
  return await next(url, ctx)
}
