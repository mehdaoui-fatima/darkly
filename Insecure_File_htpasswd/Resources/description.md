# Insecure File (.htpasswd)

### How we find it ?

I started by checking the `robots.txt` file on the website. It showed a hidden path `/whatever`. Visiting this path, I found a `.htpasswd` file with a username and a hashed password. After cracking the hash, I got the password and used it with the username to log in to the `/admin` page. This gave me access to the restricted area where I found the flag.

**robots.txt content :** 
``` 
User-agent: *
Disallow: /whatever
Disallow: /.hidden
```

**(.htpasswd) content :**
`root:437394baff5aa33daa618be47b75cb49` 

**(.htpasswd) after Md5  Decrypt :**
`root:qwerty123@`

### How to prevent ?

- Don’t use `robots.txt` to hide sensitive files or paths. It’s not secure and can be easily checked.
- Block access to `.htpasswd` files in the server settings to keep them safe.
- Use strong password hashing, like bcrypt, to make cracking harder.
- Restrict access to sensitive areas, like `/admin`, using IP restrictions or stronger authentication methods like 2FA.
