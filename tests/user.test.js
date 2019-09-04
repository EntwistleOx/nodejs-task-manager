const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const { userOneId, userOne, setupDatadabse } = require('./fixtures/db')

beforeEach(setupDatadabse)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Jane Doe',
        email: 'jane@doe.cl',
        password: 'Secret123!'
    }).expect(201)

    // assert database was change, a new user created
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assert about the response
    // expect(response.body.user.name).toBe('Jane Doe')
    expect(response.body).toMatchObject({
        user: {
            name: 'Jane Doe'
        },
        token: user.tokens[0].token
    })

    // assert password in nto in plain text
    expect(user.password).not.toBe('Secret123!')
})

test('Should login an existing user', async () =>{
    const response = await request(app)
        .post('/users/login')
        .send(userOne)
        .expect(200)

    const user = await User.findById(userOneId)
    // expect(response.body).toMatchObject({
    //     token: user.tokens[1].token
    // })
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login a nonexisting user', async () =>{
    await request(app).post('/users/login')
        .send({
            email: 'fran@yakich.cl',
            password: 'Secret123!'
        }).expect(400)
})

test('Should get users profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    // checks if avatar is a Buffer
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Peter Seils'
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Peter Seils')
})

test('Should not update invalid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Santiago'
        })
        .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated