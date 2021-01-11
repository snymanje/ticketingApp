import { Publisher, OrderCancelledEvent, Subjects } from '@snymanje/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}