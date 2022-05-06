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

  if (pathname.startsWith('/html')) {
    const html = `<html>
      <p><b>Message:</b> Hello from Deno Deploy.</p>
      </html>`

    return new Response(html, {
      headers: {
        // The interpretation of the body of the response by the client depends
        // on the 'content-type' header.
        // The "text/html" part implies to the client that the content is HTML
        // and the "charset=UTF-8" part implies to the client that the content
        // is encoded using UTF-8.
        'content-type': 'text/html; charset=UTF-8',
      },
    })
  }

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

  if (pathname.startsWith('/json')) {
    if (request.method === 'POST') {
      if (request.headers.get('Content-Type') === 'application/json') {
        const j = await request.json()
        // Use stringify function to convert javascript object to JSON string.
        const json = JSON.stringify({
          message: j.message,
        })
        return new Response(json, {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
          },
        })
      }
    }

    console.log('And now, to something completely different')
    return new Response(JSON.stringify({ error: 'no body' }), {
      status: 400,
      statusText: 'Bad Request',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  return new Response(
    `<body
      align="center"
      style="font-family: Avenir, Helvetica, Arial, sans-serif; font-size: 1.5rem;"
    >
      <h1>Return JSON and/or HTML Example</h1>
      <p>
        <a href="/html">/html</a> - responds with HTML to the request.
      </p>
      <p>
        <a href="/json">/json</a> - responds with JSON to the request.
      </p>
    </body>`,
    {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
    }
  )
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const options = { addr: `0.0.0.0:${PORT}` }
serve(handleRequest, options)
