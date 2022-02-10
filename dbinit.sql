\c postgres

DROP DATABASE IF EXISTS busybody;
CREATE DATABASE busybody
    TEMPLATE template0
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8';

\c busybody;

CREATE TABLE users(
    user_uuid UUID PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    email TEXT NOT NULL
);

-- user log-in sessions
CREATE TABLE sessions(
    token TEXT PRIMARY KEY,
    user_uuid UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE,
);


-- set up example data
do $$
<<setup>>
declare
  -- currently using 'beepboop', which matches this hash
  -- TODO change example account password and keep it secret
  example_password_hash TEXT := '$2b$09$CNpJ2n9Tgz8Qgz0EbXfXg.ImFxY3A0sP0o3.alzzgAsxLm47O.rJm';

  -- fake UUIDs
  georgeUUID UUID := '00000001-0000-0000-0000-000000000000';


begin
    INSERT INTO users
      ("user_uuid", "username", "full_name", "nickname", "bcrypt_hash", "email") VALUES
    -- gpb (George P Burdell)
    (georgeUUID, 'gpb', 'George P. Burdell', 'George', example_password_hash,'gburdell@gatech.edu');

   COMMIT;
   RAISE NOTICE 'Finished creating example users';
end setup $$;
