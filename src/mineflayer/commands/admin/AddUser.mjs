import { Permissions } from "../../../utils/Interfaces.mjs";
import Utils from "../../../utils/Utils.mjs";
import loadPartyCommands from "../../handlers/PartyCommandHandler.mjs";

export default {
  name: ["adduser"],
  ignore: false,
  description: "Adds users to the permission list",
  permission: Permissions.Admin,
  // Eventually a sudo command
  /**
   *
   * @param {import("../../Bot.mjs").default} bot
   * @param {Object} sender
   * @param {Array<String>} args
   */
  execute: async function (bot, sender, args) {
    if (args.length < 2)
      return bot.reply(sender.username, "Usage: adduser <user> <permission>");
    const user = args[0];
    if (bot.utils.getUserObject({ name: args[1] })) {
      const mainUser = args[1];
      let data = bot.utils.playerNamesDatabase.get("data");
      if (!data) data = [];
      const userObject = data.find((x) =>
        x.accounts.find((y) => y.name.toLowerCase() === mainUser.toLowerCase()),
      );
      if (!userObject) {
        bot.reply(sender.username, "User not found");
        return;
      }
      userObject.accounts.push({
        name: user,
        uuid: await bot.utils.getUUID(user),
      });
      data[data.indexOf(userObject)] = userObject;
      bot.utils.playerNamesDatabase.set("data", data);
    } else {
      let permission;
      if (isNaN(args[1]))
        permission = Permissions[Utils.capitalizeFirstLetter(args[1])];
      else permission = parseInt(args[1]);
      if (!permission) {
        bot.reply(sender.username, "Invalid permission");
        return;
      }
      let data = bot.utils.playerNamesDatabase.get("data");
      if (!data) data = [];
      let userObject = data.find((x) =>
        x.accounts.find((y) => y.name.toLowerCase() === user.toLowerCase()),
      );
      if (userObject) {
        userObject.permissionRank = permission;
        data[data.indexOf(userObject)] = userObject;
        bot.utils.playerNamesDatabase.set("data", data);
        bot.reply(sender.username, "User updated");
      } else {
        data.push({
          name: user,
          permissionRank: permission,
          accounts: [
            {
              name: user,
              uuid: await bot.utils.getUUID(user),
            },
          ],
          preferredName: user,
        });
        bot.utils.playerNamesDatabase.set("data", data);
        bot.reply(sender.username, "User added");
      }
    }
  },
};
