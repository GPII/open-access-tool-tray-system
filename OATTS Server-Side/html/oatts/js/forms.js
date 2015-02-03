/* 
 reference
 //http://www.wikihow.com/Create-a-Secure-Login-Script-in-PHP-and-MySQL 
 */

function validateForm(form) {

	var regEx;
	var msg = "";
	document.getElementById('user').innerHTML = msg;
	document.getElementById('userEmail').innerHTML = msg;
	document.getElementById('userPass1').innerHTML = msg;

	// Check each field has a value
	if (form.username.value == '' || form.email.value == '' || form.password.value == '' || form.confirmpwd.value == '') {
		msg = 'You must provide all the requested details.';
		document.getElementById('user').innerHTML = msg;
		return false;
	}

	// Check the username
	regEx = /^\w+$/; 
	if(!regEx.test(form.username.value)) { 
		msg = "Username must contain only letters, numbers and underscores.";
		document.getElementById('user').innerHTML = msg;
		form.username.focus();
		return false; 
	}
	
	//check email. should get ~99% of all of them
	regEx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
	if(!regEx.test(form.email.value)) { 
		msg = "Not a recognized email address syntax";
		document.getElementById('userEmail').innerHTML = msg;
		form.email.focus();
		return false; 
	}

	// Check that the password is sufficiently long (min 6 chars)
	if (form.password.value.length < 6) {
		msg = 'Passwords must be at least 6 characters long.';
		document.getElementById('userPass1').innerHTML = msg;
		form.password.focus();
		return false;
	}
	
	// At least one number, one lowercase and one uppercase letter 
	// At least six characters 
	regEx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
	if (!regEx.test(form.password.value)) {
		msg = 'Passwords must contain at least one number, one lowercase and one uppercase letter.';
		document.getElementById('userPass1').innerHTML = msg;
		form.password.focus();
		return false;
	}
	
	// Check password and confirmation are the same
	if (form.password.value != form.confirmpwd.value) {
		msg = 'Your password and confirmation do not match.';
		document.getElementById('userPass1').innerHTML = msg;
		form.password.focus();
		return false;
	}
	
	form.submit();
	return true;
}
