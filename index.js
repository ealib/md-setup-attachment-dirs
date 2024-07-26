// In all "Hiwater.mrk" databases that match
//
// $USER_MAILBOX$\DOCUMENTS.IMAP\X-ATTACHMENTS.IMAP\$SENDER$.IMAP\Hiwater.mrk
//
// force /Groupware/FolderClass to "IPF.Document"
//
// [Groupware]
// FolderClass=IPF.Document

'require strict'

import chalk from 'chalk';
import fs from 'fs-extra';
import { stringify, parse } from 'ini';
import { createRequire } from 'module';

// Native modules can not be import-ed
const require = createRequire(import.meta.url);
const md = require('node-mdaemon-api');

const DOCUMENTS_IMAP = 'Documents.IMAP';
const X_ATTACHMENTS_IMAP = 'X-ATTACHMENTS.IMAP';

const HIWATER_MRK = 'Hiwater.mrk';

const INI_SEC_GROUPWARE = 'Groupware';
const INI_KEY_FOLDER_CLASS = 'FolderClass';
const INI_VALUE_IPF_DOCUMENT = 'IPF.Document';

// entry point

if (!md.isReady) {
    throw new Error('MDaemon is not ready, or it is not installed!');
}

const mdInfo = md.getMdInfo()
const mdAppPath = md.mdAppPath;
const mdPath = mdAppPath.split('\\').filter(segment => segment.toUpperCase() !== 'APP').join('\\');

console.log();
console.log('MDaemon path    :', chalk.yellow(mdPath));
console.log('MDaemon app path:', chalk.yellow(mdAppPath));
console.log('MDaemon version :', chalk.yellow(mdInfo.version.full));
console.log();

console.log('Scanning user mailboxes:');

md.readUsersSync().forEach((user, index) => {
    console.log();
    console.log(`(${1 + index})`, chalk.green(user.FullName), `<${user.Email}>`);

    const userHandle = md.MD_GetByEmail(user.Email);
    const userInfo = md.MD_GetUserInfo(userHandle);
    const mailDir = userInfo.MailDir.endsWith('\\') ? userInfo.MailDir.slice(0, -1) : userInfo.MailDir;
    md.MD_GetFree(userHandle);

    console.log('\tmailbox    :', mailDir);

    if (!fs.existsSync(mailDir)) return;

    const documentDir = [mailDir, DOCUMENTS_IMAP].join('\\');
    if (!fs.existsSync(documentDir)) return;

    const attachmentsBaseDir = [mailDir, DOCUMENTS_IMAP, X_ATTACHMENTS_IMAP].join('\\');
    if (!fs.existsSync(attachmentsBaseDir)) return;

    // OK, attachments directory exists
    console.log('\tattachments:', attachmentsBaseDir);
    const senderDirs = fs.readdirSync(attachmentsBaseDir);
    if (senderDirs.length === 0) {
        console.log(chalk.yellow('\t\tno senders'));
    } else {
        // at least one sender directory:
        // we exclude directories that are not IMAP folders for MD
        senderDirs
            .filter(sender => sender.toUpperCase().endsWith('.IMAP'))
            .forEach(sender => {
                console.log('\t\t', sender.slice(0, -5));
                const hiwaterMrk = [mailDir, DOCUMENTS_IMAP, X_ATTACHMENTS_IMAP, sender, HIWATER_MRK].join('\\');
                console.log('\t\t\t', hiwaterMrk);

                let db = {};
                if (fs.existsSync(hiwaterMrk)) {
                    const content = fs.readFileSync(hiwaterMrk, {
                        encoding: 'utf-8'
                    });
                    db = parse(content);
                    if (!db[INI_SEC_GROUPWARE]) {
                        db[INI_SEC_GROUPWARE] = {};
                    }
                    if (!db[INI_SEC_GROUPWARE][INI_KEY_FOLDER_CLASS]) {
                        db[INI_SEC_GROUPWARE][INI_KEY_FOLDER_CLASS] = {};
                    }
                    db[INI_SEC_GROUPWARE][INI_KEY_FOLDER_CLASS] = INI_VALUE_IPF_DOCUMENT;
                } else {
                    db = {
                        [INI_SEC_GROUPWARE]: {
                            [INI_KEY_FOLDER_CLASS]: INI_VALUE_IPF_DOCUMENT,
                        },
                    };
                }
                // Save the created/updated Hiwater.mrk
                const ini = stringify(db);
                fs.writeFileSync(hiwaterMrk, ini);
            });
    }
});

console.log();
