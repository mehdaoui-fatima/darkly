# FORGOT PASSWORD

### How we find it?
On the homepage, there's a prominent 'SIGN IN' button. Clicking it leads to a 'LOGIN' page,  which turns out to have an option for 'I forgot my password'. Clicking on it leads to a 'RECOVER PASSWORD' page.
Upon inspecting the SUBMIT form on this page, we discovered a hidden input field:
<input type="hidden" name="mail" value="webmaster@borntosec.com" maxlength="15">
This hidden input field contains an email value, presumably used for sending password reset links.
We can exploit this by modifying the value of the email field to our own email address, for example, "test@test.com", and then submitting the form.
By doing so this provides us with the flag.

### Prevention:
- Limited Access Controls: Implement proper access controls to restrict unauthorized access to sensitive pages or functions, such as password reset forms.
- Secure Transmission: Ensure that sensitive data, such as passwords or reset tokens, are transmitted securely over HTTPS to prevent interception by attackers.
- Input Validation: Validate and sanitize all user input, including email addresses, to ensure they meet expected formats and lengths.
