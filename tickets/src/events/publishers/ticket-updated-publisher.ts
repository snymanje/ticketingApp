import { Publisher, Subjects, TicketUpdatedEvent } from '@snymanje/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated; 
}