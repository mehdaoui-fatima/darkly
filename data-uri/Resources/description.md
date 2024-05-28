
### Title: <span style="color:blue">Reflected cross-site scripting (XSS) </span>

> **Note:**
>
> Knowing that an image URL with a data: scheme and Base64 encoding can contain executable content


how does xss work?
`Cross-Site Scripting` (XSS) attacks are a type of scripts injection,
works by manipulating a vulnerable web site so that it returns malicious JavaScript to users.
When the malicious code executes inside a victim's browser, the attacker can fully compromise their interaction with the application. the three main types of XSS atatcks:

* Reflected XSS: where the malicious script comes from the current HTTP request.
* Stored XSS: where the malicious script comes from the website's database.
* DOM-based XSS: where the vulnerability exists in client-side code rather than server-side code.

**Step0: key notes**

* *Reserved characters:* some special characters (< > " ' - &) are reserved for use in html,
meaning that your browser will parse them as HTML code for example:
(<) sign, the browser interprets any text that follows as a tag.
To display these characters as text, replace them with their corresponding character entities.

* *html entities:* Entity is a `piece of text` (strings starts with `&` and ends with `;`) are frequently used to display reserved characters which would be otherwie interpreted as HTML code, also characters that are not easily typed0

* *data URIs:* URLs prefixed with the `data:` scheme, allow content creators to embed small files inline in documents.

* *MIME types:* a media type indicates the format, nature of a document. the mime structure `type/subtype`

**step1:**

The URI generic syntax: `URI = scheme ":" ["//" authority] path ["?" query] ["#" fragment]`
while query parameters in URLs are common points to test for reflected XSS vulnerabilities, 

1- we tried to inject script to modify the URL to include a script: `${IP}/?page=media&src=<script>alert()</script>`
in the source code converting special characters into their HTML-encoded equivalents `&lt;script&gt;alert()&lt;/script&gt` to prevent them from being interpreted as code, ensuring they are displayed as plain text. and this escaping is a form of input sanitization.

> few common conversions:
> < becomes &lt;
> > becomes &gt;
> & becomes &amp;
> " becomes &quot;
> ' becomes &#39;

2- the URL `${IP}/?page=media&src=${value}` is interpreted by the server to generate HTML content. 
embedded in an HTML generated an <object> tag as <object data=${value}>.
so the src query parmeter value is directly inserted into the HTML source as <object data="value">

3- In HTML, the src attribute in <img> and <object> tags is used to specify the URL of the image or resource to be embedded. The src attribute can take various forms, including:

* Absolute URL: where the src attribute specifies the complete URL of the image or resource.
```html 
<img src="https://example.com/image.jpg" alt="Image">
```
* Relative URL: The src attribute can also specify a path relative to the current page.
```html 
<img src="images/image.jpg" alt="Image">
```
* Data URL: The src attribute can contain a data URL, which embeds the image data directly into the HTML document. This is often used for small images.
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIA..." alt="Embedded Image">
```
with image/png a MIME type

**step2:**
we used data url to inject javascript code, in our url data: as thefollowing:
`${IP}/?page=media&src=data:text/html;base64,PHNjcmlwdD5hbGVydCgpPC9zY3JpcHQ+`,
 with PHNjcmlwdD5hbGVydCgpPC9zY3JpcHQ+ : <script>alert()</script>

but before we need before to understand some key points:

* The text/html MIME type instructs the browser to interpret and render the content as HTML. This includes executing any embedded JavaScript.

* Other MIME types like image/jpeg and text/plain do not instruct the browser to execute the content as HTML or JavaScript. Therefore, the browser either tries to render the data as an image (failing if it's not a valid image) or displays it as plain text, neither of which will execute the JavaScript code.

>NOTE:
>execute a script using a data URL and ensure the browser interprets it as executable code, you must use a MIME type that the browser recognizes as containing HTML or JavaScript. The text/html MIME type is a suitable choice because it allows the browser to interpret and execute the embedded JavaScript.

When a browser encounters an `<object>` tag with a data attribute that contains a `data:` URL, it treats the content of the `data:` URL based on the specified `MIME` type, regardless of whether the `data:` URL is intended to load an image, HTML, or any other type of content.
the <object> Tag can be used to embed different types of content in a web page, including images, HTML, and other resources. The data attribute of the <object> tag specifies the URL of the resource to be embedded. The behavior of the browser when handling this URL is primarily determined by the MIME type specified in the data: URL.
examples: 

```html
<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgpPC9zY3JpcHQ+"></object>
```

Example of data:text/html in <object>: 
1. Parsing the URL: The browser sees that the data attribute contains a data: URL with the MIME type text/html.
2. Base64 Decoding: The browser decodes the Base64-encoded content PHNjcmlwdD5hbGVydCgpPC9zY3JpcHQ+ to get <script>alert()</script>.
3. HTML Interpretation: Because the MIME type is text/html, the browser interprets the decoded content as HTML and processes it accordingly.
4. Script Execution: The <script> tag within the HTML is identified, and the JavaScript code alert() is executed.

Example of data:image/jpeg in <object>:
```html
<object data="data:image/jpeg;base64,..."></object>
```
1. Parsing the URL: The browser sees that the data attribute contains a data: URL with the MIME type image/jpeg.
2. Base64 Decoding: The browser decodes the Base64-encoded content expecting it to represent a JPEG image.
3. Image Rendering: The browser attempts to render the decoded content as an image. If the content is not a valid JPEG image, it will fail to display.


**Conclusion**

- When the server is encoding <, >, and / as HTML entities (&lt;, &gt;, and &#47;), it's likely part of its defense mechanism to prevent XSS attacks.
to prevent cross-site scripting (XSS) attacks by neutralizing potentially harmful characters in user inputs or urls. 
the server might not apply this encoding process, as Base64 encoding is typically used for data that should be interpreted as-is, without any modification.
(this is because the server likely interprets Base64-encoded data as binary or non-textual data that should not be modified or processed as HTML).

- MIME Type Determines Interpretation: The MIME type in the data: URL dictates how the browser interprets and processes the content. text/html allows for HTML and script execution, while image/jpeg and text/plain do not.

- XSS Vulnerability Exploitation: By encoding a script in Base64 and using a data:text/html URL, you can bypass certain security measures and execute scripts in the browser, leading to XSS


**to prevent**
Browser Behavior: Modern browsers have security measures to prevent script execution from unintended contexts, but these can be bypassed if the content is interpreted as HTML.
XSS (Cross Site Scripting) Prevention Cheat Sheet:
https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html


**resources**

HTML entities: https://developer.mozilla.org/en-US/docs/Glossary/Entity
Data URLs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
URI mdn: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web
the data url RFC : https://www.rfc-editor.org/rfc/rfc2397#section-2
