# Brute-Force

### How We Found It

On the signin page, we are asked to enter a username and password. We guess that the admin account might use a common username like "admin." To find the correct password, we used a brute-force method, where we try a list of common passwords one by one. The script sends a login request for each password and checks the page response.

If the password is wrong, the page shows an image `<img src="images/WrongAnswer.gif" alt="">`. If the password is correct, the image does not appear. By checking the response, we can tell if the login was successful. When we tried the password "shadow," we did not see the "WrongAnswer.gif" image, which meant the login was successful. This allowed us to get the flag.

The list of common passwords used in this brute-force attempt is from [Daniel Miessler's Security List](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-100.txt), which includes passwords people often use. After finding the correct password, logging in revealed the flag.

### How to Prevent It

To prevent brute-force attacks like this, there are several things you can do:

1. **Rate Limiting**: Limit the number of login attempts from the same IP address in a short time. This will slow down or stop attackers who try many passwords quickly.

2. **CAPTCHA**: Add a CAPTCHA (a test to tell humans from bots) after a few wrong login attempts. This stops automated scripts from continuing to guess passwords.

3. **Account Lockout**: Lock an account for a short time after several failed login attempts. This prevents attackers from trying many passwords in a row.

4. **Strong Passwords**: Make sure users create strong passwords with a mix of uppercase and lowercase letters, numbers, and symbols. This makes it harder for attackers to guess the password.

5. **Multi-Factor Authentication (MFA)**: Use MFA, which requires users to verify their identity in two ways (e.g., a password and a code sent to their phone). Even if someone knows the password, they won't be able to log in without the second verification step.
