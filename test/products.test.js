
import supertest from "supertest";
import { expect } from "chai";
import env from "dotenv";
env.config();

const requester = supertest("http://localhost:8080");

describe("testing Products API", () => {
    describe("GET api/products", () => {
        it('el endpóint deberia devolver un array de productos', async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/products')
            console.log(statusCode)
            console.log(ok)
            console.log(_body)


            expect(statusCode).to.equal(200);
            expect(_body.payload).to.be.an('Array');
        })
    })

    describe("POST api/products", () => {
        it('el endpóint deberia crear un producto', async () => {
            const productMock = {
                title: 'producto de prueba',
                description: 'descripcion de prueba',
                price: 900,
                code: '1234',
                stock: 10,
                category: 'categoria de prueba',
            }

            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/products').send(productMock)

            console.log(statusCode)
            console.log(ok)
            console.log(_body)

            expect(_body.payload).to.have.property('_id')
            expect(_body.payload).to.have.property('status')
            expect(statusCode).to.equal(200);
            expect(_body).to.be.an('Object');
        })
    })


    describe("GET api/products/:id", () => {
        it('el endpóint deberia devolver un producto', async () => {
            const productMock = {
                title: 'producto de prueba',
                description: 'descripcion de prueba',
                price: 900,
                code: '1234',
                stock: 10,
                category: 'categoria de prueba',
            }
            const createResponse = await requester.post('/api/products').send(productMock)
            const productId = createResponse._body.payload._id

            const {
                statusCode,
                ok,
                _body
            } = await requester.get(`/api/products/${productId}`)

            console.log(statusCode)
            console.log(ok)
            console.log(_body)

            expect(statusCode).to.equal(200);
            expect(_body).to.be.an('object');
        })
    })
})