import express, { Request, Response} from "express";
import { body } from 'express-validator';
import { requireAuth, validateRequest } from "@snymanje/common";
import { Ticket, TicketAttrs } from '../models/ticket';
import { TickerCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from './../nats-wrapper';

const router = express.Router();

router.post("/api/tickets", requireAuth, [
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
    body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than zero')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

   const ticketObj: TicketAttrs = {
        title,
        price,
        userId: req.currentUser!.id
    }

    const ticket = await Ticket.create(ticketObj);

    await new TickerCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    res.status(201).send(ticket);
});

export { router as createTicketRouter };