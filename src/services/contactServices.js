const { selectContactUsingPhoneEmail, selectContactUsingPhone, selectContactUsingEmail, createContactRecord, updateContactUsingId, selectExistingContact, selectSecondaryContactUsingId, selectContactUsingId } = require("../data_access/contactRepo");
const { getTimestamp } = require("../helpers/utils");

const identifyUser = async (payload) => {
    const { email, phoneNumber } = payload;
    const alreadyExists = await selectExistingContact(payload);
    var updatedContactRecords, secondaryContactRecords, primaryContactId, phoneExists, emailExists;
    var keys = Object.keys(payload).toString();
    var values = Object.values(payload).map(value => `"${value}"`);


    if (alreadyExists.length) {
        return {
            "message": "contact with the exact same email and phoneNumber already exists"
        }
    }

    if (email && phoneNumber) {
        const contactRecords = await selectContactUsingPhoneEmail(payload);


        if (contactRecords.length > 0) {

            if (contactRecords[0].linkPrecedence == "primary") {
                primaryContactId = contactRecords[0].id;
                const secondaryContacts = contactRecords.slice(1);


                if (secondaryContacts.length > 0) {


                    await Promise.all([
                        selectContactUsingPhone(payload),
                        selectContactUsingEmail(payload)
                      ]).then(results => {
                        phoneExists = results[0]
                        emailExists = results[1]
                      })
                    

                    if (phoneExists.length == 0 || emailExists.length == 0) {
                        keys += ',linkedId,linkPrecedence';
                        values.push(`"${primaryContactId}", "secondary"`);

                        await createContactRecord(keys, values);

                    } else {

                        const data = {
                            "linkedId": primaryContactId,
                            "linkPrecedence": "secondary",
                            "updatedAt": getTimestamp()
                        };


                        for (const contact of secondaryContacts) {
                            await updateContactUsingId(data, contact.id);
                        }
                    }

                } else {

                    keys += ',linkedId,linkPrecedence';
                    values.push(`"${primaryContactId}", "secondary"`);

                    await createContactRecord(keys, values);


                }

            } else {
                primaryContactId = contactRecords[0].linkedId;

                await Promise.all([
                    selectContactUsingPhone(payload),
                    selectContactUsingEmail(payload)
                  ]).then(results => {
                    phoneExists = results[0]
                    emailExists = results[1]
                  })


                if (phoneExists.length == 0 || emailExists.length == 0) {
                    keys += ',linkedId,linkPrecedence';
                    values.push(`"${contactRecords[0].linkedId}", "secondary"`);

                    await createContactRecord(keys, values);

                } else {

                    const data = {
                        "linkedId": primaryContactId,
                        "linkPrecedence": "secondary",
                        "updatedAt": getTimestamp()
                    };


                    for (const contact of secondaryContacts) {
                        await updateContactUsingId(data, contact.id);
                    }
                }
            }

        } else {
            await createContactRecord(keys, values);
            primaryContactId = (await selectContactUsingPhoneEmail(payload))[0].id;
        }

        await Promise.all([
            selectContactUsingPhoneEmail(payload),
            selectSecondaryContactUsingId(primaryContactId)
        ]).then(results => {
            updatedContactRecords = results[0]
            secondaryContactRecords = results[1]
        })

    } else if (phoneNumber) {

        updatedContactRecords = await selectContactUsingPhone(payload);

        if (updatedContactRecords[0].linkPrecedence == "primary") {
            primaryContactId = updatedContactRecords[0].id;
            secondaryContactRecords = await selectSecondaryContactUsingId(primaryContactId);

        } else {
            const primaryContact = await selectContactUsingId(updatedContactRecords[0].linkedId);
            primaryContactId = primaryContact[0].id;
            updatedContactRecords[0] = primaryContact[0];
            secondaryContactRecords = await selectSecondaryContactUsingId(primaryContactId);
        }

    } else if (email) {
        updatedContactRecords = await selectContactUsingEmail(payload);

        if (updatedContactRecords[0].linkPrecedence == "primary") {
            primaryContactId = updatedContactRecords[0].id;
            secondaryContactRecords = await selectSecondaryContactUsingId(primaryContactId);

        } else {
            const primaryContact = await selectContactUsingId(updatedContactRecords[0].linkedId);
            primaryContactId = primaryContact[0].id;
            updatedContactRecords[0] = primaryContact[0];
            secondaryContactRecords = await selectSecondaryContactUsingId(primaryContactId);
        }
    }


    const response = {
        "primaryContactId": primaryContactId,
        "emails": [...new Set([...updatedContactRecords.map((record) => record.email), ...(secondaryContactRecords || []).map((record) => record.email)])],
        "phoneNumbers": [...new Set([...updatedContactRecords.map((record) => record.phoneNumber), ...(secondaryContactRecords || []).map((record) => record.phoneNumber)])],
        "secondaryContactIds": [...new Set([...updatedContactRecords.slice(1).map((record) => record.id), ...(secondaryContactRecords || []).map((record) => record.id)])]
    };


    return {
        "contact": {
            response
        }
    }

}


module.exports = {
    identifyUser
};