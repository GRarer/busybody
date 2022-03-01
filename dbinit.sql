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

CREATE TABLE tasks(
    task_id UUID PRIMARY KEY,
    task_owner UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE,
    title TEXT not null,
    description_text TEXT not null,
    deadline_seconds BIGINT not null, -- data/time represented as seconds since epoch,
    notification_sent BOOLEAN not null default FALSE
);

CREATE TABLE watch_assignments(
    watcher UUID NOT NULL REFERENCES users (user_uuid) ON DELETE CASCADE,
    task UUID NOT NULL REFERENCES tasks (task_id) ON DELETE CASCADE
);

CREATE VIEW tasks_with_watcher_uuids as
    with watching as (
        select task, array_agg(watcher) as watcher_uuids
        from watch_assignments join users on users.user_uuid = watcher group by task
    ) select * from tasks left join watching on tasks.task_id = watching.task;

-- set up example data
do $$
<<setup>>
declare
  example_password_hash TEXT := '$2b$10$pXTLH5NwenRKsS33I83Mp.bAiDn1mVNh1yfDN/ogrKatvW.mlOIYS';

  -- fake user UUIDs
  georgeUUID UUID  := '00000001-0000-0000-0000-000000000000';
  ramonaUUID UUID  := '00000002-0000-0000-0000-000000000000';
  johnUUID UUID    := '00000003-0000-0000-0000-000000000000';
  nicolasUUID UUID := '00000004-0000-0000-0000-000000000000';
  claudeUUID UUID  := '00000005-0000-0000-0000-000000000000';
  josiaUUID UUID   := '00000006-0000-0000-0000-000000000000';

  -- fake task UUIDs
  taskIdTrisect  UUID     := '00000001-0000-0000-0000-A00000000000';
  taskIdSquareCircle UUID := '00000002-0000-0000-0000-A00000000000';
  taskIdStealT  UUID      := '00000003-0000-0000-0000-A00000000000';
  taskIdRegister  UUID    := '00000004-0000-0000-0000-A00000000000';
  taskIdEthicsHW  UUID    := '00000005-0000-0000-0000-A00000000000';
  taskIdAlumniEvent UUID  := '00000006-0000-0000-0000-A00000000000';

  -- example dates (in seconds since epoch) for example tasks
  dateApril1 bigint        := 1648828800; -- noon april 1st 2022 eastern daylight time
  dateMarch15 bigint       := 1647333000; -- 4:40pm march 15th 2022 eastern daylight time
  dateNewYearsEve22 bigint := 1672504200; -- 11:30pm new years eve eastern standard time
  dateJanuary31 bigint     := 1643605200; -- beginning of jan 31 2022 eastern standard time

begin
    INSERT INTO users ("user_uuid", "username", "full_name", "nickname", "password_hash", "email") VALUES
    -- example users based on fictitious academics
    (georgeUUID, 'gpb', 'George P. Burdell', 'George', example_password_hash,'gburdell@gatech.example'),
    (ramonaUUID, 'ramona', 'Ramona Cartwright Burdell', 'Ramona', example_password_hash, 'ramonac@agnesscott.example'),
    (johnUUID, 'jrainwater', 'John Rainwater', 'John', example_password_hash, 'rainwaterj@uw.example'),
    (nicolasUUID, 'newmath', 'Nicolas Bourbaki', 'Nicolas', example_password_hash, 'bourbakigroup@example.example'),
    -- this user's name should be Claude Émile Jean-Baptiste Litre
    -- creating or updating data with non-ascii characters works correctly in the server and is only broken for pqsl
    -- and probably only on windows
    (claudeUUID, 'Litre', 'Claude Emile Jean-Baptiste Litre', 'Claude', example_password_hash, 'litre@UWaterloo.example'),
    (josiaUUID, 'crackpot', 'Josiah S. Carberry', 'Jed', example_password_hash, 'carberry@brown.example');

    INSERT INTO friendships (user_a, user_b) VALUES
    (georgeUUID, ramonaUUID),
    (ramonaUUID, johnUUID),
    (georgeUUID, johnUUID),
    (josiaUUID, georgeUUID);

    INSERT INTO friend_requests (from_user, to_user) VALUES
    (georgeUUID, claudeUUID),
    (nicolasUUID, ramonaUUID),
    (nicolasUUID, georgeUUID);

    INSERT into tasks (task_id, task_owner, title, description_text, deadline_seconds) VALUES
    (taskIdTrisect, johnUUID, 'Trisect Angle', 'Demonstrate trisecting an angle with a compass and straight-edge. This is definitely possible.', dateNewYearsEve22),
    (taskIdSquareCircle, johnUUID, 'Square The Circle', 'Demonstrate making a square the same size as a given circle using a compass and straight edge.', dateJanuary31),
    (taskIdEthicsHW, georgeUUID, 'Object Oriented Ethics Homework #1', 'The first homework for CS 3221 Object Oriented Ethics.', dateApril1),
    (taskIdStealT, georgeUUID, 'Steal the T', 'Participate in this Georgia Tech tradition.', dateNewYearsEve22),
    (taskIdRegister, georgeUUID, 'Register for classes', '', dateMarch15),
    (taskIdAlumniEvent, ramonaUUID, 'Organize alumni event', 'Coordinate preparation for Agnes Scott Alumni Event', dateApril1);

    INSERT into watch_assignments (watcher, task) VALUES
    (georgeUUID, taskIdTrisect),
    (georgeUUID, taskIdSquareCircle),
    (ramonaUUID, taskIdSquareCircle),
    (georgeUUID, taskIdAlumniEvent),
    (ramonaUUID, taskIdStealT),
    (josiaUUID, taskIdStealT),
    (johnUUID, taskIdEthicsHW);

   COMMIT;
   RAISE NOTICE 'Finished populating example data';
end setup $$;
