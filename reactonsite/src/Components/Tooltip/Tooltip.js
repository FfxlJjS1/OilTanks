import React from "react"

import './Tooltip.css';

export function Tooltip({
    children,
    tooltipText = "Tooltip Text",
    position = "right",
}) {
    const tooltipTextArea = (tooltipText) => {
        const content = []

        tooltipText = tooltipText.split("\\n");

        content.push(tooltipText[0]);

        for (var index = 1; index < tooltipText.length; index++) {
            content.push(<br />);

            content.push(tooltipText[index]);
        }

        return content;
    };

    return (
        <div className="tooltip-trigger">
            {children}
            <div className={`tooltip tooltip-${position}`}>
                {tooltipTextArea(tooltipText)}
            </div>
        </div>
    )
}

export function TooltipTr({
    children,
    tooltipText = "Tooltip Text",
    position = "right",
}) {
    const tooltipTextArea = (tooltipText) => {
        const content = []

        tooltipText = tooltipText.split("\\n");

        content.push(tooltipText[0]);

        for (var index = 1; index < tooltipText.length; index++) {
            content.push(<br />);

            content.push(tooltipText[index]);
        }

        return content;
    };

    return (
        <tr className="tooltip-trigger">
            {children}
            <div className={`tooltip tooltip-${position}`}>
                {tooltipTextArea(tooltipText)}
            </div>
        </tr>
    )
}