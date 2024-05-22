# FORGOT PASSWORD

### How we find it?
"On the survey page, we noticed that the grade input field is editable. Upon inspecting it, we found the following HTML code:

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

We attempted to modify the value by setting it to a value >= 11 (outside the range of 1 to 10) to all the <option> elements for all subjects(Laurie, Mathieu, Thor, Ly, Zaz).
We were able to obtain the flag.

### Prevention:

- Restrict Input Options: Limit user input options by using a checkboxes for exemple instead of <select>. This restricts users to selecting only predefined values within the allowed range, preventing them from manually entering invalid grades
- Client-Side Validation: Implement validation on the client-side using JS for example to ensure that the selected grade falls within the valid range (1 to 10). This can provide immediate feedback to users attempting to input invalid values.
