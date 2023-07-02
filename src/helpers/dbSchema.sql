create table contact(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
    phoneNumber VARCHAR(15),
    email VARCHAR(15),
    linkedId INT(11),
    linkPrecedence ENUM('secondary', 'primary') DEFAULT 'primary',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
)
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

