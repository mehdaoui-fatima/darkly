### <code style="color : orangered">**first-test**</code>

try to write any basic SQL SELECT Statement in members input field as it is vulnerable to SQL injection

> You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'select \*' at line 1

we write to the search field `74 or 1=1` or `74 or 1=1--` we can replace 74 by any other random id.
the input have a label:` SEARCH MEMBER BY ID` so the original query may be something similar to SELECT <column_name1>, <column_name2> FROM <table_name> WHERE ID = "id_number".
the injected query `74 or 1=1-- ` is typically combined with the original query by the application's backend code before being sent to the database for execution. so the resulted query is something like

> `SELECT <column_name1>, <column_name2> FROM <table_nams> WHERE ID = 74 or 1=1`

In this case, the injected part `74 OR 1=1--` causes the query to return all rows from the users table because 1=1 is always true. The -- at the end is used to comment out the rest of the original query to avoid syntax errors.(it's not necessary to use the hyphens).

> result
> ID: 74 or 1=1
> First name: one
> Surname : me

> [!NOTE]
> the result show that the original select statement, query over two columns and this is a very important information to use in the sql query injection.

### <code style="color : orangered">**Detecting number of columns**</code>

The `UNION` operator is used to combine the result-set of two or more `SELECT` statements

- Every `SELECT` statement within `UNION` must have the same number of columns
- The columns must also have similar data types
- The columns in every `SELECT` statement must also be in the same order, syntaxe example :

> SELECT _column_name(s)_ FROM _table1_ UNION SELECT _column_name(s)_ FROM _table2_;

To determine the number of columns in a query, select more and more null values until the query is correct:

> 74 or 1=1 UNION SELECT null // The used SELECT statements have a different number of columns
> 74 or 1=1 UNION SELECT null,null // worked
> ``
