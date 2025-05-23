# Update Dates Plugin Test Tasks

This file contains a variety of task types to test all the features of the Update Dates Plugin.

## Tasks with Different Priorities

- [ ] Normal priority task with due date 📅 2022-05-15
- [ ] Lowest priority task with due date ⏬ 📅 2022-06-10
- [ ] Low priority task with due date 🔽 📅 2022-07-20
- [ ] Medium priority task with due date 🔼 📅 2022-08-05
- [ ] High priority task with due date ⏫ 📅 2022-09-15
- [ ] Highest priority task with due date 🔺 📅 2022-10-25

## Tasks with Different Date Types

- [ ] Task with only due date 📅 2022-11-01
- [ ] Task with only scheduled date ⏳ 2022-11-10
- [ ] Task with both due and scheduled dates ⏳ 2022-11-15 📅 2022-11-20
- [ ] Task with due date, scheduled date and start date 🛫 2022-11-05 ⏳ 2022-11-15 📅 2022-11-25
- [ ] Task with future due date (should not be affected) 📅 2025-01-01

## Recurring Tasks

- [ ] Recurring task with due date 🔁 every week 📅 2022-12-01
- [ ] Recurring task with scheduled date 🔁 every month ⏳ 2022-12-15
- [ ] Recurring high priority task ⏫ 🔁 every day 📅 2022-12-20

## Task Status Tests

- [x] Completed task with past due date 📅 2022-04-10
- [ ] Uncompleted task with past due date 📅 2022-04-15
- [x] Completed task with scheduled date ⏳ 2022-04-20
- [ ] Uncompleted task with scheduled date ⏳ 2022-04-25
- [x] Completed recurring task 🔁 every week 📅 2022-05-01

## Mixed Priority and Date Type Tasks

- [ ] Low priority 🔽 with scheduled date ⏳ 2022-05-05
- [ ] Medium priority 🔼 with due date 📅 2022-05-10 and scheduled date ⏳ 2022-05-08
- [ ] High priority ⏫ recurring task 🔁 every 2 weeks with due date 📅 2022-05-15
- [ ] Highest priority 🔺 task with start date 🛫 2022-05-01 and due date 📅 2022-05-20

## Future Dates (Should Not Be Highlighted or Updated)

- [ ] Task with future due date 📅 2025-01-01
- [ ] Task with future scheduled date ⏳ 2025-02-01
- [ ] High priority ⏫ task with future date 📅 2025-03-01

## Tasks with No Dates (Should Not Be Affected)

- [ ] Task with no date specified
- [ ] High priority ⏫ task without any dates
- [ ] Recurring task 🔁 every day with no date specified

## Tasks with Current Date (Edge Case)
<!-- Update these to today's date before testing -->

- [ ] Task with today's due date 📅 2023-10-28
- [ ] Task with today's scheduled date ⏳ 2023-10-28

## Tasks with Non-Standard Format (For Edge Case Testing)

- [ ] Task with date but no emoji 2022-05-01
- [ ] Task with emoji but non-standard date format 📅 May 1st, 2022
- [ ] Task with emoji but incomplete date 📅 2022-05

## Notes:
- Before running tests, you may want to update the "current date" tasks to today's date
- You can copy this file to different test folders to test folder exclusion
- Test all combinations of priority filters and date attribute filters