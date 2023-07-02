const { selectContactUsingPhoneEmail, createContactRecord } = require("../data_access/contactRepo");

const identifyUser = async(payload) => {
    try {
        const mandateKeys = ["email", "phoneNumber"];
        const hasRequiredFields = mandateKeys.every(keys => payload.hasOwnProperty(keys));
        if(!hasRequiredFields) {
            return {
                "message": "req.body doesn't have the valid parameters"
            }
        }

        var keys = Object.keys(payload).toString();
        var values = Object.values(payload).map(value => `"${value}"`);
        
        const contactRecords = await selectContactUsingPhoneEmail(payload);

        
        if (!contactRecords.length) {                   //when contact doesn't exists
        
            createdContact = await createContactRecord(keys, values);

            return {
                "contact": "created"                    //format output pending
            }
            
        } else if (contactRecords.length == 1) {        //when contact already exists but only have either email or phoneNumber as the match

            keys += ',linkedId,linkPrecedence';
            values.push(`"${contactRecords[0].id}", "secondary"`);

            createdContact = await createContactRecord(keys, values);

            return {
                "contact": "secondary created"          //format output pending
            }
        } 

        //when contact already exists but both email or phoneNumber matches

        const result= "success";

        return {
            "contact": result
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    identifyUser
};