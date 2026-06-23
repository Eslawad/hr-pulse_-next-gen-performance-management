# HR Pulse Security Specification

## Data Invariants
- Users can only read their own profile.
- Employees can only create/read their own goals.
- Managers can only read goals of their direct reports.
- Admins can read all goals but ONLY modify system-level fields.
- Goal weightage must be verified on update (though rules are limited in sum checks, we enforce per-goal min/max).

## The "Dirty Dozen" Payloads (Denial Expected)
1. Creating a goal for another user.
2. Updating a goal after it's been approved (locked).
3. Modifying `weightage` to a negative value.
4. Setting `managerId` to oneself to bypass approval.
5. Reading audit logs as an employee.
6. Deleting a goal that belongs to someone else.
7. Creating a user profile with an `admin` role as a guest.
8. Updating another user's `managerId`.
9. Overwriting the `status` of a goal without being the manager.
10. Reading another project's cycle configs.
11. Injecting a 1MB string into the `title` field.
12. Updating `createdAt` timestamp.

## Firestore Rules
(Implemented in firestore.rules)
