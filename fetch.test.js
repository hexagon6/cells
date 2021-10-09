import { assertEquals } from 'https://deno.land/std@0.110.0/testing/asserts.ts'
import { delay } from 'https://deno.land/std@0.110.0/async/delay.ts'

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
  const res = await Post('http://0.0.0.0:8080/json', {
    message: 2,
  })
  assertEquals(res, { message: 2 })
})
