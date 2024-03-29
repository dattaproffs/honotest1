import { Hono } from 'hono'
import {  MyEnv, rootRenderer } from './components'
import siteApp from './routes/site';
import adminApp from './routes/admin';
import authApp from './routes/auth';



const app = new Hono<MyEnv>()

app.use(async (c, next) => {
	c.set('frontend', c.req.raw.headers.has('hx-request'))
	await next()
})
app.use('*', rootRenderer);




app.route('/auth', authApp)
app.route('/admin', adminApp)
app.route('/', siteApp)


export default app


