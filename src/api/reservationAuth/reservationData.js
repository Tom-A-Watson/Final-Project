import { dbConnect } from '../config.js';

class ReservationData 
{
    async reserve(username, tableNumber, name, guestCount, dateTime, duration)
	{
		let connection = await dbConnect(); // Establish connection

		try
		{
			console.log("username="+username);
			console.log("tableNumber="+tableNumber);
			console.log("name="+name);
			console.log("guestCount="+guestCount);
			console.log("dateTime="+dateTime);
			console.log("duration="+duration);


			await connection.execute("INSERT INTO reservations (username, tableNumber, name, guestCount, dateTime, duration) VALUES (?, ?, ?, ?, ?, ?)", 
                [username, tableNumber, name, guestCount, dateTime, 100]);
			
            return null; // Reservation is inserted successfully
		}
		catch (error)
		{
			console.error("Error:", error);
			return { error: error }; // Return the error
		}
	}

    
}

export { ReservationData }