CREATE TABLE IF NOT EXISTS people (
    id              serial PRIMARY KEY,
    firstname       varchar(40) NOT NULL,
    lastname        varchar(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS emails (
    id          serial PRIMARY KEY,
    email       varchar(256) NOT NULL,
    person      integer REFERENCES people (id),
    “primary”   boolean DEFAULT false
);