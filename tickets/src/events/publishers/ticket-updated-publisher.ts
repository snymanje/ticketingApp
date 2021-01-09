import { Publisher, Subjects, TicketUpdatedEvent } from '@snymanje/common'

export class TickerUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated; 
}