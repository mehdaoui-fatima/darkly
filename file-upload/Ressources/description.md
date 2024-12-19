
### Title: <span style="color:blue">File upload - don't trust the Content-Type header as it can be spoofed</span>

A `file upload` vulnerability occurs when an application does not properly handle the uploading of files, 
allowing to upload malicious files that can compromise the server or users.

* the server  server allows users to upload files to its filesystem 
without sufficiently validating their name, type, contents, or size.

* Failing to properly enforce restrictions on these could mean that even a basic image upload function can be used
to upload arbitrary and potentially dangerous files instead.
This could even include server-side script files that enable remote code execution.


**Location:** `${IP}/?page=upload#`

**step0:** understand how do web servers handel requests for static files 

The process for handling these static files is still largely the same,At some point, 
the server parses the path in the request to identify the file extension. It then uses this
to determine the type of the file being requested,
typically by comparing it to a list of preconfigured mappings between extensions and MIME types.
What happens next depends on the file type and the server’s configuration.

* If this file type is non-executable, such as an image or a static HTML page, 
the server may just send the file’s contents to the client in an HTTP response.

* If the file type is executable, such as a PHP file, and the server is configured 
to execute files of this type, it will assign variables based on the headers and parameters 
in the HTTP request before running the script. The resulting output may then be sent to the client in an HTTP response.

* If the file type is executable, but the server is not configured to execute files of this type, 
it will generally respond with an error. However, in some cases, the contents of the file may still be 
served to the client as plain text. Such misconfigurations can occasionally be exploited to leak source code
and other sensitive information


**Step 1:** Detecting File Upload Vulnerability

Check what our server is vulnerable to.

`Extension Validation/File Type Validation:`

Our server only accepts `.jpg` extensions and a proper filter is set in place to avoid certain known bypasses,
such as the following:
* Double extensions, e.g., image.jpg.php, where it circumvents the regex \.jpg easily.
* Null bytes, e.g., image.php%00.jpg, where .jpg gets truncated, and .php becomes the new extension.
* Zip files.
* sized images

> The message result of these attempts: `Your image was not uploaded`.

`File Storage Location:`
The server is also protected against changing the location to store the file in a different path, 
or overwrite an existing file on the system threats.

for instance naming the image as follows:
/etc/passwd/image_test.jpg This prevents storing files outside `/tmp/`, the location where the server stores the uploaded files, 
and redirects them to `/etc/passwd` where only administrative access is allowed. However, a message like:
`/tmp/:etc:passwd:image-test.jpg successfully uploaded.`
The colons (:) replacing slashes (/) in the message indicate that the server is attempting to sanitize or encode
the file path to prevent directory traversal attacks. 
This is a common security measure where the server replaces or escapes certain characters
that could be used maliciously to traverse directories.

> This shows that the server sanitizes the name of the uploaded files against path traversal.


`Content-Type Validation`

The Content-Type for uploaded files is provided by the user, and as such cannot be trusted, as it is trivial to spoof.
submiting .php file using curl but changing the Content-Type to `image/jpg` shows that our server is vulnerable of content type validation, 

* in the browser dev tool in network tab, the copy as cURL of the file upload request changing
the Content-Type from text/php to image/jpg.

* or by using curl : 
curl -X POST -F "MAX_FILE_SIZE=1000000"  -F "Upload=Upload" -F 'uploaded=@mal.php;type=image/jpg' http://10.12.100.227/\?page\=upload | grep "flag"

The given `curl` command is used to test a file upload functionality attempting to upload a file (mal.php)
with a specific content type (image/jpg). Here's a detailed breakdown of each part of the command:

curl -X POST:

curl is a command-line tool for transferring data with URLs.

* -X POST specifies that the HTTP method used is POST, which is typically used for uploading data.

* -F "Upload=Upload": sends a form field named Upload with the value Upload

* -F 'uploaded=@mal.php;type=image/jpg': specifies a form field named uploaded.
@mal.php tells curl to read the contents of the local file named mal.php and upload it.

* type=image/jpg explicitly sets the MIME type of the file being uploaded to image/jpg, even though the file is a PHP script.
This is the attempt to bypass file type validation on the server.

* http://IP/?page=upload: the URL to which the request is being sent.(with IP is our URL of the server)

* | grep "flag": The pipe (|) takes the output of the curl command and passes it to the grep command.
grep "flag" searches the output for occurrences of the word "flag".

> The flag is : 46910d9ce35b385885a9f7e2b336249d622f29b267a1771fbacf52133beddba8


**to prevent** 
Preventing users from changing the content type validation manually can be challenging, 
as it often involves a combination of client-side and server-side measures.
use can use :

* Content-Type Header Checking: When a file is uploaded, check the Content-Type header in the HTTP request
to verify that it matches the expected file type.Do not rely solely on the file extension or the type attribute in the input element.

* File Signature Checking: Use file signature checking (also known as magic number checking) to verify the actual file contents. 
Each file type has a unique signature at the beginning of the file that can be used to identify the file type, 
regardless of its extension.

* Regular Security Audits: Regularly audit your file upload functionality for security vulnerabilities and 
keep your server and libraries up to date to protect against known vulnerabilities.

**Resources**
File Upload vulnerabilities Cheat Sheet: 
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files
https://cyberw1ng.medium.com/understanding-file-upload-vulnerabilities-in-web-app-penetration-testing-6de583fba63f#:~:text=File%20upload%20vulnerabilities%20are%20when,type%2C%20contents%2C%20or%20size.