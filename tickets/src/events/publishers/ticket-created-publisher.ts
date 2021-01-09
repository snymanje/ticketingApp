import { Publisher, Subjects, TicketCreatedEvent } from '@snymanje/common'

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated; 
}