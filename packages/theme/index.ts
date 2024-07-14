import plugin from "tailwindcss/plugin";
import twColors from "tailwindcss/colors";
import colors from "./colors";

export const wolfdenui = function () {
    return plugin(
        function ({}) {
            // Add color palette
        },
        {
            theme: {
                colors: {
                    ...twColors,
                    ...colors,
                },
            },
        }
    );
};
