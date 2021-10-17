import { assertEquals } from 'https://deno.land/std@0.110.0/testing/asserts.ts'
import { delay } from 'https://deno.land/std@0.110.0/async/delay.ts'
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const env = config()

const BASE_ENDPOINT = env.BASE_ENDPOINT || 'http://0.0.0.0:8000/'

const Post = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
  return response.json()
}

Deno.test('json fetch', async () => {
  const res = await Post(`${BASE_ENDPOINT}json`, {
    message: 3,
  })
  assertEquals(res, { message: 3 })
})

Deno.test('world fetch', async () => {
  const res = await Post(`${BASE_ENDPOINT}world`)
  assertEquals(res.x, 9)
  assertEquals(res.y, 9)
  assertEquals(res.cells.length, 9 * 9)
})
