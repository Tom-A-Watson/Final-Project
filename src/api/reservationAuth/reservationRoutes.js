import multer from 'multer';
import { ReservationData } from './reservationData.js';
import { Router } from 'express';
import { Utils } from '../utils.js';

class ReservationRoutes 
{
    constructor() {}       
    
    /**
     * Create routes for customer reservations
     * @param {Router} router 
     */
    createRoutes(router) 
    {
        let reservationData = new ReservationData();
        let upload = multer();
        let utils = new Utils();
        router.post("/reserve/", upload.none(), async function(req, res)
        {
            console.log("reservation received -------------------------");
            if (!req.body)
			{
				res.status(400)
				res.json({error: "One or more fields were not filled out"});
				return;
			}

            let { name, adults, children, dateTime, duration } = req.body;
			
			if (utils.isEmpty(name) || utils.isEmpty(children) || utils.isEmpty(dateTime))
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

            // if (await reservationData.checkDate(dateTime) || await reservationData.checkDuration(duration)) 
            // {
            //     res.status(409)
            //     res.json({error: "The date or time given conflicts with an existing reservation"});
            //     return;
            // }

            let guestCount = adults + children;
            let error = await reservationData.reserve("tom", 1, name, guestCount, dateTime, duration);

            if (error) 
            {
                res.status(500);
                res.json(error);
                return;
            }

            res.sendStatus(200);
        }) 
    }
}

export { ReservationRoutes }