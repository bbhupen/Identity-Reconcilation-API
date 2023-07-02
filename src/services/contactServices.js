const identifyUser = async(payload) => {
    try {
        const mandateKeys = ["email", "phoneNumber"];
        const hasRequiredFields = mandateKeys.every(keys => payload.hasOwnProperty(keys));
        if(!hasRequiredFields) {
            return {
                "message": "req.body doesn't have the valid parameters"
            }
        }

        const result= "success" ;

        return {
            "contact": result
        }

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    identifyUser
};