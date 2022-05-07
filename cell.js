import { serve } from 'https://deno.land/std@0.114.0/http/server.ts'
import init, {
  random_world,
  run_game_of_life,
} from 'https://deno.land/x/cells_wasm@0.4.0/cells_wasm.js'

const PORT = Deno.env.get('PORT') || 8000
let w = null
await init().then(() => (w = random_world))

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    // const origin = request.headers.get('origin')
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': 600,
      },
    })
  }

  const { pathname } = new URL(request.url)

  if (pathname.startsWith('/world')) {
    const [, , dim] = pathname.split('/')
    const [x, y] = dim.split('x')
    const X = typeof x !== 'undefined' ? x : 9
    const Y = typeof y !== 'undefined' ? y : 9
    const world = w(X, Y)

    return new Response(JSON.stringify({ ...world }), {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  if (pathname.startsWith('/gol')) {
    if (request.method === 'POST') {
      if (request.headers.get('Content-Type') === 'application/json') {
        const world = await request.json()
        const new_world = run_game_of_life(world)
        return new Response(JSON.stringify(new_world), {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    }
  }

  return new Response(
    `<body
      align="center"
      style="font-family: Avenir, Helvetica, Arial, sans-serif; font-size: 1.5rem;"
    >
      <h1>API for cells.js</h1>
      <p>
        <a href="/world/10x10">GET /world/10x10</a> - responds with a random world of size x = 10 and y = 10 in JSON format to the request.
      </p>
      <p>
        <a href="/gol">POST /gol</a> - post a world, this endpoint responds with the next step of a Game of Life simulation in JSON format to the request.
      </p>
    </body>`,
    {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
    }
  )
}

const options = { addr: `0.0.0.0:${PORT}` }
serve(handleRequest, options)
