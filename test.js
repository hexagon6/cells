import { assertEquals } from 'https://deno.land/std@0.110.0/testing/asserts.ts'
import { delay } from 'https://deno.land/std@0.110.0/async/delay.ts'
import init, {
  random_world,
} from 'https://deno.land/x/cells_wasm@0.2.0/cells_wasm.js'

import * as R from 'https://deno.land/x/ramda@v0.27.2/dist/ramda.js'

https: Deno.test('async hello world', async () => {
  const x = 1 + 2

  // await some async task
  await delay(100)

  if (x !== 3) {
    throw Error('x should be equal to 3')
  }
})

// Simple name and function, compact form, but not configurable
Deno.test('hello world #1', () => {
  const x = 1 + 2
  assertEquals(x, 3)
})

// Fully fledged test definition, longer form, but configurable (see below)
Deno.test({
  name: 'hello world #2',
  fn: () => {
    const x = 1 + 2
    assertEquals(x, 3)
  },
})

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

Deno.test('random world generation', async () => {
  await init().then(() => console.log(random_world()))
})
