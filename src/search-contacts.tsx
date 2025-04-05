import { List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { getAllContacts } from "./contacts";
import { Contact } from "./types";
import { getAvatarIcon } from "@raycast/utils";

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
        setState({ error: error instanceof Error ? error : new Error("Something went wrong.") });
      }
    }

    fetchContacts();
  }, []);

  if (state.error) {
    showToast({
      style: Toast.Style.Failure,
      title: "Failed loading stories",
      message: state.error.message,
    });
  }

  return (
    <List isLoading={!state.contacts && !state.error}>
      {state.contacts?.map((contact) => <ContactListItem contact={contact} key={contact.id} />)}
    </List>
  );
}

function ContactListItem(props: { contact: Contact }) {
  const subtitle = [props.contact.jobTitle, props.contact.organization].filter((item) => item).join(", ");
  const icon = getAvatarIcon(props.contact.fullName);
  return <List.Item title={props.contact.fullName} subtitle={subtitle} icon={icon} />;
}
