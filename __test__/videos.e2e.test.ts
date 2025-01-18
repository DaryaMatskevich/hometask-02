import { ADMIN_AUTH, SETTINGS} from '../src/settings'
import { req } from './test-helpers'

describe('/post', () => {
    it('should get empty array', async () => {
        const buff2 = Buffer.from(ADMIN_AUTH, 'utf8')
        const codedAuth = buff2.toString('base64')
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .set({'Authorisation': 'Basic ' + codedAuth})
            .expect(200)
 
    })
})