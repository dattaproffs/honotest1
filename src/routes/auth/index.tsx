import { Hono } from "hono";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { LoginRoute, MyEnv, PostLogin } from "../../components";

const authRenderer = jsxRenderer(({ children, Layout }) => {
    const c = useRequestContext();
    console.log('authRenderer', c.req.raw.headers)
    if ((c.req.header('hx-request') === 'true' && c.req.method === 'GET' && c.req.header('hx-target') === 'body')) {
        return (
            <div>
                <div class="mt-5" id="auth-main-area">
                    {children}
                </div>
            </div>
        )
    } else if (c.req.header('hx-request') === 'true' && c.req.method === 'GET' && c.req.header('hx-target')) {
        return (<>{children}</>)
    } else if (c.req.header('hx-request') === 'true' && c.req.method === 'POST') {
        return (<>{children}</>)
    }
    return (
        <Layout>
            <div>
                <div class="mt-5" id="auth-main-area">
                    {children}
                </div>
            </div>
        </Layout>
    )
}, {
    docType: false
})
const authApp = new Hono<MyEnv>()
authApp.use('*', authRenderer)
authApp.get('/', (c) => {
    return c.redirect('/login')
})

authApp.get('/login', (c) => {
    return c.render(
        <>
            <a href="/auth/register" hx-get="/auth/register" hx-target="#auth-main-area" hx-push-url="true">register</a>
            <LoginRoute />
        </>
    )
})

authApp.get('/register', (c) => {
    return c.render(
        <>
            <a href="/auth/login" hx-get="/auth/login" hx-target="#auth-main-area" hx-push-url="true">login</a>
            <h1>Register</h1>
        </>
    )
})

authApp.post('/login', async (c) => {
    //return c.redirect('/admin/2')
    return await PostLogin({ c })
})


export default authApp