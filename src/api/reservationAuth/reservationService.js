import { dbConnect } from '../config.js';

class ReservationService 
{
    async reserve(username, tableNumber, name, guestCount, dateTime, duration)
	{
		let connection = await dbConnect(); // Establish connection

		try
		{
			console.log("username=" + username);
			console.log("tableNumber=" + tableNumber);
			console.log("name=" + name);
			console.log("guestCount=" + guestCount);
			console.log("dateTime=" + dateTime);
			console.log("duration=" + duration);


			// GAW TODO: Change this to do a lookup/check if a table is available, rather than
			//           assume one is by INSERTing a reservation.
			let [rows, fields] = await connection.execute(
				"SELECT * " +
			    "FROM restaurant_tables rt " +
				"WHERE rt.tableNumber NOT IN ( " +
				"SELECT r.tableNumber " +
				"FROM reservations r " +
				"WHERE STR_TO_DATE(?, '%Y-%m-%dT%T') BETWEEN r.dateTime AND DATE_ADD(r.dateTime, INTERVAL r.duration MINUTE) " +
				"OR DATE_ADD(STR_TO_DATE(?, '%Y-%m-%dT%T'), INTERVAL ? MINUTE) BETWEEN r.dateTime AND DATE_ADD(r.dateTime, INTERVAL r.duration MINUTE)) " +
				"AND rt.seatCount >= ? order by rt.seatCount", 
				[dateTime, dateTime, 120, guestCount]);

			console.log("\nROWS IN RESTAURANT_TABLES: " + rows)	
			if (rows.length > 0) 
			{
				console.log("\nFirst row: " + JSON.stringify(rows[0]))
				await connection.execute("INSERT INTO reservations (username, tableNumber, name, guestCount, dateTime, duration) VALUES (?, ?, ?, ?, ?, ?)", 
                [username, rows[0].tableNumber, name, guestCount, dateTime, 100]);
				return true; // Reservation is inserted successfully
			}

			return false; // No rows returned so reservation was returned 
		}
		catch (error)
		{
			console.error("Error: ", error);
			return { error: error }; // Return the error
		}
	}

    
}

export { ReservationService }