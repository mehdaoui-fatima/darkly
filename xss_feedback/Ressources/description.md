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
in our case is Reflected XSS.

### What is Reflected XSS?

file:///home/acus/Desktop/reflectedXSS.png

### what is <script> tag
