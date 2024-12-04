function checkBody(body, keys) {
    let isValid = true;

    for (const field of keys) {
        // console.log({field});
        
        if(!body[field] || body[field] ==='') {
            isValid = false
        }
    }
    console.log({isValid});

    return isValid;
};

module.exports = { checkBody };