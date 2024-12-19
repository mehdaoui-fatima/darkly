# Spoof(curl)

## Location
http://${IP}/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f

## Description

--->Add description

##### Key Points to Understand

---> add key points

### How we find it?

On inspecting the webpage's source code, we found the following lines commented out in the HTML: 
```html 
You must come from : "https://www.nsa.gov/".
-->

-->
Let's use this browser : "ft_bornToSec". It will help you a lot.
-->
```

1 Referrer-Based Validation:

- The line we must come from : "https://www.nsa.gov/" implies that the web application is checking the HTTP `referrer` header to decide whether a request is legitimate.

- Referrer-based validation can be easily bypassed because the Referer header can be forged or omitted by tools like curl, Postman, or browser extensions.

2 User-Agent Validation:

- The line Let's use this browser : "ft_bornToSec". It will help you a lot. suggests that the server may be validating the User-Agent header, which indicates the type of browser making the request.

- Like the Referer header, the User-Agent header is sent by the client and can be easily modified using for example browser developer tools.


curl -A "ft_bornToSec" --referer "https://www.nsa.gov/" http://192.168.66.3/index.php?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f

### Prevention:

- Rely on robust server-side authentication and authorization mechanisms instead of client-controlled headers.
- Never include sensitive implementation details, hints, or access requirements in HTML comments.
- Implement Proper Access Control, using techniques like: Session-based authentication and Token-based mechanisms (OAuth, JWT).

### References and resources

[Request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header)
[The HTTP Referer request header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer)
[The HTTP User-Agent request heade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)