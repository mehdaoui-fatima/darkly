# XSS FEEDBACK

### How we find it?
During a security test on feedback's page, we attempted various attack vectors to identify potential vulnerabilities. Among these, injecting a < script> tag
into one of the input fields and resulted in a successful exploit.
This exploit is a Reflected XSS (also known as Non-Persistent XSS) vulnerability.

### What is XSS?
Cross site scripting (XSS) is a common attack that injects malicious code into a vulnerable web application. there're 3 main types of XSS attacks:
- Stored XSS (Persistent XSS)
- Reflected XSS (Non-Persistent XSS) 
- DOM-Based XSS
In our case is Reflected XSS.
We inject a script in a web application to the browser, through an URL parameter or an input form.

### what is <script> tag
The < script> tag in HTML is an element that executes the JavaScript code it contains. 
However, it can also be abused by attackers in XSS attacks through the injection of malicious JavaScript code.

### References
https://www.geeksforgeeks.org/what-is-cross-site-scripting-xss/

