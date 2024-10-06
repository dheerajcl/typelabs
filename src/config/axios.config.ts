import Axios from 'axios'
import { env } from 'root/env'

export const axios = Axios.create({
  baseURL: env.SERVER_URL,
  timeout: 10000,
})
