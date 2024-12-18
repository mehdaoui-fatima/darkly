# File Updaod

### How We Found It

On the upload page of the website, we found an option to upload files. To test its security, we uploaded a PHP file (`index.php`) disguised as an image by manipulating its MIME type to `image/jpeg`. This trick was done in a single request using the `-F` option in `curl`, which allows us to simulate a file upload by sending form data. By specifying the MIME type as `image/jpeg` using `;type=image/jpeg`, we made the server believe the file was a harmless image, even though it was actually executable PHP code.

When the server processed our request, it returned a response. Using the `grep` command to filter the response, we searched for the word "flag" and extracted the flag directly. This shows how weak file upload validation can allow attackers to upload malicious files and gain access to sensitive information.

### Steps to Find the Flag Using the Command

To find the flag, we used the following `curl` command to upload a file to the server and search for the flag in the response. Before running this command, make sure you create a have named `index.php` in the current directory.

```bash
curl -X POST -F "Upload=Upload" -F 'uploaded=@index.php;type=image/jpeg' http://192.168.64.2/?page=upload | grep flag
```

### How to Prevent This

1. **Validate File Content**  
   Check the actual file content to ensure it matches its declared type, not just the MIME type or file extension.

2. **Allow Specific File Types**  
   Only permit safe file types like `.jpg`, `.png`, or `.pdf`.

3. **Rename Files**  
   Save uploaded files with random, unique names to prevent malicious scripts from being accessible.

4. **Use Non-Executable Directories**  
   Store uploaded files in directories where code execution is disabled.

5. **Limit Upload Permissions**  
   Allow uploads only for authenticated users and monitor activity for suspicious behavior.
