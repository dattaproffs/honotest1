import { Hono } from 'hono'
import { LoginRoute, MyEnv, PostLogin, adminMainRenderer, mainRenderer, rootRenderer } from './components'


const app = new Hono<MyEnv>()

app.use('*', rootRenderer);

app.use('*', mainRenderer)

app.get('/', async (c) => {
	if (c.req.raw.headers.has('hx-request')) {
		return c.html(
			<div>
				<h3>Hello todo</h3>
				<a href="/test" hx-get="/test" hx-target="#todo">test</a>
				<div id="todo"></div>
			</div>
		)
	}
	return c.render(
		<div>
			<h3>Hello todo</h3>
			<a href="/test" hx-get="/test" hx-target="#todo">test</a>
			<div id="todo"></div>
		</div>
	)
})

app.get('/page1', (c) => {
	if (c.req.raw.headers.has('hx-request')) {
		return c.html(
			<h3>PAGE 1</h3>
		)
	}
	return c.render(
		<h3>PAGE 1</h3>
	)
})

app.get('/page2', (c) => {
	return c.redirect('/page1')
})

app.get('/login', (c) => {
	if (c.req.raw.headers.has('hx-request')) {
		return c.html(
			<LoginRoute />
		)
	}
	return c.render(
		<LoginRoute />
	)
})
app.post('/login', async (c) => {
	return await PostLogin({c})
})

const adminApp = new Hono()
adminApp.use('*', adminMainRenderer)
adminApp.get('/', (c) => {
	if (c.req.raw.headers.has('hx-request')) {
		return c.html(
			<div>
				<h3>Hello admin</h3>
				<a href="/test" hx-get="/test" hx-target="#todo">test</a>
				<div id="todo"></div>
			</div>
		)
	}
	return c.render(
		<div>
			<h3>Hello admin</h3>
			<a href="/test" hx-get="/test" hx-target="#todo">test</a>
			<div id="todo"></div>
		</div>
	)
})
adminApp.get('/2', (c) => {
	return c.render(
		<div>
			<h3>Hello admin</h3>
			<a href="/test" hx-get="/test" hx-target="#todo">test</a>
			<div id="todo"></div>
		</div>
	)
})

app.route('/admin', adminApp)


export default app


