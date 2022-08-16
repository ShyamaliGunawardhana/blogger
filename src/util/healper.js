function formatString(text, id) {
    return id ? text.replace('{}', id) : text;
}

function isNullUndefinedOrEmpty(text) {
    return text == null || text == null || text == null;
}


export function helperUtil() {
    return {
        formatString: formatString,
        isNullUndefinedOrEmpty: isNullUndefinedOrEmpty
    }
}