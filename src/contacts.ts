import { executeSQL } from "@raycast/utils";
import { Contact } from "./types";
import path from "path";
import { globSync } from "node:fs";
import { homedir } from "node:os";

const searchPath = path.join(homedir(), "Library/Application Support/AddressBook/**/AddressBook-v22.abcddb");

function getDatabaseFiles() {
  const files = globSync(searchPath);
  if (!files.length) {
    throw new Error("No address books found.");
  }
  return files;
}

async function getContacts(databasePath: string): Promise<Contact[]> {
  const query = `
    SELECT DISTINCT
    Z_PK AS id,
    ZFIRSTNAME AS firstName,
    ZLASTNAME AS lastName,
    TRIM(COALESCE(ZFIRSTNAME, '') || ' ' || COALESCE(ZLASTNAME, '')) AS fullName,
    ZORGANIZATION AS organization,
    ZJOBTITLE AS jobTitle
    FROM ZABCDRECORD
    WHERE (fullName IS NOT NULL AND fullName != '')
    ORDER BY fullName;
    `;

  const contacts = await executeSQL<Contact>(databasePath, query);
  contacts.map((contact) => (contact.database = databasePath));

  return contacts;
}

export async function getAllContacts(): Promise<Contact[]> {
  const allContacts = await Promise.all(
    getDatabaseFiles().map(async (file) => {
      return await getContacts(file);
    }),
  );

  return allContacts.flat().sort((a, b) => a.fullName.localeCompare(b.fullName));
}
