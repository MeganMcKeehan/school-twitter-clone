import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { useMessageActions } from "../toaster/MessageHooks";

interface props {
  name: string;
  icon: string;
}

const OAuthButton = (props: props) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  const infoMessageText = `${props.name} registration is not implemented.`;
  const toolTipId = `${props.name}Tooltip`;

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() => displayInfoMessageWithDarkBackground(infoMessageText)}
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={toolTipId}>{props.name}</Tooltip>}
      >
        <FontAwesomeIcon icon={["fab", props.icon as IconName]} />
      </OverlayTrigger>
    </button>
  );
};

export default OAuthButton;
