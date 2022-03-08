import { Schemas } from '@nprindle/augustus';
import { serverConfiguration } from '../util/config.js';
import { dbQuery, dbTransaction } from '../util/db.js';
import { currentTimeSeconds, sleepSeconds } from 'busybody-core';
import { dontValidate, optionallyNullArrayOfSchema } from '../util/typeGuards.js';
import { sendWatcherEmail } from './mail/mail.js';

// loop to repeatedly check for overdue tasks or expired verification codes
export async function loop(): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // send emails for overdue tasks
    try {
      const now = currentTimeSeconds();
      const tasksToNotify = await dbTransaction(async query => {
        const queryResult = await query(
          `with task_watcher_addresses as (
            select task, array_agg(email) as watcher_emails
            from watch_assignments join users on watcher = user_uuid group by task
          ), overdue_tasks as (
            select task, watcher_emails, title, description_text, deadline_seconds, task_owner
            from task_watcher_addresses join tasks on task = task_id
            where deadline_seconds < $1 and notification_sent = FALSE
          )
          select task as task_id, watcher_emails, title, description_text, deadline_seconds,
          task_owner, username as owner_username, full_name as owner_full_name, nickname as owner_nickname
          from overdue_tasks join users on task_owner = user_uuid;`,
          [now],
          Schemas.recordOf({
            task_id: Schemas.aString,
            watcher_emails: optionallyNullArrayOfSchema(Schemas.aString),
            title: Schemas.aString,
            description_text: Schemas.aString,
            deadline_seconds: Schemas.aNumber,
            task_owner: Schemas.aString,
            owner_username: Schemas.aString,
            owner_full_name: Schemas.aString,
            owner_nickname: Schemas.aString,
          })
        );
        await query('update tasks set notification_sent = TRUE where deadline_seconds < $1', [now], dontValidate);
        return queryResult;
      });
      for (const task of tasksToNotify) {
        sendWatcherEmail({
          taskDescription: task.description_text,
          taskTitle: task.title,
          ownerNickname: task.owner_nickname,
          ownerFullName: task.owner_full_name,
          watcherAddresses: task.watcher_emails
        });
      }
    } catch (err) {
      console.error(err);
    }
    // delete expired verification codes
    try {
      const nowSeconds = currentTimeSeconds();
      await dbQuery(`delete from password_reset_requests where expiration < $1;`, [nowSeconds], dontValidate);
      await dbQuery(`delete from email_verification_codes where expiration < $1;`, [nowSeconds], dontValidate);
    } catch (err) {
      console.log(err);
    }
    await sleepSeconds(serverConfiguration.secondsBetweenChecks);
  }
}
