import { Context } from 'hono'
import { html } from 'hono/html'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import type { BlankInput, MiddlewareHandler } from 'hono/types'

export type MyEnv = {
	Variables: {
        frontend: boolean
    },
	Bindings: {
		TEST: string
	}
}

export const rootRenderer = jsxRenderer(({ children }) => {
    return html`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>pseudo hono htmx</title>
      </head>
      <body id="body">
          ${children}
      </body>
    </html>
  `
})

export const LoginRoute = () => {
    return (
        <LoginForm />
    )
}


const LoginForm = ({message} : {message?:string}) => {
    return (
        <>
        <form method="POST" hx-post="/auth/login" hx-target="this" hx-swap="outerHTML">
        {message && (<p>message: {message}</p>)}
            <input  type="text" name="username" id="username" placeholder='username' />
            <button type='submit'>Login</button>
        </form>
        </>
    )
}

export const PostLogin = async ({c} : {c:Context<MyEnv, string, BlankInput>}) => {
    //const c = useRequestContext<MyEnv>();
    const formData = await c.req.formData();
    const username = formData.get('username');
    console.log('username', username)
    if(c.var.frontend) {
        if(username === "admin") {
            c.header('HX-Location', '{"path":"/admin"}') 
            return c.html(<></>)
        }
        if(username === "admin2") {
            c.header('HX-Location', '{"path":"/admin/2"}') 
            return c.html(<></>)
        }
        if(username === "admin3") {
            c.header('HX-Location', '{"path":"/admin/2"}');
            return c.html(<></>)
        }
        return c.render(<LoginForm message={"Could not login"} />)
    }

    if(username === "admin")
        return c.redirect('/admin')
    if(username === "admin2")
        return c.redirect('/admin/2')
    if(username === "admin3") {
        return c.redirect('/admin/2')
    }
    return c.render(<LoginForm message={"Could not login"} />)
}