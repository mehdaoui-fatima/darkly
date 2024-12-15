# How we find it ?

We found the flag by looking at the robots.txt file, which showed a hidden path /.hidden. When we visited this path, we found a list of directories and README files. Some of these README files contained random sentences, but using a script to scrape all the files and looking for lines with numbers, we found one that had the flag. This happened because the directory listing was turned on, allowing us to see all the files, and the flag was hidden in a README file that was publicly accessible.

## how to use the script :

```
npm i
```

Fetch content of all READMEs and assemble them on results.txt :
```
node file.js
```
Find the line contains the flag from the file `results.txt`
```
cat results.txt | grep flag 
```


# How to prevent ?
- The robots.txt file is not a security measure. It's meant for controlling which pages are indexed by search engines. It doesn’t prevent direct access to the files. Sensitive directories should be properly protected with access control mechanisms, not just hidden in robots.txt.

- Never store sensitive information, such as flags or credentials, in publicly accessible files. If files need to be stored publicly, ensure they don't contain sensitive data, or encrypt them.

- Ensure that sensitive files like README are not world-readable. This can be done by adjusting file permissions so that only authorized users can access them.

- Directories like /.hidden should not be publicly accessible. If you need to restrict access to specific directories, you can use authentication mechanisms (e.g., basic authentication, IP whitelisting, or more advanced access controls).