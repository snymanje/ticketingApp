import express, { Request, Response} from "express";
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from "@snymanje/common";
import { Ticket } from '../models/ticket';
import { TickerUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put("/api/tickets/:id", [
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
    body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than zero')
], validateRequest, requireAuth, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }    

    if(ticket.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError('You are not autherized to update this ticket');
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save();

    await new TickerUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })

    res.status(200).send(ticket);
});

export { router as updateTicketRouter };