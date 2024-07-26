# md-setup-attachment-dirs

> WARNING: This is script operates on each MDaemon user's mailbox.

Script for [MDaemon](https://mdaemon.com/) to **force change** the
**folder type** to _document_ in
each folder that matches

    {{USER_MAILBOX_DIR}}\DOCUMENTS.IMAP\X-ATTACHMENTS.IMAP\{{SENDER}}.IMAP\Hiwater.mrk

Search if `Hiwater.mrk` database exist, or create a new one, and
set `/Groupware/FolderClass` to `IPF.Document`:

```ini
[Groupware]
FolderClass=IPF.Document
```

## Installation

Prerequisites: [Node.js](https://nodejs.org/)

```dos
C:\>node --version
v20.16.0

C:\>
```

Git clone this repository, or download a source bundle (Code &rarr; Download ZIP):

```dos
C:\>git clone https://github.com/ealib/md-setup-attachment-dirs.git
```

Install all script dependencies:

```dos
C:\>cd md-setup-attachment-dirs

C:\md-setup-attachment-dirs>yarn install
```

## Usage

```dos
C:\md-setup-attachment-dirs>yarn start
yarn run v1.22.22
$ node index.js

MDaemon path    : C:\MDaemon\    
MDaemon app path: C:\MDaemon\APP\
MDaemon version : 24.0.1        

Scanning user mailboxes:

(1) MDaemon Server <MDaemon@example.com>
        mailbox    : C:\MDaemon\Users\example.com\MDaemon

(2) Example User <example.user@example.com>
        mailbox    : C:\MDaemon\Users\example.com\example.user
        attachments: C:\MDaemon\Users\example.com\example.user\Documents.IMAP\X-ATTACHMENTS.IMAP
                 bob@acme.com
                         C:\MDaemon\Users\example.com\example.user\Documents.IMAP\X-ATTACHMENTS.IMAP\bob@acme.com.IMAP\Hiwater.mrk

(3) user <user@example.com>
        mailbox    : C:\MDaemon\Users\example.com\user

Done in 0.46s.

C:\md-setup-attachment-dirs>
```

## Dependencies

- [chalk](https://www.npmjs.com/package/chalk)
- [fs-extra](https://www.npmjs.com/package/fs-extra)
- [ini](https://www.npmjs.com/package/ini)
- [node-mdaemon-api](https://www.npmjs.com/package/node-mdaemon-api)

## Stay in touch

- Author - Emanuele Aliberti
- Website - [mtka.eu](https://mtka.eu/software/node-mdaemon-api)
- Matrix - [mdaemon-dev](https://matrix.to/#/#mdaemon-dev:matrix.org)

## Legal disclaimer

MDaemon® is a trademark of [MDaemon Technologies, Ltd.](https://mdaemon.com/pages/about-us)
MDaemon Technologies makes no representations, endorsements, or
warranties regarding Third Party Products or Services.

Node.js is a trademark of [OpenJS Foundation](https://openjsf.org/).

Windows&trade; is a [trademark of Microsoft Corp.](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks)

## License

`md-setup-attachment-dirs` is [MIT licensed](LICENSE.md).
