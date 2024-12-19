# Spoof(curl)

## Location

http://${IP}/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f

## Spoofing definition

Spoofing is a type of fraud where someone pretends to be a trusted person or organization to steal information, or data, or to spread malware. It tricks people or systems by faking identities.
HTTP header spoofing is when an attacker fakes or changes HTTP headers to look like a legitimate user. This can trick a server into giving unauthorized access or bypassing security checks.

Commonly Spoofed Headers:
- Referer: Faked to bypass access controls.
- User-Agent: Pretends to be a specific browser or device.
- X-Forwarded-For: Masks the attacker's IP address.
- Host: Redirects the request to a malicious domain.


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

- The line we must come from : "https://www.nsa.gov/" implies that the web application is checking the HTTP `referrer` header to decide whether a request is legitimate. (The HTTP Referer request header contains the absolute or partial address from which a resource has been requested. )

- Referrer-based validation can be easily bypassed because the Referer header can be forged or omitted by tools like curl, Postman, or browser extensions.

2 User-Agent Validation:

- The line Let's use this browser : "ft_bornToSec". It will help you a lot. suggests that the server may be validating the User-Agent header (characteristic string), which indicates the type of browser making the request.

- Like the Referer header, the User-Agent header is sent by the client and can be easily modified using for example browser developer tools.


### using curl for http headers spoofing

```html
curl -A "ft_bornToSec" --referer "https://www.nsa.gov/" http://${IP}/index.php?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f
```

curl is a command-line tool used for transferring data using various protocols, including HTTP. In this case, it's being used to send an HTTP request to a server.

- ` -A "ft_bornToSec" (User-Agent Header):`
The -A option (or --user-agent) is used to specify the User-Agent header.
"ft_bornToSec" is the value being sent in the User-Agent header. This is commonly used to identify the client (browser or tool) making the request.
Changing the User-Agent can make the server think that the request is coming from a specific browser, device, or tool, potentially bypassing user-agent-based security checks.

- `--referer "https://www.nsa.gov/" (Referer Header):`
The --referer option specifies the Referer header, which tells the server which page the request originated from.
In this case, the value "https://www.nsa.gov/" is being spoofed, making it appear as though the request is coming from that website, even though the request is actually being sent to http://192.168.66.3/index.php?page=....
This could be used to bypass security measures or access controls that are based on the Referer header (e.g., only allowing requests from specific pages or domains).

- `http://${IP}/index.php?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f (Target URL):`
This is the actual URL to which the HTTP request is being sent.
The URL is pointing to a PHP script (index.php) with a query parameter (page=...)

The curl command is sending a request to http://${IP}/index.php, but with the Uuser-Agent set to "ft_bornToSec" and the Referer header set to "https://www.nsa.gov/".

### Prevention:

- Rely on robust server-side authentication and authorization mechanisms instead of client-controlled headers.
- Never include sensitive implementation details, hints, or access requirements in HTML comments.
- Implement Proper Access Control, using techniques like: Session-based authentication and Token-based mechanisms (OAuth, JWT).

### References and resources

[Request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header)

[The HTTP Referer request header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer)

[The HTTP User-Agent request heade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)