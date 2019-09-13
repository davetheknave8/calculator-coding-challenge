Instructions to Get App Running


Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en/)
- [PostrgeSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)

## Create database and table

Create a new database called `calculator-challenge` and create a `history` table:

```SQL
CREATE TABLE history (
    id SERIAL PRIMARY KEY,
    num_one integer,
    num_two integer,
    operator character varying(20)
);

```

