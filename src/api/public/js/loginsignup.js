/**
 * Scrolls to the LOGIN form in 'loginsignup.html', which simultaneously hides the SIGN UP form.
 */
function scrollToLogin() {
    document.querySelector("#form").style.marginLeft="0";
    document.querySelector(".signup").style.background = "none";
    document.querySelector(".login").style.background = "linear-gradient(45deg, var(--secondary-color), var(--accent-gradient)";
    document.querySelectorAll(".switch")[0].classList.remove("active");
}
    
/**
 * Scrolls to the SIGN UP form in 'loginsignup.html', which simultaneously hides the LOGIN form.
 */
function scrollToSignUp() {
    document.querySelector("#form").style.marginLeft="-100%";
    document.querySelector(".login").style.background = "none";
    document.querySelector(".signup").style.background = "linear-gradient(45deg, var(--secondary-color), var(--accent-gradient)";
    document.querySelectorAll(".switch")[0].classList.add("active");
}

/**
 * Toggles the password input type between 'password' and 'text' in the LOGIN form, allowing the
 * user to see the characters they entered.  
 * @param {Event} e - The event, which in this case is a click event 
 */
function toggleLoginPwd(e) {
    document.querySelector("#login-password").type = (document.querySelector("#login-password").type == "password") ? "text" : "password";
    e.classList.value = (e.classList.value == "far fa-eye") ? "far fa-eye-slash" : "far fa-eye"; 
}

/**
 * Toggles the password input type between 'password' and 'text' in the SIGN UP form, allowing the
 * user to see the characters they entered.
 * @param {Event} e - The event, which in this case is a click event 
 */
function toggleSignUpPwd(e) {
    document.querySelector("#signup-password").type = (document.querySelector("#signup-password").type == "password") ? "text" : "password";
    e.classList.value = (e.classList.value == "far fa-eye") ? "far fa-eye-slash" : "far fa-eye"; 
}

/**
 * Toggles the password input type between 'password' and 'text' in the SIGN UP form, allowing the
 * user to see the characters they entered.
 * @param {Event} e - The event, which in this case is a click event 
 */
function toggleConfirmPwd(e) {
    document.querySelector("#confirm-password").type = (document.querySelector("#confirm-password").type == "password") ? "text" : "password";
    e.classList.value = (e.classList.value == "far fa-eye") ? "far fa-eye-slash" : "far fa-eye"; 
}

document.querySelector("#login-form").addEventListener("submit", e => {
    e.preventDefault();

    let formData = new FormData();
	formData.append("user", document.querySelector("#login-username").value)
	formData.append("password", document.querySelector("#login-password").value)
	
	fetch("http://localhost:3000/api/user/login", {
		method: "POST",
		body: formData
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
		window.location.href = "http://localhost:3000/reservation";
	})
});

document.querySelector("#signup-form").addEventListener("submit", e => {
    e.preventDefault();

    let formData = new FormData();
	formData.append("username", document.querySelector("#signup-username").value)
	formData.append("email", document.querySelector("#signup-email").value)
	formData.append("password", document.querySelector("#signup-password").value)
	formData.append("confirmPass", document.querySelector("#confirm-password").value)
	
	fetch("http://localhost:3000/api/user/signup", {
		method: "POST",
		body: formData
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
		alert("Thanks for signing up!")
	})
});