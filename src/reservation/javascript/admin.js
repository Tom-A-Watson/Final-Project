document.querySelectorAll(".delete-user").forEach(element => {
    
    element.addEventListener("click", e => {
        e.preventDefault();

        console.log("Target clicked =====" + e.target.getAttribute("data-username"))
        
        fetch("http://localhost:3000/api/user/" + e.target.getAttribute("data-username"), {
        	method: "DELETE",
        }).then(res =>
        {
            console.log("Hello world");
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