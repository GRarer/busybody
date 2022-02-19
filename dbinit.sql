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
    user_uuid UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE
);

CREATE TABLE friendships(
    user_a UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE
);

-- friendships can be represented in either order; unioning both directions makes it easier to list a user's friends
CREATE VIEW friends_symmetric as
    select user_a as this_user, user_b as friend from friendships UNION
    select user_b as this_user, user_a as friend from friendships;

CREATE TABLE friend_requests(
    from_user UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE,
    to_user UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE
);

-- set up example data
do $$
<<setup>>
declare
  example_password_hash TEXT := '$2b$10$pXTLH5NwenRKsS33I83Mp.bAiDn1mVNh1yfDN/ogrKatvW.mlOIYS';

  -- fake UUIDs
  georgeUUID UUID  := '00000001-0000-0000-0000-000000000000';
  ramonaUUID UUID  := '00000002-0000-0000-0000-000000000000';
  johnUUID UUID    := '00000003-0000-0000-0000-000000000000';
  nicolasUUID UUID := '00000004-0000-0000-0000-000000000000';
  claudeUUID UUID  := '00000005-0000-0000-0000-000000000000';
  josiaUUID UUID   := '00000006-0000-0000-0000-000000000000';


begin
    INSERT INTO users
      ("user_uuid", "username", "full_name", "nickname", "password_hash", "email") VALUES
    -- example users based on fictitious academics
    (georgeUUID, 'gpb', 'George P. Burdell', 'George', example_password_hash,'gburdell@gatech.example'),
    (ramonaUUID, 'ramona', 'Ramona Cartwright Burdell', 'Ramona', example_password_hash, 'ramonac@agnesscott.example'),
    (johnUUID, 'jrainwater', 'John Rainwater', 'John', example_password_hash, 'rainwaterj@uw.example'),
    (nicolasUUID, 'newmath', 'Nicolas Bourbaki', 'Nicolas', example_password_hash, 'bourbakigroup@example.example'),
    -- TODO fix handling of non-ascii characters in test data or change how test data is populated
    -- this user's name should be Claude Émile Jean-Baptiste Litre
    -- creating or updating data with non-ascii characters works correctly in the server and is only broken for pqsl
    (claudeUUID, 'Litre', 'Claude Emile Jean-Baptiste Litre', 'Claude', example_password_hash, 'litre@UWaterloo.example'),
    (josiaUUID, 'crackpot', 'Josiah S. Carberry', 'Jed', example_password_hash, 'carberry@brown.example');

    INSERT INTO friendships (user_a, user_b) VALUES
    (georgeUUID, ramonaUUID),
    (georgeUUID, johnUUID),
    (josiaUUID, georgeUUID);

    INSERT INTO friend_requests (from_user, to_user) VALUES
    (georgeUUID, claudeUUID),
    (nicolasUUID, ramonaUUID),
    (nicolasUUID, georgeUUID);

   COMMIT;
   RAISE NOTICE 'Finished creating example users';
end setup $$;
