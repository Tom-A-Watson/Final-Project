let current = 1;
    
    /**
     * Scrolls to the LOGIN form in 'loginsignup.html', which simultaneously hides the SIGN UP form.
     */
    function scrollToLogin() {
        document.querySelector("#form").style.marginLeft="0";
        document.querySelector(".signup").style.background = "none";
        document.querySelector(".login").style.background = "linear-gradient(45deg, #8765fa, #e400ab)";
        document.querySelectorAll(".switch")[current - 1].classList.remove("active");
    }
    
    /**
     * Scrolls to the SIGN UP form in 'loginsignup.html', which simultaneously hides the LOGIN form.
     */
    function scrollToSignUp() {
        document.querySelector("#form").style.marginLeft="-100%";
        document.querySelector(".login").style.background = "none";
        document.querySelector(".signup").style.background = "linear-gradient(45deg, #8765fa, #e400ab)";
        document.querySelectorAll(".switch")[current - 1].classList.add("active");
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

    document.querySelector("#pg1").addEventListener("submit", e => {
        e.preventDefault();


    })

    document.querySelector("#pg2").addEventListener("submit", e => {
        e.preventDefault();

            
    })