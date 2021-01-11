import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@snymanje/common'
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete(`/api/orders/:id`, requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError('User does not own this order')
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
})

export { router as deleteOrderRouter }