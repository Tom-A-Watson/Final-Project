import { dbConnect } from '../config.js';
import moment from 'moment';

class ReservationService 
{
	async findAll() 
	{
		let connection = await dbConnect();
		let [rows, fields] = await connection.execute("SELECT * FROM reservations");

		rows.forEach(row => {
			row.dateTime = moment(row.dateTime).format("MMMM Do YYYY HH:mm");
		});
	
		return rows;
	}

	async deleteReservation(id)
	{
		let connection = await dbConnect();
		let [rows, fields] = await connection.execute("DELETE FROM reservations WHERE id=?", [id]);

		console.log("DELETED ROWS:" + JSON.stringify(rows))
		return (rows.affectedRows > 0);
	}

    async reserve(username, tableNumber, name, guestCount, dateTime, duration)
	{
		let connection = await dbConnect(); // Establish connection

		try
		{
			tableNumber = 0;
			duration = 120;

			if (guestCount > 14)
			{
				return false;
			}

			let [rows, fields] = await connection.execute(
				"SELECT * FROM restaurant_tables rt " +
					"WHERE rt.tableNumber NOT IN (SELECT r.tableNumber " +
						"FROM reservations r " +
							"WHERE STR_TO_DATE(?, '%Y-%m-%dT%T') BETWEEN r.dateTime AND DATE_ADD(r.dateTime, INTERVAL r.duration MINUTE) " +
							"OR DATE_ADD(STR_TO_DATE(?, '%Y-%m-%dT%T'), INTERVAL ? MINUTE) BETWEEN r.dateTime AND DATE_ADD(r.dateTime, INTERVAL r.duration MINUTE)) ", 
							[dateTime, dateTime, duration]);

			if (rows.length > 0) 
			{
				let tablesToAllocate = this.allocateTables(rows, guestCount);
				let totalSeatsInAllocatedTables = 0;

				for (let i = 0; i < tablesToAllocate.length; i++) {
					totalSeatsInAllocatedTables = totalSeatsInAllocatedTables + tablesToAllocate[i].seatCount

					await connection.execute("INSERT INTO reservations (username, tableNumber, name, guestCount, dateTime, duration) VALUES (?, ?, ?, ?, ?, ?)", 
                		[username, tablesToAllocate[i].tableNumber, name, guestCount, dateTime, duration]);
				}

				if (guestCount > totalSeatsInAllocatedTables) 
				{
					return false;
				}

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

	allocateTables(availableTables, guestCount) 
	{
		if (availableTables == null || guestCount <= 0) 
		{ 
			return [];
		}

		let guestsToBeSeated = guestCount;
		let tablesToBeAllocated = availableTables;
		let allocatedTables = [];
		
		while (guestsToBeSeated > 0 && tablesToBeAllocated.length > 0) {
			let firstTableWithSizeClosestToGuestCount = tablesToBeAllocated.sort((a, b) => 
			  Math.abs(guestsToBeSeated - a.seatCount) - Math.abs(guestsToBeSeated - b.seatCount));
			
			if (firstTableWithSizeClosestToGuestCount.length == 0) 
			{
				return [];
			}
			
			allocatedTables.push(firstTableWithSizeClosestToGuestCount[0]);
			tablesToBeAllocated = tablesToBeAllocated.filter(item => item !== firstTableWithSizeClosestToGuestCount[0]);
			guestsToBeSeated = guestsToBeSeated - firstTableWithSizeClosestToGuestCount[0].seatCount;
		}

		return guestsToBeSeated > 0 ? [] : allocatedTables;
	}
}

export { ReservationService }