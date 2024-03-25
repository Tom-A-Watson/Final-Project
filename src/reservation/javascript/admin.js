document.querySelectorAll(".delete-user").forEach(element => {
    
    element.addEventListener("click", e => {
        e.preventDefault();
        
        fetch("http://localhost:3000/api/user/" + e.target.getAttribute("data-username"), {
        	method: "DELETE",
        }).then(res =>
        {
        	if (!res.ok)
        	{
                res.json().then(json =>
                {
                    alert(json.error)
                })
                    
                return;
        	}

            window.location.href = "admin"
        })
    });
});

document.querySelectorAll(".delete-reservation").forEach(element => {
    
    element.addEventListener("click", e => {
        e.preventDefault();
        
        fetch("http://localhost:3000/api/reservation/" + e.target.getAttribute("data-reservation"), {
        	method: "DELETE",
        }).then(res =>
        {
        	if (!res.ok)
        	{
                res.json().then(json =>
                {
                    alert(json.error)
                })
                    
                return;
        	}

            window.location.href = "admin"
        })
    });
});