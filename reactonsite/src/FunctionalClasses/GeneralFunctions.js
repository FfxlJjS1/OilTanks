export const NumToFormatStr = (num) => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const IsNumber = (value) => {
    if (value instanceof Number)
        value = value.valueOf(); // Если это объект числа, то берём значение, которое и будет числом

    return isFinite(value) && value === parseInt(value, 10);
}

export const IsNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!

    const string = new String(str.replaceAll(',', '.'));

    return !isNaN(string) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(string)) // ...and ensure strings of whitespace fail
}