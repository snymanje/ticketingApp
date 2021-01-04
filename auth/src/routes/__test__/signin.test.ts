import request from "supertest";
import { app } from "../../app";

it("returns a 400 on invalid username signup", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123455",
    })
    .expect(400);
});

it("returns a 200 on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123455",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123455",
    })
    .expect(200);
});

it("returns a 400 on unsuccessful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123455",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123455423423",
    })
    .expect(400);
});

it("sets a cookie after signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123455",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123455",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
