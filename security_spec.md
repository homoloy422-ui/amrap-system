# Security Specification: Iron Titan Gym

## Data Invariants
1. A Member must have a valid `fullName` and `phone`.
2. A Payment must be linked to an existing `memberId`.
3. `dueDate` must be a valid date string.
4. Only authenticated admins can write to any collection.
5. Users cannot modify their own `status` or `dueDate` without admin intervention (though this app is primarily for an Admin owner, so we treat the Admin as the only writer).

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to create a member with a different `ownerId` (if we had ownerId, but here we'll check if a non-admin can write).
2. **Ghost Field**: Adding `isAdmin: true` to a member document.
3. **Negative Fee**: Setting `feesAmount: -500`.
4. **Invalid Date**: Setting `dueDate: "not-a-date"`.
5. **Huge Payload**: Member notes with 2MB of text.
6. **Orphaned Payment**: Payment for a non-existent `memberId`.
7. **Bypass Enum**: Setting `gender: "cyberpunk"`.
8. **Invalid ID Poisoning**: Specifying a document ID as a very long malicious string.
9. **Unauthorized Delete**: Non-admin attempting to delete a member.
10. **State Shortcut**: Changing a payment status from `unpaid` to `paid` without specifying the amount.
11. **PII Leak**: Authenticated non-admin user trying to list all members' WhatsApp numbers.
12. **Attendance Forgery**: Checking in for another member.

## Test Runner (Mock)
(I will implement the rules to block these)
