export interface SwitchButtonStylesType {
    defaultProps: {
        color: string;
        label: string;
        ripple: boolean;
        className: string;
        disabled: boolean;
        containerProps: object;
        labelProps: object;
        circleProps: object;
    };
    valid: {
        colors: string[];
    };
    styles: {
        base: {
            root: object;
            container: object;
            input: object;
            circle: object;
            ripple: object;
            label: object;
            disabled: object;
        };
        colors: object;
    };
}