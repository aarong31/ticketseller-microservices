import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';

it('has a route handler listening to /tickets for post requests', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .send({});

  expect(response.status).not.toEqual(404);
});

it('only accessed by signed in user', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .send({});

  expect(response.status).toEqual(401);
});

it('return a status other than 401 is user is signed in', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({});

  expect(response.status).not.toEqual(401);
});

it('error if invalid title', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: '',
    price: 10
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    price: 10
  })
  .expect(400);
});

it('error if invalid price', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'dfdf',
    price: -10
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'nmjjkj'
  })
  .expect(400);
});

it('create ticket if valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'asssdss',
    price: 20
  })
  .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
});