import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { MyEnv } from "../../components";
import type { Child } from 'hono/jsx';

const SiteLayout = ({ children }: { children: Child | undefined }) => {
    return (
        <div>
                <nav>
                    <ul hx-boost="true" hx-target="#main-area">
                        <li><a href="/">home</a></li>
                        <li><a href="/page1">page1</a></li>
                        <li><a href="/page2">page2</a></li>
                        <li><a href="/auth/login" hx-target="#body">Login</a></li>
                    </ul>
                </nav>
                <div class="mt-5" id="main-area">
                    {children}
                </div>
            </div>
    )
}

export const mainRenderer = jsxRenderer(({ children, Layout }) => {
    const c = useRequestContext();
    console.log('mainRenderer', c.req.raw.headers)
    if ((c.req.header('hx-request') === 'true' && c.req.method === 'GET' && c.req.header('hx-target') === 'body')) {
        return (
            <SiteLayout children={children} />
        )
    } else if (c.req.header('hx-request') === 'true' && c.req.method === 'GET' && c.req.header('hx-target')) {
        return (<>{children}</>)
    }
    return (
        <Layout>
            <SiteLayout children={children} />
        </Layout>
    )
}, {
    docType: false
})

const siteApp = new Hono<MyEnv>()

siteApp.use('*', mainRenderer)

siteApp.get('/', async (c) => {
    return c.render(
        <div>
            <h3>Hello todo</h3>
            <a href="/test" hx-get="/test" hx-target="#todo">test</a>
            <div id="todo"></div>
        </div>
    )
})

siteApp.get('/page1', (c) => {
    return c.render(
        <h3>PAGE 1</h3>
    )
})

siteApp.get('/page2', (c) => {
    return c.redirect('/page1')
})

export default siteApp