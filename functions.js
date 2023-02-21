const { PermissionsBitField } = require('discord.js');


function checkPerms(client, message) {
    return message.channel.permissionsFor(client.user.id).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.CreateInstantInvite
    ])
}
module.exports = checkPerms;