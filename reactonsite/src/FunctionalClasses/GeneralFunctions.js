export const NumToFormatStr = (num) => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const IsNumber = (value) => {
    if (value instanceof Number)
        value = value.valueOf(); // Если это объект числа, то берём значение, которое и будет числом

    return isFinite(value) && value === parseInt(value, 10);
}

export const IsNumeric = (str) => {
    let string = new String(str);
    string = string.replaceAll(',', '.');

    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}