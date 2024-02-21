import { Hono } from 'hono'
import { MyEnv } from '../../components'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer';
import type { Child } from 'hono/jsx';

const AdminLayout = ({children}: {children:Child | undefined}) => {
    return (
        <div>
            <h1>Admin</h1>
            <nav>
                <ul hx-boost="true" hx-target="#main-area">
                    <li><a href="/admin">admin home</a></li>
                    <li><a href="/admin/2">admin 2</a></li>
                    <li><a href="/admin/page1">admin page1</a></li>
                    <li><a href="/admin/page2">admin page2</a></li>
                    <li><a href="/" hx-target="#body">Logout</a></li>
                </ul>
            </nav>
            <div class="mt-5" id="main-area">
                {children}
            </div>
        </div>
    )
}

const adminMainRenderer = jsxRenderer(({ children, Layout }) => {
    const c = useRequestContext();
    console.log('adminRenderer', c.req.raw.headers)
    if ((c.req.header('hx-request') === 'true' && c.req.method === 'GET' && c.req.header('hx-target') === 'body')) {
        return (
            <AdminLayout children={children} />
        )
    } else if (c.req.header('hx-request') === 'true' && c.req.method === 'GET' && c.req.header('hx-target')) {
        return (<>{children}</>)
    }
    return (
        <Layout>
            <AdminLayout children={children} />
        </Layout>
    )
}, {
    docType: false
})

const adminApp = new Hono<MyEnv>()
adminApp.use('*', adminMainRenderer)
adminApp.get('/', (c) => {
    return c.render(
        <div>
            <h3>Hello admin</h3>
        </div>
    )
})
adminApp.get('/2', (c) => {
    return c.render(
        <div>
            <h3>Hello admin 2</h3>
        </div>
    )
})

adminApp.get('/page1', (c) => {
    return c.render(
        <div>
            <h3>PAge 1</h3>
        </div>
    )
})
adminApp.get('/page2', (c) => {
    return c.render(
        <div>
            <h3>PAge 2</h3>
        </div>
    )
})

export default adminApp