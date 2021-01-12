import { app } from './app'
import mongoose from "mongoose";
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-lister';

const start = async () => {

  if(!process.env.JWT_KEY) {
    throw new Error("JWT_KEY needs to be defined.")
  }
  if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI needs to be defined.")
  }
  if(!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID needs to be defined.")
  }
  if(!process.env.NATS_URL) {
    throw new Error("NATS_URL needs to be defined.")
  }
  if(!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID needs to be defined.")
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongodb tickets DB')

    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, async () => {
  console.log("Listening on port 3000!");
});

start();
