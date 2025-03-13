# Case Insensitive Login
For case insensitive login make sure the the unique index in the users database is set to nocase.
```
CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email` COLLATE NOCASE) WHERE `email` != ''
```