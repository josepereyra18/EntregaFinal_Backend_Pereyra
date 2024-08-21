
import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("testing cart API", () => {
    describe("GET api/carts", () => {
        it('el endpóint deberia devolver un array de carritos', async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/cart')
            console.log(statusCode)
            console.log(ok)
            console.log(_body)


            expect(statusCode).to.equal(200);
            expect(_body.payload).to.be.an('Array');
        })
    })

    describe ("POST api/cart", () => {
        it('el endpóint deberia crear un carrito vacio', async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/cart')

            console.log(statusCode)
            console.log(ok)
            console.log(_body)



            expect(statusCode).to.equal(200);
            expect(_body).to.be.an('Object');
            expect(_body.payload.products).to.have.length(0);

        })
    })

    describe("GET api/cart/:id", () => {
        it('el endpóint deberia devolver un carrito', async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/cart')
            const cartId = _body.payload._id
            const getCart= await requester.get('/api/cart/'+cartId)
            console.log(statusCode)
            console.log(ok)
            console.log(_body)

            expect(getCart.statusCode).to.equal(200);
            expect(_body.payload).to.be.an('object');
        })
    })
})