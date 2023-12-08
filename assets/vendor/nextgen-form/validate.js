document.getElementById('nextgen_form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get form data
  const formData = new FormData(document.getElementById('nextgen_form'));

  // Create an object to store the form data
  const data = {};
  formData.forEach((value, key) => {
      data[key] = value;
  });

  // Perform field validations
  let isValid = true;
  const errorMessages = {
      first_name: "Please Enter Valid First Name.",
      last_name: "Please Enter Valid Last Name.",
      company_name: "Please Enter Valid Company Name.",
      business_email: "Please Enter Valid Business Email.",
      phone_number: "Please Enter Valid Phone Number.",
      message: "Message is exceed from 1500 characters."
  };

  // Validation for First Name
  if (!/^[A-Za-z]{2,}$/.test(data.first_name)) {
      displayError(this, errorMessages.first_name);
      isValid = false;
  }

  // Validation for Last Name
  if (!/^[A-Za-z]{2,}$/.test(data.last_name)) {
      displayError(this, errorMessages.last_name);
      isValid = false;
  }

  // Validation for Company Name
  if (!/^[A-Za-z0-9\s]{3,}$/.test(data.company_name)) {
      displayError(this, errorMessages.company_name);
      isValid = false;
  }

  // Validation for Business Email
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.business_email)) {
      displayError(this, errorMessages.business_email);
      isValid = false;
  }

  // Validation for Phone Number
  if (!/^\d{5,13}$/.test(data.phone_number)) {
      displayError(this, errorMessages.phone_number);
      isValid = false;
  }

  // Validation for Message
  if (data.message.length > 1500) {
      displayError(this, errorMessages.message);
      isValid = false;
  }

  if (!isValid) {
      return; // Stop form submission if there are validation errors.
  }

  // Clear any existing error messages
  clearErrorMessages(this);

  // Send the data to the Go server
  fetch('/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      if (response.ok) {
          // Handle a successful response here
          console.log('Data submitted successfully!');
          this.querySelector('.sent-message').classList.add('d-block');
          this.reset();
      } else {
          // Handle an error response here
          console.error('Failed to submit data.');
          displayError(this, 'Error submitting data to Google Sheets: ' + JSON.stringify(error));
      }
  });

  function displayError(form, errorMessage) {
      form.querySelector('.loading').classList.remove('d-block');
      form.querySelector('.error-message').innerHTML = errorMessage;
      form.querySelector('.error-message').classList.add('d-block');
  }

  function clearErrorMessages(form) {
    form.querySelector('.error-message').classList.remove('d-block');
    form.querySelector('.sent-message').classList.remove('d-block');
  }
});
