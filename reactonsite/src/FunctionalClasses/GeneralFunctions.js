export const NumToFormatStr = (num) => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const IsNumber = (value) => {
    if (value instanceof Number)
        value = value.valueOf();

    return isFinite(value) && value === parseInt(value, 10);
}

export const IsNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!

    const floatString = str.replaceAll(',', '.');

    return !isNaN(floatString) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(floatString)) // ...and ensure strings of whitespace fail
}
