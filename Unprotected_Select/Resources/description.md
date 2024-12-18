# Web Parameter Tampering

### How we find it ?

On the survey page `?page=survey`, there are multiple forms. Each form includes a dropdown where you can select a value between 1 and 10. You can also view the form in the browser's developer tools.

```
<form action="#" method="post">
	<input type="hidden" name="sujet" value="3">
	<select name="valeur" onchange="javascript:this.form.submit();">
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
		<option value="7">7</option>
		<option value="8">8</option>
		<option value="9">9</option>
		<option value="10">10</option>
	</select>
</form>
```

When updating the value of the option of a select for a bigger one (e.g. 1000000), and selecting this option, the server sends back a page containing the flag!

### How to prevent ?

Always validate user input on the server side, as it can not be trusted.

Users can change option values using browser developer tools or send modified requests from outside the browser.

In this case, the server must ensure the submitted value is an integer strictly between 1 and 10.
