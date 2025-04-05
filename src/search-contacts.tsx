import { ActionPanel, closeMainWindow, List, PopToRootType, showToast, Toast } from "@raycast/api";
import { getAvatarIcon } from "@raycast/utils";
import { useEffect, useState } from "react";
import { getAllContacts, openInContacts } from "./contacts";
import { Contact } from "./types";

interface State {
  contacts?: Contact[];
  error?: Error;
}

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchContacts() {
      try {
        const contacts = await getAllContacts();
        setState({ contacts: contacts });
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Could not load contacts.",
          message: error instanceof Error ? error.message : "Something went wrong.",
        });
      }
    }

    fetchContacts();
  }, []);

  return (
    <List isLoading={!state.contacts}>
      {state.contacts?.map((contact) => <ContactListItem contact={contact} key={contact.globalId} />)}
    </List>
  );
}

function ContactListItem(props: { contact: Contact }) {
  const subtitle = [props.contact.jobTitle, props.contact.organization].filter((item) => item).join(", ");
  const icon = getAvatarIcon(props.contact.fullName);
  return (
    <List.Item
      title={props.contact.fullName}
      subtitle={subtitle}
      icon={icon}
      actions={<Actions contact={props.contact} />}
    />
  );
}

function Actions(props: { contact: Contact }) {
  const openInContactsAction = () => {
    closeMainWindow({ popToRootType: PopToRootType.Immediate });
    openInContacts(props.contact);
  };
  return (
    <ActionPanel title={props.contact.fullName}>
      <ActionPanel.Item title="Open in Contacts" onAction={openInContactsAction} />
    </ActionPanel>
  );
}
