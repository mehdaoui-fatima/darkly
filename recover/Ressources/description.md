# External Control of Assumed-Immutable Web Parameter - Recover

## Location

http://${IP}/?page=recover

## Description
Web applications often assume that certain data passed to the client—such as hidden form fields, URL parameters, or cookies—cannot be tampered with. This assumption is incorrect. If these values are not properly protected, attackers can easily modify them and send malicious data back to the server.

For example, a hidden input field in an HTML form may contain critical information like a user ID or email address. However, this field is visible in the browser's developer tools and can be altered by anyone with basic knowledge of web development tools. If the server doesn't validate the data it receives, it might process this altered input, leading to serious security issues.

##### Key Points to Understand
- Hidden ≠ Secure: Just because a field is hidden in the user interface doesn’t mean it’s protected. Hidden fields are part of the DOM and can be modified by anyone using browser tools.
- Attacker Advantage: Attackers can easily view and manipulate hidden fields by inspecting the webpage's HTML. This is no different from editing visible input fields.
- Implement strict server-side validation for all inputs, Data coming from the client must always be treated as untrustworthy and validated on the server side.

### How we find it?
On the homepage, there's a prominent 'SIGN IN' button. Clicking it leads to a 'LOGIN' page,  which turns out to have an option for 'I forgot my password'. Clicking on it leads to a 'RECOVER PASSWORD' page.
Upon inspecting the SUBMIT form on this page, we discovered a hidden input field:
<input type="hidden" name="mail" value="webmaster@borntosec.com" maxlength="15">
This hidden input field contains an email value, presumably used for sending password reset links.
We can exploit this by modifying the value of the email field to our own email address, for example, "test@test.com", and then submitting the form.
By doing so this provides us with the flag.

### Prevention:
- Avoid exposing sensitive data in hidden fields.
- Implement strict server-side validation for all inputs.
- implementing a secure password recovery mechanism

### Ressources
[Assumed-Immutable Web Parameter](https://www.martellosecurity.com/kb/mitre/cwe/472/)

[External Control of Assumed-Immutable Web Parameter](https://cwe.mitre.org/data/definitions/472.html)

