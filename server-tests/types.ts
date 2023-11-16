import { Agent } from "https"

export type ServerConfig = {
  port: number
  protocol: string
  name: string
  testLimit?: number
}


export type FetchOptions = {
  agent?: Agent;
};