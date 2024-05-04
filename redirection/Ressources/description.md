# REDIRECTS

### How we find it?
On the homepage, while inspecting the social network icons, we discovered the following HTML code:

<li><a href="index.php?page=redirect&amp;site=facebook" class="icon fa-facebook"></a></li>
<li><a href="index.php?page=redirect&amp;site=twitter" class="icon fa-twitter"></a></li>
<li><a href="index.php?page=redirect&amp;site=instagram" class="icon fa-instagram"></a></li>

When we replaced site=facebook, site=twitter, and site=instagram with site=test or with any value, we observed the same flag for each one of them.

### Prevention:

- Input Validation: Validate all user inputs, especially those that are used in sensitive operations like redirect URLs. Ensure that the input has the expected patterns or formats. In this case, we might restrict the site parameter to only accept predefined values like "facebook", "twitter", and "instagram".
- Least Privilege Principle: Ensure that any operations performed using user input are done with the least possible privilege.
- Whitelisting: Using a whitelist approach allows you to explicitly define which values are allowed for parameters like the redirect destination. By only accepting predefined and trusted values, you can prevent invalid redirects caused by unauthorized input.