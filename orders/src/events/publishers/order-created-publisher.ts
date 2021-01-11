import { Publisher, OrderCreatedEvent, Subjects } from '@snymanje/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}