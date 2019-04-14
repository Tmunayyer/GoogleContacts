
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "googleuser" varchar(50) UNIQUE,
  "access_token" varchar(255),
  "sync_token" varchar(255),
  "session" varchar(100)
);

CREATE TABLE "comments" (
  "id" bigserial PRIMARY KEY,
  "users_googleuser" varchar(50) REFERENCES users(googleuser),
  "name" varchar(50),
  "phone_number" varchar(20),
  "email" varchar(25),
  "comment" varchar(100)
);
