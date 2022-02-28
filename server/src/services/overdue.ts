import { Schemas } from "@nprindle/augustus";
import { serverConfiguration } from "../util/config.js";
import { dbTransaction } from "../util/db.js";
import { currentTimeSeconds, sleepSeconds } from "../util/time.js";
import { dontValidate, optionallyNullArrayOfSchema } from "../util/typeGuards.js";


export async function overdueCheckLoop(): Promise<void> {
  while (true) {
    try {
      const now = currentTimeSeconds();
      const info = await dbTransaction(async query => {
        const queryResult = await query(
          `with task_watcher_addresses as (
            select task, array_agg(email) as watcher_emails
            from watch_assignments join users on watcher = user_uuid group by task
          ), overdue_tasks as (
            select task, watcher_emails, title, deadline_seconds, task_owner
            from task_watcher_addresses join tasks on task = task_id
            where deadline_seconds < $1 and notification_sent = FALSE
          )
          select task as task_id, watcher_emails, title, deadline_seconds,
          task_owner, username as owner_username, full_name as owner_full_name, nickname as owner_nickname
          from overdue_tasks join users on task_owner = user_uuid;`,
          [now],
          Schemas.recordOf({
            task_id: Schemas.aString,
            watcher_emails: optionallyNullArrayOfSchema(Schemas.aString),
            title: Schemas.aString,
            deadline_seconds: Schemas.aNumber,
            task_owner: Schemas.aString,
            owner_username: Schemas.aString,
            owner_full_name: Schemas.aString,
            owner_nickname: Schemas.aString,
          })
        );
        await query(`update tasks set notification_sent = TRUE where deadline_seconds < $1`, [now], dontValidate);
        return queryResult;
      });
      // TODO construct and send emails
      console.log("task notification info:");
      console.log(info);
    } catch (err) {
      console.error(err);
    }
    await sleepSeconds(serverConfiguration.secondsBetweenChecks);
  }
}
