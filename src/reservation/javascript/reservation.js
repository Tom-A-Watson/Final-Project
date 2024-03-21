document.querySelector("#reservation-form").addEventListener("submit", e => {
    e.preventDefault();

    console.log("HERE -------------2-2-2-2-22--")

    let formData = new FormData();
	formData.append("name", document.querySelector("#name").value)
	formData.append("adults", document.querySelector("#adults").value)
	formData.append("children", document.querySelector("#children").value)
	formData.append("dateTime", document.querySelector("#datetime").value)
    formData.append("duration", document.querySelector("#duration").value)
	
	fetch("http://localhost:3000/api/reserve", {
		method: "POST",
		body: formData
	}).then(res =>
	{
		console.log("response = " + res.status)
		if (!res.ok)
		{
			// alert("Reservation was unsuccessful");
			// res.json().then(json =>
			// {
				
			// })

			// Change the DOM/HTML on the page to reflect the failed reservation
			//
			document.querySelector("#messages").innerHTML = 'There is no table available at the selected time'; 
			return;
		}
		alert("Your table is now reserved!!")
	})
});