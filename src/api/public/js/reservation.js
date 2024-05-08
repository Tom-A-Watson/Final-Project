document.querySelector("#reservation-form").addEventListener("submit", e => {
    e.preventDefault();
	
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
		if (!res.ok)
		{
			console.log(res.json({error}));
			document.querySelector("#messages").innerHTML = "Could not reserve"; 
			return;
		}

		alert("Your table is now reserved!!");
	})
});