const { contactTableName } = require("../helpers/constant");
const { executeQuery } = require("../helpers/db-utils");

const createContactRecord = async (keys, values) => {
    const insertContactQuery = `insert into ${contactTableName} (${keys}) values (${values});`;
    const insertContactResult = await executeQuery(insertContactQuery);
    return insertContactResult;
};


const updateContactUsingId = async (data) => {

}

const selectContactUsingEmail = async (data) => {

    const contactSelectQuery = `select * from ${contactTableName} where email = "${data[email]}";`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

const selectContactUsingPhone = async (data) => {

    const contactSelectQuery = `select * from ${contactTableName} where phoneNumber = "${data[phoneNumber]}";`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

const selectContactUsingPhoneEmail = async (data) => {

    const contactSelectQuery = `select * from ${contactTableName} where email = "${data["email"]}" or phoneNumber = "${data["phoneNumber"]}";`;
    const contactSelectResult = await executeQuery(contactSelectQuery);
    return contactSelectResult;
}

module.exports = {
    createContactRecord,
    updateContactUsingId,
    selectContactUsingEmail,
    selectContactUsingPhone,
    selectContactUsingPhoneEmail,
}