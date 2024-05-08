import multer from 'multer';
import { ReservationService } from './reservationService.js';
import { Router } from 'express';
import { isEmpty } from '../utils.js';

class ReservationRoutes 
{
    constructor() {}       
    
    /**
     * Create routes for customer reservations
     * @param {Router} router 
     */
    createRoutes(router) 
    {
        let reservationService = new ReservationService();
        let upload = multer();
        router.post("/api/reserve/", upload.none(), async function(req, res)
        {
            let username = req.session.user.username;
            
            if (!req.body)
			{
				res.status(400)
				res.json({error: "One or more fields were not filled out"});
				return;
			}
            
            let { tableNumber, name, adults, children, dateTime, duration } = req.body;

            if (isEmpty(children))
            {
                children = 0;
            }
			
			if (isEmpty(name) || isEmpty(dateTime))
			{
				res.status(400)
				res.json({error: "One or more fields were not filled out"});
				return;
			}

            if (children > adults * 5) 
            {
                res.status(400)
                res.json({error: "There must be at least 1 adult for every 5 children"});
                return;
            }

            let guestCount = parseInt(adults) + parseInt(children);
            let reservationSuccessful = await reservationService.reserve(username, tableNumber, name, guestCount, dateTime, duration);

            if (!reservationSuccessful) 
            {
                res.status(400);
                res.json({error: "The reservation was unsuccessful"});
                return;
            }
 
            res.sendStatus(200);
        })

        router.delete("/api/reservation/:id", async function(req, res) 
		{
			let id = req.params.id;
			let reservationDeleted = await reservationService.deleteReservation(id);

			console.log("DELETED RESERVATION RESULT:" + JSON.stringify(reservationDeleted))

			if (!reservationDeleted) 
			{
				res.status(404);
				res.json({error: "Reservation was not found (it may have already been deleted prior)"});
				return;
			}

			res.sendStatus(200);
		})
    }
}

export { ReservationRoutes }