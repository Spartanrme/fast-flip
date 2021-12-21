import { getIcon } from "../helpers";
import DOMFactory from "../DOMFactory";

export interface HUDButtonProps {
    title: string;
    icon: string;
    onClick: () => void | Promise<void>;
}

export default function HUDButton(props: HUDButtonProps) {
    return (
        <div className="control-icon" onclick={props.onClick}>
            <img src={getIcon(props.icon)} width={36} height={36} title={props.title} />
        </div>
    );
}
