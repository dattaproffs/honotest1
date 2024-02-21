import { Context } from 'hono'
import { html } from 'hono/html'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import type { BlankInput, MiddlewareHandler } from 'hono/types'

export type MyEnv = {
	Variables: {},
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
      <body>
          ${children}
      </body>
    </html>
  `
})

export const mainRenderer = jsxRenderer(({ children, Layout }) => {
            const c = useRequestContext();
            if(c.req.path.startsWith('/admin')) {
                return (<Layout>{children}</Layout>)
            }
            return (
                <Layout>
                    <div>
                        <nav>
                            <ul hx-boost="true" hx-target="#main-area">
                                <li><a href="/">home</a></li>
                                <li><a href="/page1">page1</a></li>
                                <li><a href="/page2">page2</a></li>
                                <li><a href="/login">Login</a></li>
                            </ul>
                        </nav>
                        <div class="mt-5" id="main-area">
                            {children}
                        </div>
                    </div>
                </Layout>
            )})


    export const adminMainRenderer = jsxRenderer(({ children, Layout }) => {
        const c = useRequestContext();
        console.log('admin layout', c.req.raw.headers)
        if(c.req.raw.headers.has('hx-request')) {
            return (<>{children}</>)
        }
        return (
            <Layout>
                <div>
                    <h1>Admin</h1>
                    <nav>
                        <ul hx-boost="true" hx-target="#main-area">
                            <li><a href="/admin">admin home</a></li>
                            <li><a href="/admin/page1">admin page1</a></li>
                            <li><a href="/admin/page2">admin page2</a></li>
                            <li><a href="/admin/logout">Logout</a></li>
                        </ul>
                    </nav>
                    <div class="mt-5" id="main-area">
                        {children}
                    </div>
                </div>
            </Layout>
        )}, {
            docType: false
        })

export const LoginRoute = () => {
    return (
        <LoginForm />
    )
}


const LoginForm = ({message} : {message?:string}) => {
    return (
        <>
        <form action="/login" method="POST" hx-post="/login" hx-target="this" hx-swap="outerHTML">
        {message && (<p>message: {message}</p>)}
            <input  type="text" name="username" id="username" placeholder='username' />
            <button type='submit'>Login</button>
        </form>
        </>
    )
}

export const PostLogin = async ({c} : {c:Context<MyEnv, string, BlankInput>}) => {
    //const c = useRequestContext<MyEnv>();
    const hasHtmx = c.req.raw.headers.has('hx-request')
    const formData = await c.req.formData();
    const username = formData.get('username');
    console.log('username', username)
    if(hasHtmx) {
        console.log('hasHtmx')
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
        return c.html(<LoginForm message={"Could not login"} />)
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