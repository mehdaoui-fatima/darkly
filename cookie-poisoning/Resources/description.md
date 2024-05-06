### Title: <span style="color:blue">Client-side cookie poisoning</span>

**Attack description:**

Client-side cookie poisoning refers to the manipulation of cookies that are stored on the client side, typically within a user's web browser. These cookies are often used to store user-specific information, such as session identifiers, preferences, or tracking data.

Here's a breakdown of what client-side cookie poisoning involves:

Manipulation of Cookie Values: This involves modifying the content of cookies stored on the client side. This can be done through various means, such as using browser developer tools, browser extensions, or through scripts injected into web pages.

Unauthorized Modification: Client-side cookie poisoning occurs when the modification of cookie values is unauthorized or performed without the user's consent. This could involve changing the values of cookies to gain unauthorized access to a website or to manipulate the behavior of the website in unintended ways.

Potential Risks: The risks associated with client-side cookie poisoning include compromising user privacy, enabling session hijacking, bypassing authentication mechanisms, or injecting malicious code into web pages.

Impact on Security: Depending on the nature of the modifications, client-side cookie poisoning can have significant security implications for both users and websites. It can lead to security vulnerabilities, data breaches, and other malicious activities.

To mitigate the risks of client-side cookie poisoning, website developers should implement proper security measures, such as encrypting sensitive cookie data, validating and sanitizing input, implementing secure authentication mechanisms, and regularly monitoring for suspicious activities. 

Users should also be cautious about granting permissions to browser extensions and should regularly review and clear their cookies to minimize the risk of unauthorized manipulation.


**cookies definition:**

refers to a small piece of data that a website stores on a user's device. When you visit a website, the site may send one or more cookies to your browser.
The browser may store cookies, create new cookies, modify existing ones, and send them back to the same server with later requests.


**Step1:**

using browser developer tools, inside application panel's storage section, particularly within the cookies section, we can see associated cookies with the current website. This includes viewing details about each cookie, such as its name, value, domain, expiration date, and other attributes. we can also add, edit, or delete cookies as needed for testing purposes.


| Name               | value                    |
|--------------------|--------------------------|
| I_am_admin         | 68934a3e9455fa72420237eb05902327 |

* Name : the name assigned to the cookie when it was created.
* Value: The value of a cookie refers to the data associated with the cookie. It's the information stored within the cookie that the web application can access and use.

**Step2:**
using dcode to analysis the value and it is identifying "68934a3e9455fa72420237eb05902327" as MD5 encrypted
decrypt the value using md5 : false

Value: "false" indicates that the value stored for the key "I_am_admin" is currently set to "false". In the context of the website, this could imply that the user is not currently identified as an administrator. we tried to change it to true in order to change the user privileges: 

md5(true): b326b5062b2f0e69046810717534cb09 edit the value in the browser to be to be, and refresh to use the new value of the setted cookie 

| Name               | value                    |
|--------------------|--------------------------|
| I_am_admin         | b326b5062b2f0e69046810717534cb09 |

an alert prompt : 
Good job! Flag : df2eb4ba34ed059a1e3e89ff4dfc13445f104a1a52295214def1c4fb1693a5c3

**Resources**

cookies mdn: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
dDcode: https://www.dcode.fr/hash-md5
cookie-poisoning: https://www.invicti.com/learn/cookie-poisoning/