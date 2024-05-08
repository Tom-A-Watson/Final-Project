document.querySelectorAll(".delete-user").forEach(element => {
    
    element.addEventListener("click", e => {
        e.preventDefault();
        
        fetch("http://localhost:3000/api/user/" + e.target.getAttribute("data-username"), {
        	method: "DELETE",
        }).then(res => { sendResult(res); })
    });
});

document.querySelectorAll(".delete-reservation").forEach(element => {
    
    element.addEventListener("click", e => {
        e.preventDefault();
        
        fetch("http://localhost:3000/api/reservation/" + e.target.getAttribute("data-reservation"), {
        	method: "DELETE",
        }).then(res => { sendResult(res); })
    });
});

document.querySelector("#createadmin-form").addEventListener("submit", e => {
    e.preventDefault();

    let formData = new FormData();
	formData.append("username", document.querySelector("#admin-username").value)
	formData.append("email", document.querySelector("#admin-email").value)
	formData.append("password", document.querySelector("#admin-password").value)
	formData.append("isAdmin", document.querySelector("#is-admin").value)

    fetch("/createadmin", {
		method: "POST",
		body: formData
	}).then(res =>
	{
        sendResult(res);
        
        if (res.ok) { alert("The administrator was successfully added") }
	});
});

function sendResult(res)
{
    if (!res.ok)
    {
        res.json().then(json =>
        {
            alert(json.error)
        })
            
        return;
    }

    window.location.href = "/admin"
}