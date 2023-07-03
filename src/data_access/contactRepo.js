const { contactTableName } = require("../helpers/constant");
const { executeQuery } = require("../helpers/db-utils");

const createContactRecord = async (keys, values) => {
    const insertContactQuery = `insert into ${contactTableName} (${keys}) values (${values});`;
    const insertContactResult = await executeQuery(insertContactQuery);
    return insertContactResult;
};


const updateContactUsingId = async (data, id) => {

    const updateContactQuery = `update ${contactTableName} set linkedId = ${data["linkedId"]}, linkPrecedence = '${data["linkPrecedence"]}', updatedAt = '${data['updatedAt']}' where id  = ${id};`;
    const updateContactResult = await executeQuery(updateContactQuery);
    return updateContactResult;

}

const selectContactUsingEmail = async (data) => {

    const contactSelectQuery = `select * from ${contactTableName} where email = "${data["email"]}" order by createdAt;`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

const selectContactUsingPhone = async (data) => {

    const contactSelectQuery = `select * from ${contactTableName} where phoneNumber = "${data["phoneNumber"]}" order by createdAt;`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

const selectSecondaryContactUsingId = async (id) => {

    const contactSelectQuery = `select * from ${contactTableName} where linkedId = "${id}" and linkPrecedence = "secondary" order by createdAt;`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}


const selectContactUsingPhoneEmail = async (data) => {

    const contactSelectQuery = `select * from ${contactTableName} where email = "${data["email"]}" or phoneNumber = "${data["phoneNumber"]}" order by createdAt;`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

const selectContactUsingLinkedId = async (linkedId) => {
    const contactSelectQuery = `select * from ${contactTableName} where linkedId = ${linkedId} order by createdAt;`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

const selectExistingContact = async (data) => {
    const contactSelectQuery = `select * from ${contactTableName} where email = "${data["email"]}" and phoneNumber = "${data["phoneNumber"]}" order by createdAt;`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

const selectContactUsingId = async (id) => {
    const contactSelectQuery = `select * from ${contactTableName} where id = ${id} order by createdAt;`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

module.exports = {
    createContactRecord,
    updateContactUsingId,
    selectContactUsingEmail,
    selectContactUsingPhone,
    selectContactUsingPhoneEmail,
    selectExistingContact,
    selectContactUsingLinkedId,
    selectSecondaryContactUsingId,
    selectContactUsingId
}