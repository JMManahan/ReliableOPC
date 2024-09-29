(function(){
    emailjs.init("-ebaw7uEA31GkAoIr"); // Replace with your EmailJS User ID
})();

    // Add event listener to the form submit event
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const templateParams = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone-number').value,
            institution: document.getElementById('institution').value,
            medical_field: document.getElementById('medical-field').value,
            message: document.getElementById('message').value,
        };

        // Send email using EmailJS
        emailjs.send('service_35ipv2j', 'template_388f6pg', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Email sent successfully!');
            }, function(error) {
                console.log('FAILED...', error);
                alert('Failed to send email. Please try again.');
            });
    });